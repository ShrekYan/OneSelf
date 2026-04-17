import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { LogServiceClientService } from '@/common/log-service';

 

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = 5;
  private readonly initialRetryDelay = 1000;
  private readonly slowQueryThreshold = 1000; // 慢查询阈值（毫秒）

  constructor(
    private readonly configService: ConfigService,
    private readonly logServiceClient: LogServiceClientService,
  ) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
    this.setupEventLogging();
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      const msg = 'Database disconnected successfully';
      this.logger.log(msg);
      this.logServiceClient.logJsonLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        context: PrismaService.name,
        message: msg,
        env: process.env.NODE_ENV || 'development',
      });
    } catch (error) {
      const msg = 'Error disconnecting from database';
      this.logger.error(msg, error);
      this.logServiceClient.logJsonLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        context: PrismaService.name,
        message: msg,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        env: process.env.NODE_ENV || 'development',
      });
    }
  }

  /**
   * 带重试的数据库连接
   * 使用指数退避策略：每次重试间隔翻倍
   */
  private async connectWithRetry(retryCount = 0): Promise<void> {
    try {
      await this.$connect();
      if (retryCount > 0) {
        const msg = `Database connected successfully after ${retryCount} retries`;
        this.logger.log(msg);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          context: PrismaService.name,
          message: msg,
          env: process.env.NODE_ENV || 'development',
        });
      } else {
        const msg = 'Database connected successfully';
        this.logger.log(msg);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          context: PrismaService.name,
          message: msg,
          env: process.env.NODE_ENV || 'development',
        });
      }

      // 解析并记录连接池配置
      const databaseUrl = this.configService.get<string>('DATABASE_URL');
      const connectionLimitMatch = databaseUrl?.match(/connection_limit=(\d+)/);
      const poolTimeoutMatch = databaseUrl?.match(/pool_timeout=(\d+)/);
      const connectTimeoutMatch = databaseUrl?.match(/connect_timeout=(\d+)/);

      if (connectionLimitMatch?.[1]) {
        const msg = `Connection pool configuration: connection_limit=${connectionLimitMatch[1]}`;
        this.logger.log(msg);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          context: PrismaService.name,
          message: msg,
          env: process.env.NODE_ENV || 'development',
          connectionLimit: parseInt(connectionLimitMatch[1], 10),
          poolTimeout: poolTimeoutMatch?.[1]
            ? parseInt(poolTimeoutMatch[1], 10)
            : undefined,
          connectTimeout: connectTimeoutMatch?.[1]
            ? parseInt(connectTimeoutMatch[1], 10)
            : undefined,
        });
      } else {
        const msg =
          'Connection pool configuration: using default connection_limit=10';
        this.logger.log(msg);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          context: PrismaService.name,
          message: msg,
          env: process.env.NODE_ENV || 'development',
          connectionLimit: 10,
        });
      }
    } catch (error) {
      if (retryCount < this.maxRetries) {
        const delay = this.initialRetryDelay * Math.pow(2, retryCount);
        const msg = `Database connection failed, retrying in ${delay}ms... (attempt ${
          retryCount + 1
        }/${this.maxRetries})`;
        this.logger.warn(msg);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'warn',
          context: PrismaService.name,
          message: msg,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          env: process.env.NODE_ENV || 'development',
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
        await this.connectWithRetry(retryCount + 1);
      } else {
        const msg = `Database connection failed after ${this.maxRetries} retries. Giving up.`;
        this.logger.error(msg, error);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'error',
          context: PrismaService.name,
          message: msg,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          env: process.env.NODE_ENV || 'development',
        });
        throw error;
      }
    }
  }

  /**
   * 设置事件日志记录
   * 包括慢查询警告和错误日志
   */
  private setupEventLogging(): void {
    // 由于 Prisma 类型系统的限制，需要使用未知类型绕过类型检查
    // 但运行时这些事件确实存在且能正常工作

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$on as unknown as (...args: any[]) => void)(
      'query',
      (e: { duration: number; query: string }) => {
        if (e.duration > this.slowQueryThreshold) {
          const msg = `Slow query detected: duration=${e.duration}ms, query=${e.query}`;
          this.logger.warn(msg);
          this.logServiceClient.logJsonLog({
            timestamp: new Date().toISOString(),
            level: 'warn',
            context: PrismaService.name,
            message: msg,
            query: e.query,
            duration: e.duration,
            env: process.env.NODE_ENV || 'development',
          });
        }
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$on as unknown as (...args: any[]) => void)(
      'error',
      (e: { message: string; target: string }) => {
        const msg = `Database error: ${e.message}`;
        this.logger.error(msg, e.target);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'error',
          context: PrismaService.name,
          message: msg,
          target: e.target,
          env: process.env.NODE_ENV || 'development',
        });
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$on as unknown as (...args: any[]) => void)(
      'warn',
      (e: { message: string; target: string }) => {
        const msg = `Database warning: ${e.message}`;
        this.logger.warn(msg, e.target);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'warn',
          context: PrismaService.name,
          message: msg,
          target: e.target,
          env: process.env.NODE_ENV || 'development',
        });
      },
    );
  }

  /**
   * 检查数据库连接是否健康
   */
  async isConnected(): Promise<boolean> {
    try {
      // 执行一个简单的查询来测试连接
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      const msg = 'Health check failed';
      this.logger.error(msg, error);
      this.logServiceClient.logJsonLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        context: PrismaService.name,
        message: msg,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        env: process.env.NODE_ENV || 'development',
      });
      return false;
    }
  }
}
