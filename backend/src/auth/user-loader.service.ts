import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PasswordCacheService } from './password-cache.service';
import { UserSyncService, PreloadedUser } from '../users/user-sync.service';
import { BusinessException } from '../common/exceptions/business.exception';
import { BusinessErrorCode } from '../common/constants/business-error-codes';

/**
 * 用户信息接口
 */
export interface LoadedUser {
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
 * 用户加载结果
 */
export interface LoadUserResult {
  user: LoadedUser | null;
  userFromDb: boolean;
}

/**
 * 用户加载服务
 * 负责从缓存或数据库加载用户信息，处理缓存回填逻辑
 */
@Injectable()
export class UserLoaderService {
  private readonly logger = new Logger(UserLoaderService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly userSyncService: UserSyncService,
    private readonly passwordCacheService: PasswordCacheService,
  ) {}

  /**
   * 根据用户名加载用户信息
   * 优先从预加载缓存获取，缓存未命中时回源到数据库查询
   * @param username - 用户名
   * @returns 加载结果，包含用户信息和是否来自数据库标记
   */
  async loadUser(username: string): Promise<LoadUserResult> {
    let preloadedUser: PreloadedUser | null = null;
    let user: LoadedUser | null = null;
    let userFromDb = false;

    // 从预加载获取缓存 Key
    const cacheKey = await this.userSyncService.getUserKey(username);
    console.log(cacheKey);
    if (cacheKey) {
      const cachedStr = await this.redisService.get(cacheKey);
      if (cachedStr) {
        try {
          preloadedUser = JSON.parse(cachedStr) as PreloadedUser;
          console.log(cachedStr);
          this.logger.debug(
            `Preloaded user cache hit for username=${username}`,
          );
        } catch {
          preloadedUser = null;
        }
      }
    }

    // 转换为 LoadedUser 接口，兼容后续原有逻辑
    if (preloadedUser) {
      user = {
        id: preloadedUser.id,
        username: preloadedUser.username,
        password_hash: preloadedUser.password_hash,
        password_algorithm: preloadedUser.password_algorithm,
        email: preloadedUser.email,
        nickname: preloadedUser.nickname,
        avatar: preloadedUser.avatar,
        is_active: preloadedUser.is_active,
        created_at: preloadedUser.created_at,
        updated_at: preloadedUser.updated_at,
      };
    } else {
      // 预加载未命中（新用户）→ 回源查 DB
      this.logger.debug(
        `Preloaded cache miss for username=${username}, querying DB`,
      );
      user = await this.findUserByUsername(username);
      userFromDb = true;

      // 查询成功 → 回填到预加载缓存（包含所有字段）
      if (user) {
        await this.userSyncService.syncSingleUserToRedis(username, {
          id: user.id,
          username: user.username,
          password_hash: user.password_hash,
          password_algorithm: user.password_algorithm,
          is_active: user.is_active,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          created_at: user.created_at,
          updated_at: user.updated_at,
        });
      }
    }

    if (!user) {
      // 用户不存在，清除所有缓存
      await this.passwordCacheService.deletePasswordCache(username);
      if (cacheKey) {
        await this.userSyncService.deleteUserFromRedis(username);
      }
      throw new BusinessException(BusinessErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    return { user, userFromDb };
  }

  /**
   * 从数据库查找用户
   * @param username - 用户名（手机号）
   * @returns 用户对象
   */
  private async findUserByUsername(
    username: string,
  ): Promise<LoadedUser | null> {
    const user = await this.prismaService.users.findUnique({
      where: { username },
    });

    if (user) {
      return {
        id: user.id,
        username: user.username,
        password_hash: user.password_hash,
        password_algorithm: user.password_algorithm ?? null,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }

    return null;
  }
}
