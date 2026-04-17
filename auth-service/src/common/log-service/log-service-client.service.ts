import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { LogDataDto } from './dto';
import { BatchLogsDto } from './dto';

/**
 * 日志服务客户端
 *
 * 职责：
 * - 将日志批量发送到独立的 log-service 服务
 * - 支持攒批发送，减少 HTTP 请求次数
 * - 错误降级，日志发送失败从不影响主流程
 * - 配置驱动，支持开关和参数调整
 */
@Injectable()
export class LogServiceClientService implements OnModuleDestroy {
  private batchQueue: LogDataDto[] = [];
  private timerRef: NodeJS.Timeout | null = null;
  private readonly serviceName = 'auth-service';
  private config: {
    enabled: boolean;
    batchEnabled: boolean;
    batchSize: number;
    batchIntervalMs: number;
    url: string;
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.loadConfig();
    if (this.config.enabled && this.config.batchEnabled) {
      this.startBatchTimer();
    }
  }

  /**
   * 从环境变量加载配置
   */
  private loadConfig(): void {
    this.config = {
      url:
        this.configService.get<string>('LOG_SERVICE_URL') ||
        'http://127.0.0.1:8890',
      enabled:
        this.configService.get<string>('LOG_SERVICE_ENABLED') !== 'false',
      batchEnabled:
        this.configService.get<string>('LOG_SERVICE_BATCH_ENABLED') !== 'false',
      batchSize: parseInt(
        this.configService.get<string>('LOG_SERVICE_BATCH_SIZE') || '10',
        10,
      ),
      batchIntervalMs: parseInt(
        this.configService.get<string>('LOG_SERVICE_BATCH_INTERVAL_MS') ||
          '1000',
        10,
      ),
    };
  }

  /**
   * 启动批量定时器
   */
  private startBatchTimer(): void {
    if (this.timerRef) {
      return;
    }
    this.timerRef = setInterval(() => {
      this.sendBatch();
    }, this.config.batchIntervalMs);
    // 确保定时器不会阻止进程退出
    this.timerRef.unref();
  }

  /**
   * 对外暴露的日志方法
   * 替代原 appendJsonLog(data)
   */
  logJsonLog(data: Record<string, unknown>): void {
    if (!this.config.enabled) {
      // 降级：控制台输出
      console.log('[LOG]', JSON.stringify(data));
      return;
    }

    // 添加 service 标识，区分不同项目日志
    const dataWithService = {
      service: this.serviceName,
      ...data,
    } as Record<string, unknown>;

    // 从 data 中提取已有信息，适配目标接口格式
    const logDto: LogDataDto = {
      timestamp:
        (dataWithService.timestamp as string) || new Date().toISOString(),
      level: (dataWithService.level as string) || 'info',
      data: dataWithService,
    };

    if (this.config.batchEnabled) {
      this.enqueue(logDto);
    } else {
      this.sendImmediately([logDto]);
    }
  }

  /**
   * 日志入队，达到批量大小就发送
   */
  private enqueue(log: LogDataDto): void {
    this.batchQueue.push(log);

    if (this.batchQueue.length >= this.config.batchSize) {
      this.sendBatch();
    }
  }

  /**
   * 发送当前批量
   */
  private sendBatch(): void {
    if (this.batchQueue.length === 0) {
      return;
    }

    const logsToSend = [...this.batchQueue];
    this.batchQueue = [];

    this.sendToRemote(logsToSend).catch(() => {
      // 错误已经在 sendToRemote 处理，这里不做任何处理
      // 保证不抛出异常，不影响主流程
    });
  }

  /**
   * 立即发送单条（不攒批）
   */
  private sendImmediately(logs: LogDataDto[]): void {
    if (logs.length === 0) {
      return;
    }

    this.sendToRemote(logs).catch(() => {
      // 错误已经处理，不影响主流程
    });
  }

  /**
   * 发送日志到远程服务
   */
  private async sendToRemote(logs: LogDataDto[]): Promise<void> {
    const body: BatchLogsDto = { logs };
    const url = `${this.config.url}/api/v1/logs/batch`;

    try {
      const response$ = this.httpService.post(url, body);
      await firstValueFrom(
        response$.pipe(
          catchError((err: AxiosError) => {
            console.warn(
              '[LogServiceClient] Failed to send logs:',
              err.message,
            );
            throw err;
          }),
        ),
      );
    } catch (err) {
      // 捕获所有错误，只打印警告，不抛出异常
      // 保证日志失败永远不影响主流程
      console.warn(
        '[LogServiceClient] Log delivery failed, logs dropped:',
        err,
      );
    }
  }

  /**
   * 模块销毁时，发送剩余日志
   */
  onModuleDestroy(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
    this.sendBatch();
  }
}
