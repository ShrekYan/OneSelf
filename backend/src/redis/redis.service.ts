import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { appendJsonLog } from '@/common/utils/file-logger';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);
  private readonly maxRetries = 5;
  private readonly initialRetryDelay = 1000;

  constructor(private readonly configService: ConfigService) {
    const host = configService.get<string>('REDIS_HOST') || 'localhost';
    const port = parseInt(
      configService.get<string>('REDIS_PORT') || '6379',
      10,
    );
    const password = configService.get<string>('REDIS_PASSWORD');
    const db = parseInt(configService.get<string>('REDIS_DB') || '0', 10);

    super({
      host,
      port,
      password: password || undefined,
      db,
      lazyConnect: true,
      connectTimeout: 5000,
      maxRetriesPerRequest: 3,
    });
  }

  async onModuleInit() {
    await this.connectWithRetry();
    this.checkSecurityConfiguration();
  }

  onModuleDestroy() {
    this.disconnect();
    const msg = 'Redis disconnected successfully';
    this.logger.log(msg);
    appendJsonLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      context: RedisService.name,
      message: msg,
      env: process.env.NODE_ENV || 'development',
    });
  }

  /**
   * 带重试的 Redis 连接
   * 使用指数退避策略：每次重试间隔翻倍
   */
  private async connectWithRetry(retryCount = 0): Promise<void> {
    try {
      await this.connect();
      const host = this.options.host;
      const port = this.options.port;
      const db = this.options.db;

      if (retryCount > 0) {
        const msg = `Redis connected successfully after ${retryCount} retries, host=${host}, port=${port}, db=${db}`;
        this.logger.log(msg);
        appendJsonLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          context: RedisService.name,
          message: msg,
          env: process.env.NODE_ENV || 'development',
        });
      } else {
        const msg = `Redis connected successfully, host=${host}, port=${port}, db=${db}`;
        this.logger.log(msg);
        appendJsonLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          context: RedisService.name,
          message: msg,
          env: process.env.NODE_ENV || 'development',
        });
      }
    } catch (error) {
      if (retryCount < this.maxRetries) {
        const delay = this.initialRetryDelay * Math.pow(2, retryCount);
        const msg = `Redis connection failed, retrying in ${delay}ms... (attempt ${retryCount + 1}/${this.maxRetries})`;
        this.logger.warn(msg);
        appendJsonLog({
          timestamp: new Date().toISOString(),
          level: 'warn',
          context: RedisService.name,
          message: msg,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          env: process.env.NODE_ENV || 'development',
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
        await this.connectWithRetry(retryCount + 1);
      } else {
        const msg = `Redis connection failed after ${this.maxRetries} retries. Giving up.`;
        this.logger.error(msg, error);
        appendJsonLog({
          timestamp: new Date().toISOString(),
          level: 'error',
          context: RedisService.name,
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
   * 检查安全配置
   * - 生产环境必须设置密码
   */
  private checkSecurityConfiguration(): void {
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    const isProduction = nodeEnv === 'production';
    const password = this.configService.get<string>('REDIS_PASSWORD');

    if (isProduction && (!password || password.trim().length === 0)) {
      const msg =
        '⚠️  Security warning: Redis password is not configured in production. This is insecure.';
      this.logger.warn(msg);
      appendJsonLog({
        timestamp: new Date().toISOString(),
        level: 'warn',
        context: RedisService.name,
        message: msg,
        env: nodeEnv,
      });
    }
  }

  /**
   * 检查 Redis 连接是否健康
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.ping();
      return true;
    } catch (error) {
      const msg = 'Redis health check failed';
      this.logger.error(msg, error);
      appendJsonLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        context: RedisService.name,
        message: msg,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        env: process.env.NODE_ENV || 'development',
      });
      return false;
    }
  }

  /**
   * 记录 Redis 操作日志到自定义日志系统
   * @param operation - 操作类型
   * @param key - Redis 键
   * @param success - 是否成功
   * @param error - 错误对象（失败时）
   */
  private logRedisOperation(
    operation: 'get' | 'set' | 'del',
    key: string,
    success: boolean,
    error?: Error,
  ): void {
    appendJsonLog({
      timestamp: new Date().toISOString(),
      level: success ? 'debug' : 'error',
      context: RedisService.name,
      message: `Redis ${operation} operation ${success ? 'succeeded' : 'failed'}`,
      operation,
      key,
      error: error
        ? error instanceof Error
          ? error.message
          : String(error)
        : undefined,
      env: process.env.NODE_ENV || 'development',
    });
  }

  /**
   * 重写 get 方法，添加操作日志
   * @param key - Redis 键
   * @returns 值或者 null
   */
  override async get(key: string): Promise<string | null> {
    try {
      const result = await super.get(key);
      this.logRedisOperation('get', key, true);
      return result;
    } catch (error) {
      this.logRedisOperation('get', key, false, error as Error);
      throw error;
    }
  }

  /**
   * 重写 set 方法，添加操作日志
   * 支持 ioredis set 的可变参数形式
   * @param key - Redis 键
   * @param value - 值
   * @param args - 额外参数（如 EX, EX 10 等）
   * @returns 'OK'
   */
  override async set(
    key: string,
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ): Promise<'OK'> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await super.set(key, value, ...args);
      this.logRedisOperation('set', key, true);
      return result;
    } catch (error) {
      this.logRedisOperation('set', key, false, error as Error);
      throw error;
    }
  }

  /**
   * 重写 del 方法，添加操作日志
   * 支持 ioredis del 的所有重载形式（删除单个/多个键，带/不带回调）
   * @returns 删除的键数量
   */
  override del(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ): Promise<number> {
    try {
      // 提取键列表（排除回调函数）
      const keys = args.filter(
        (arg) => typeof arg === 'string' || Buffer.isBuffer(arg),
      ) as string[];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = super.del(...args);

      // 对每个删除的键都记录日志（只记录 string 类型的键）
      keys.forEach((key) => {
        if (typeof key === 'string') {
          this.logRedisOperation('del', key, true);
        }
      });

      return result;
    } catch (error) {
      // 第一个键用于日志
      const keys = args.filter(
        (arg) => typeof arg === 'string' || Buffer.isBuffer(arg),
      ) as string[];
      const firstKey = keys.length > 0 ? keys[0] : 'unknown';
      this.logRedisOperation('del', String(firstKey), false, error as Error);
      throw error;
    }
  }
}
