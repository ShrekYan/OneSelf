import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { appendJsonLog } from '@/common/utils/file-logger';

/**
 * 缓存用户信息数据结构
 * 与 users 表结构对应，包含登录和其他场景需要的所有字段
 */
export interface CachedUserInfo {
  id: string;
  username: string;
  password_hash: string;
  password_algorithm: string | null;
  email: string | null;
  nickname: string | null;
  avatar: string | null;
  is_active: boolean;
  created_at: bigint;
  updated_at: bigint;
}

/**
 * 用户信息缓存服务
 * 将用户完整信息缓存到 Redis，减少数据库查询，提升性能
 * 支持跨模块复用（登录、文章作者信息、个人主页等场景）
 */
@Injectable()
export class UserCacheService {
  private readonly logger = new Logger(UserCacheService.name);
  private readonly userInfoCacheTtl = 86400; // 缓存过期时间（秒）= 1天

  constructor(private readonly redisService: RedisService) {}

  /**
   * 生成用户信息缓存键
   * @param username - 用户名
   * @returns 缓存键
   */
  private getCacheKey(username: string): string {
    return `user:info:${username}`;
  }

  /**
   * 获取缓存的用户全信息
   * @param username - 用户名
   * @returns 缓存的用户信息，如果缓存未命中或 Redis 出错返回 null
   */
  async getCachedUserInfo(username: string): Promise<CachedUserInfo | null> {
    const cacheKey = this.getCacheKey(username);

    try {
      const cached = await this.redisService.get(cacheKey);
      if (!cached) {
        return null;
      }
      try {
        return JSON.parse(cached) as CachedUserInfo;
      } catch {
        // JSON 解析失败，删除无效缓存返回 null
        await this.redisService.del(cacheKey);
        return null;
      }
    } catch (error) {
      // Redis 出错不阻塞，降级到数据库查询
      this.logger.warn(
        `Redis get user info cache failed, fallback to database: ${error instanceof Error ? error.message : String(error)}`,
      );
      appendJsonLog({
        timestamp: new Date().toISOString(),
        level: 'warn',
        context: UserCacheService.name,
        message: 'Redis get user info cache failed, fallback to database',
        error: error instanceof Error ? error.message : String(error),
        env: process.env.NODE_ENV || 'development',
      });
      return null;
    }
  }

  /**
   * 设置用户信息缓存
   * @param username - 用户名
   * @param userInfo - 用户信息
   */
  async setUserInfoCache(
    username: string,
    userInfo: CachedUserInfo,
  ): Promise<void> {
    const cacheKey = this.getCacheKey(username);

    try {
      // 序列化前将 bigint 转换为 number（JSON.stringify 不支持 bigint）
      // created_at / updated_at 是时间戳，数值在 Number.MAX_SAFE_INTEGER 范围内，转换安全
      const serialized = {
        ...userInfo,
        created_at: Number(userInfo.created_at),
        updated_at: Number(userInfo.updated_at),
      };
      const json = JSON.stringify(serialized);
      await this.redisService.set(cacheKey, json, 'EX', this.userInfoCacheTtl);
      this.logger.debug(
        `User info cached for username=${username}, ttl=${this.userInfoCacheTtl}s`,
      );
    } catch (error) {
      // 缓存写入失败不影响主流程
      this.logger.warn(
        `Failed to cache user info for username=${username}: ${error instanceof Error ? error.message : String(error)}`,
      );
      appendJsonLog({
        timestamp: new Date().toISOString(),
        level: 'warn',
        context: UserCacheService.name,
        message: `Failed to cache user info for username=${username}`,
        error: error instanceof Error ? error.message : String(error),
        env: process.env.NODE_ENV || 'development',
      });
    }
  }

  /**
   * 删除用户信息缓存（用户信息更新后调用）
   * @param username - 用户名
   */
  async deleteUserInfoCache(username: string): Promise<void> {
    const cacheKey = this.getCacheKey(username);
    try {
      await this.redisService.del(cacheKey);
      this.logger.debug(`User info cache deleted for username=${username}`);
    } catch {
      // 忽略删除错误，缓存会自然过期
    }
  }
}
