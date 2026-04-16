import { Injectable } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';

export interface RefreshTokenData {
  userId: string;
  expiresAt: number; // 过期时间戳（毫秒）
  clientIp: string;
  createdAt: number; // 创建时间戳（毫秒）
}

@Injectable()
export class RefreshTokenRedisService {
  constructor(private redis: RedisService) {}

  /**
   * 计算 TTL（秒）：过期时间 - 当前时间
   */
  private getTtl(expiresAt: number): number {
    const now = Date.now();
    const ttl = Math.ceil((expiresAt - now) / 1000);
    return ttl > 0 ? ttl : 0;
  }

  /**
   * 获取 Token 的 Redis Key
   */
  private getTokenKey(token: string): string {
    return `refresh:token:${token}`;
  }

  /**
   * 获取用户 Token 集合的 Redis Key
   */
  private getUserTokensKey(userId: string): string {
    return `refresh:user:${userId}`;
  }

  /**
   * 保存 Refresh Token 到 Redis
   */
  async saveRefreshToken(
    token: string,
    userId: string,
    expiresAt: number,
    clientIp: string,
  ): Promise<void> {
    const data: RefreshTokenData = {
      userId,
      expiresAt,
      clientIp,
      createdAt: Date.now(),
    };

    const tokenKey = this.getTokenKey(token);
    const userTokensKey = this.getUserTokensKey(userId);
    const ttl = this.getTtl(expiresAt);

    if (ttl <= 0) {
      return; // 已经过期，不需要保存
    }

    // 保存 token 信息
    await this.redis.set(tokenKey, JSON.stringify(data), 'EX', ttl);
    // 添加到用户的 token 集合
    await this.redis.sadd(userTokensKey, token);
    // 给集合也设置相同 TTL（自动过期清理）
    await this.redis.expire(userTokensKey, ttl);
  }

  /**
   * 获取 Refresh Token 信息
   * 返回 null 表示 token 不存在或已过期
   */
  async getRefreshToken(token: string): Promise<RefreshTokenData | null> {
    const tokenKey = this.getTokenKey(token);
    const data = await this.redis.get(tokenKey);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data) as RefreshTokenData;
      // 双重检查：即使 Redis 还没删除，也验证过期
      if (parsed.expiresAt < Date.now()) {
        await this.deleteRefreshToken(parsed.userId, token);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * 删除单个 Refresh Token（用户登出）
   */
  async deleteRefreshToken(userId: string, token: string): Promise<void> {
    const tokenKey = this.getTokenKey(token);
    const userTokensKey = this.getUserTokensKey(userId);

    await this.redis.del(tokenKey);
    await this.redis.srem(userTokensKey, token);
  }

  /**
   * 删除用户所有 Refresh Token（踢出所有设备/禁用用户）
   * 使用分批删除，避免阻塞 Redis
   */
  async deleteAllUserRefreshTokens(userId: string): Promise<number> {
    const userTokensKey = this.getUserTokensKey(userId);
    const tokens = await this.redis.smembers(userTokensKey);

    if (tokens.length === 0) {
      await this.redis.del(userTokensKey);
      return 0;
    }

    // 分批删除，避免一次性删除大量 key 阻塞 Redis
    const BATCH_SIZE = 100;
    let deletedCount = 0;

    for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
      const batch = tokens.slice(i, i + BATCH_SIZE);
      const pipeline = this.redis.pipeline();
      for (const token of batch) {
        pipeline.del(this.getTokenKey(token));
      }
      await pipeline.exec();
      deletedCount += batch.length;
    }

    // 删除集合本身
    await this.redis.del(userTokensKey);

    return deletedCount;
  }

  /**
   * 清理过期 token - Redis TTL 自动清理，此方法留空兼容原有接口
   */
  async cleanupExpiredTokens(): Promise<number> {
    // Redis 自动过期，不需要手动清理
    await Promise.resolve();
    return 0;
  }
}
