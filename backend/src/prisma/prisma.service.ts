import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = 5;
  private readonly initialRetryDelay = 1000;
  private readonly slowQueryThreshold = 1000; // 慢查询阈值（毫秒）

  constructor() {
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
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting from database', error);
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
        this.logger.log(
          `Database connected successfully after ${retryCount} retries`,
        );
      } else {
        this.logger.log('Database connected successfully');
      }
    } catch (error) {
      if (retryCount < this.maxRetries) {
        const delay = this.initialRetryDelay * Math.pow(2, retryCount);
        this.logger.warn(
          `Database connection failed, retrying in ${delay}ms... (attempt ${
            retryCount + 1
          }/${this.maxRetries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        await this.connectWithRetry(retryCount + 1);
      } else {
        this.logger.error(
          `Database connection failed after ${this.maxRetries} retries. Giving up.`,
          error,
        );
        throw error;
      }
    }
  }

  /**
   * 设置事件日志记录
   * 包括慢查询警告和错误日志
   */
  private setupEventLogging(): void {
    // 由于 Prisma 类型系统的限制，需要使用 any 绕过类型检查
    // 但运行时这些事件确实存在且能正常工作
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    (this.$on as any)('query', (e: { duration: number; query: string }) => {
      if (e.duration > this.slowQueryThreshold) {
        this.logger.warn(
          `Slow query detected: duration=${e.duration}ms, query=${e.query}`,
        );
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    (this.$on as any)('error', (e: { message: string; target: string }) => {
      this.logger.error(`Database error: ${e.message}`, e.target);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    (this.$on as any)('warn', (e: { message: string; target: string }) => {
      this.logger.warn(`Database warning: ${e.message}`, e.target);
    });
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
      this.logger.error('Health check failed', error);
      return false;
    }
  }
}
