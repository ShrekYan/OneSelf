import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { appendJsonLog } from '@/common/utils/file-logger';

/**
 * 清理服务
 * 负责定时清理数据库中过期的冗余数据，保持表体积稳定
 */
@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private readonly enabled: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.enabled = this.configService.get<boolean>('CLEANUP_ENABLED', true);
    if (this.enabled) {
      this.logger.log('Cleanup service enabled, scheduled tasks will run');
    } else {
      this.logger.log('Cleanup service disabled by configuration');
    }
  }

  /**
   * 每天凌晨 2 点执行：清理已过期且已撤销的 refresh_token
   * 删除 expired_at < 当前时间 且 revoked = true 的记录
   *
   * 为什么选择凌晨 2 点：
   * - 访问量最低，对在线业务影响最小
   * - 清理操作会删除数据，避免高峰时段影响性能
   */
  @Cron('0 0 2 * * *')
  async cleanupExpiredRefreshTokens() {
    if (!this.enabled) {
      this.logger.debug('Cleanup disabled, skipping');
      return;
    }

    const startTime = Date.now();
    const now = BigInt(Date.now());

    try {
      const result = await this.prismaService.refreshTokens.deleteMany({
        where: {
          expires_at: { lt: now },
          revoked: true,
        },
      });

      const deletedCount = result.count;
      const elapsed = Date.now() - startTime;

      this.logger.log(
        `Cleanup completed: deleted ${deletedCount} expired revoked refresh tokens, elapsed ${elapsed}ms`,
      );

      appendJsonLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        context: CleanupService.name,
        message: `Cleanup completed: deleted ${deletedCount} expired revoked refresh tokens`,
        deletedCount,
        elapsedMs: elapsed,
        env: process.env.NODE_ENV || 'development',
      });
    } catch (error) {
      const elapsed = Date.now() - startTime;
      this.logger.error(
        `Cleanup failed after ${elapsed}ms: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );

      appendJsonLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        context: CleanupService.name,
        message: `Cleanup failed after ${elapsed}ms`,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        env: process.env.NODE_ENV || 'development',
      });
    }
  }
}
