import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { LogServiceClientService } from '@/common/log-service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly maxRetries = 5;
  private readonly initialRetryDelay = 1000;
  private readonly redis: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logServiceClient: LogServiceClientService,
  ) {
    const host = configService.get<string>('REDIS_HOST') || 'localhost';
    const port = parseInt(
      configService.get<string>('REDIS_PORT') || '6379',
      10,
    );
    const password = configService.get<string>('REDIS_PASSWORD');
    const db = parseInt(configService.get<string>('REDIS_DB') || '0', 10);

    this.redis = new Redis({
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
    this.redis.disconnect();
    const msg = 'Redis disconnected successfully';
    this.logger.log(msg);
    this.logServiceClient.logJsonLog({
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
      await this.redis.connect();
      const host = this.redis.options.host;
      const port = this.redis.options.port;
      const db = this.redis.options.db;

      if (retryCount > 0) {
        const msg = `Redis connected successfully after ${retryCount} retries, host=${host}, port=${port}, db=${db}`;
        this.logger.log(msg);
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          context: RedisService.name,
          message: msg,
          env: process.env.NODE_ENV || 'development',
        });
      } else {
        const msg = `Redis connected successfully, host=${host}, port=${port}, db=${db}`;
        this.logger.log(msg);
        this.logServiceClient.logJsonLog({
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
        this.logServiceClient.logJsonLog({
          timestamp: new Date().toISOString(),
          level: 'warn',
          context: RedisService.name,
          message: msg,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          env: process.env.NODE_ENV || 'development',
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        await this.connectWithRetry(retryCount + 1);
      } else {
        const msg = `Redis connection failed after ${this.maxRetries} retries. Giving up.`;
        this.logger.error(msg, error);
        this.logServiceClient.logJsonLog({
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
      this.logServiceClient.logJsonLog({
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
      await this.redis.ping();
      return true;
    } catch (error) {
      const msg = 'Redis health check failed';
      this.logger.error(msg, error);
      this.logServiceClient.logJsonLog({
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
   * 获取原始 Redis 客户端（用于高级操作）
   */
  getRawClient(): Redis {
    return this.redis;
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
    this.logServiceClient.logJsonLog({
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
   * 获取值
   * @param key - Redis 键
   * @returns 值或者 null
   */
  async get(key: string): Promise<string | null> {
    try {
      const result = await this.redis.get(key);
      this.logRedisOperation('get', key, true);
      return result;
    } catch (error) {
      this.logRedisOperation('get', key, false, error as Error);
      throw error;
    }
  }

  /**
   * 设置值
   * 支持所有 ioredis set 选项（EX、PX、NX、XX 等）
   * @param key - Redis 键
   * @param value - 值
   * @param args - 额外选项参数
   * @returns 'OK'
   */
  async set(
    key: string,
    value: string | number | Buffer,
    ...args: (string | number)[]
  ): Promise<'OK'> {
    try {
      // @ts-expect-error - ioredis 会正确处理可变参数
      const result = await this.redis.set(key, value, ...args);
      this.logRedisOperation('set', key, true);
      return result;
    } catch (error) {
      this.logRedisOperation('set', key, false, error as Error);
      throw error;
    }
  }

  /**
   * 删除键
   * 支持删除单个或多个键
   * @param keys - 要删除的键列表
   * @returns 删除的键数量
   */
  async del(...keys: string[]): Promise<number> {
    try {
      const result = await this.redis.del(...keys);
      // 对每个键都记录日志
      keys.forEach(key => {
        this.logRedisOperation('del', key, true);
      });
      return result;
    } catch (error) {
      const firstKey = keys.length > 0 ? keys[0] : 'unknown';
      this.logRedisOperation('del', firstKey, false, error as Error);
      throw error;
    }
  }

  /**
   * Ping Redis 服务器
   */
  async ping(): Promise<string> {
    return this.redis.ping();
  }

  /**
   * 创建流水线
   */
  pipeline(): ReturnType<Redis['pipeline']> {
    return this.redis.pipeline();
  }

  /**
   * Scan keys - 转发所有参数到原生 scan 方法
   */

  scan(...args: any[]): Promise<[string, string[]]> {
    return (this.redis.scan as any)(...args);
  }
}
