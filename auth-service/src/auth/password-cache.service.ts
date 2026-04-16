import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';
import { appendJsonLog } from '@/common/utils/file-logger';

/**
 * 密码缓存服务
 * 将用户密码哈希缓存到 Redis 减少数据库查询
 * 分层设计：依赖 RedisService 基础设施层，专注业务缓存逻辑
 */
@Injectable()
export class PasswordCacheService {
  private readonly logger = new Logger(PasswordCacheService.name);
  private readonly passwordCacheTtl = 3600; // 密码缓存过期时间（秒）= 1小时

  constructor(private readonly redisService: RedisService) {}

  /**
   * 生成缓存键
   * @param username - 用户名
   * @returns 缓存键
   */
  private getCacheKey(username: string): string {
    return `login:password:${username}`;
  }

  /**
   * 获取缓存的密码哈希
   * @param username - 用户名
   * @returns 缓存的密码哈希，如果缓存未命中或 Redis 出错返回 null
   */
  async getCachedPasswordHash(username: string): Promise<string | null> {
    const cacheKey = this.getCacheKey(username);

    try {
      const cached = await this.redisService.get(cacheKey);
      return cached;
    } catch (error) {
      // Redis 出错不阻塞，降级到数据库查询
      this.logger.warn(
        `Redis get password cache failed, fallback to database: ${error instanceof Error ? error.message : String(error)}`,
      );
      appendJsonLog({
        timestamp: new Date().toISOString(),
        level: 'warn',
        context: PasswordCacheService.name,
        message: 'Redis get password cache failed, fallback to database',
        error: error instanceof Error ? error.message : String(error),
        env: process.env.NODE_ENV || 'development',
      });
      return null;
    }
  }

  /**
   * 删除用户密码缓存
   * @param username - 用户名
   */
  async deletePasswordCache(username: string): Promise<void> {
    const cacheKey = this.getCacheKey(username);
    try {
      await this.redisService.del(cacheKey);
    } catch {
      // 忽略删除错误
    }
  }

  /**
   * 设置密码缓存
   * @param username - 用户名
   * @param passwordHash - 密码哈希
   */
  async setPasswordCache(
    username: string,
    passwordHash: string,
  ): Promise<void> {
    const cacheKey = this.getCacheKey(username);

    try {
      await this.redisService.set(
        cacheKey,
        passwordHash,
        'EX',
        this.passwordCacheTtl,
      );
      this.logger.debug(
        `Password cached for username=${username}, ttl=${this.passwordCacheTtl}s`,
      );
    } catch (error) {
      // 缓存写入失败不影响登录流程
      this.logger.warn(
        `Failed to cache password for username=${username}: ${error instanceof Error ? error.message : String(error)}`,
      );
      appendJsonLog({
        timestamp: new Date().toISOString(),
        level: 'warn',
        context: PasswordCacheService.name,
        message: `Failed to cache password for username=${username}`,
        error: error instanceof Error ? error.message : String(error),
        env: process.env.NODE_ENV || 'development',
      });
    }
  }

  /**
   * 更新密码缓存（用于密码迁移后）
   * @param username - 用户名
   * @param newPasswordHash - 新的密码哈希
   */
  async updatePasswordCacheAfterMigration(
    username: string,
    newPasswordHash: string,
  ): Promise<void> {
    const cacheKey = this.getCacheKey(username);

    try {
      await this.redisService.set(
        cacheKey,
        newPasswordHash,
        'EX',
        this.passwordCacheTtl,
      );
    } catch (error) {
      // 更新缓存失败不影响，下次从数据库加载
      this.logger.warn(
        `Failed to update cache after migration for user ${username}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
