import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import { PasswordCacheService } from './password-cache.service';
import { UserSyncService } from '@/users/user-sync.service';
import { LoadedUser } from './user-loader.service';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import { LogServiceClientService } from '@/common/log-service';

/**
 * 密码验证服务
 * 负责密码验证、登录成败处理、静默密码算法迁移
 */
@Injectable()
export class PasswordValidationService {
  private readonly argon2Options: argon2.Options;
  private readonly logger = new Logger(PasswordValidationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly passwordCacheService: PasswordCacheService,
    private readonly userSyncService: UserSyncService,
    private readonly logServiceClient: LogServiceClientService,
  ) {
    // 从环境变量读取 argon2 参数，平衡安全性与性能
    this.argon2Options = {
      type: argon2.argon2id,
      memoryCost: parseInt(
        this.configService.get<string>('ARGON2_MEMORY_COST') || '4096',
        10,
      ),
      timeCost: parseInt(
        this.configService.get<string>('ARGON2_TIME_COST') || '2',
        10,
      ),
      parallelism: 1,
    } as unknown as argon2.Options;
  }

  /**
   * 验证密码
   * 支持多种算法（argon2id/bcrypt）
   * @param plainPassword - 明文密码
   * @param user - 加载的用户信息
   * @returns 是否验证通过
   */
  async validatePassword(
    plainPassword: string,
    user: LoadedUser,
  ): Promise<boolean> {
    return this.verifyPassword(
      plainPassword,
      user.password_hash,
      user.password_algorithm,
    );
  }

  /**
   * 处理验证成功后的逻辑
   * - 如果用户来自数据库，写入密码缓存
   * - 重置登录失败次数
   * @param user - 用户信息
   * @param userFromDb - 是否来自数据库加载
   * @param clientIp - 客户端 IP
   */
  async processValidPassword(
    user: LoadedUser,
    userFromDb: boolean,
    clientIp: string,
  ): Promise<void> {
    // 验证成功，如果是从数据库加载的，写入 Redis 缓存
    if (userFromDb) {
      await this.passwordCacheService.setPasswordCache(
        user.username,
        user.password_hash,
      );
    }

    // 重置登录失败次数
    await this.handleLoginSuccess(user, clientIp);
  }

  /**
   * 处理登录失败
   * @param user - 用户信息
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleLoginFailure(_user: LoadedUser): Promise<void> {
    // 登录锁定功能未在数据库表中设计，暂不实现
    return Promise.resolve();
  }

  /**
   * 启动静默密码迁移（如果需要）
   * 如果用户当前使用 bcrypt 算法，异步升级为 argon2id
   * @param user - 用户信息
   * @param plainPassword - 明文密码
   */
  startSilentMigration(user: LoadedUser, plainPassword: string): void {
    // 静默迁移：如果当前用户还是 bcrypt 算法，异步升级为 argon2id
    if (!user.password_algorithm || user.password_algorithm === 'bcrypt') {
      // 不阻塞登录响应，异步执行升级
      setImmediate(() => {
        void (async () => {
          try {
            await this.silentMigrateToArgon2id(
              user.id,
              user.username,
              plainPassword,
            );
            this.logger.log(
              `Silent password migration completed for user ${user.username} (bcrypt → argon2id)`,
            );
          } catch (error) {
            // 迁移失败不影响当前登录，下次登录再试
            this.logger.warn(
              `Silent password migration failed for user ${user.username}: ${error instanceof Error ? error.message : String(error)}`,
            );
            this.logServiceClient.logJsonLog({
              timestamp: new Date().toISOString(),
              level: 'warn',
              context: PasswordValidationService.name,
              message: `Silent password migration failed for user ${user.username}`,
              error: error instanceof Error ? error.message : String(error),
              env: process.env.NODE_ENV || 'development',
            });
          }
        })();
      });
    }
  }

  /**
   * 验证密码（支持多种算法）
   * @param plainPassword - 明文密码
   * @param hashedPassword - 哈希密码
   * @param algorithm - 算法名称（null 表示 bcrypt）
   * @returns 是否验证通过
   */
  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
    algorithm: string | null,
  ): Promise<boolean> {
    if (algorithm === 'argon2id') {
      return argon2.verify(hashedPassword, plainPassword);
    }
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * 静默迁移密码算法 bcrypt → argon2id
   * 用户登录成功后异步执行，重新哈希密码并更新数据库，同时更新缓存
   * @param userId - 用户 ID
   * @param username - 用户名（用于缓存）
   * @param plainPassword - 明文密码（登录成功后仍然在内存中，可以直接使用）
   */
  private async silentMigrateToArgon2id(
    userId: string,
    username: string,
    plainPassword: string,
  ): Promise<void> {
    // 检查环境变量开关：是否启用自动迁移
    const enabled = this.configService.get<boolean>(
      'PASSWORD_AUTO_MIGRATION_ENABLED',
      true,
    );
    if (!enabled) {
      this.logger.debug(
        `Password auto migration disabled, skipped for user ${username}`,
      );
      return;
    }

    // 迁移前先查询当前算法，确认还是 bcrypt 才执行
    // 防止已经迁移过了重复执行，浪费 CPU 和 IO
    const currentUser = await this.prismaService.users.findUnique({
      where: { id: userId },
      select: { password_algorithm: true },
    });

    if (!currentUser || currentUser.password_algorithm !== 'bcrypt') {
      // 已经迁移过了，跳过
      this.logger.debug(
        `Password already migrated to argon2id, skipped migration for user ${username}`,
      );
      return;
    }

    // 使用 argon2id 重新哈希
    const newHash = await argon2.hash(plainPassword, this.argon2Options);
    const now = BigInt(Date.now());

    // 更新数据库
    await this.prismaService.users.update({
      where: { id: userId },
      data: {
        password_hash: newHash,
        password_algorithm: 'argon2id',
        updated_at: now,
      },
    });

    // 更新 Redis 缓存 - 委托给 PasswordCacheService
    await this.passwordCacheService.updatePasswordCacheAfterMigration(
      username,
      newHash,
    );

    // 删除用户信息缓存，让下次登录重新缓存最新数据
    await this.userSyncService.deleteUserFromRedis(username);

    // 更新预加载缓存（如果启用了预加载）
    const updatedUserFull = await this.prismaService.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        password_hash: true,
        password_algorithm: true,
        is_active: true,
        email: true,
        nickname: true,
        avatar: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (updatedUserFull) {
      // 同步到预加载缓存（写穿透保持一致性）
      await this.userSyncService.syncSingleUserToRedis(username, {
        id: updatedUserFull.id,
        username: updatedUserFull.username,
        password_hash: updatedUserFull.password_hash,
        password_algorithm: updatedUserFull.password_algorithm,
        is_active: updatedUserFull.is_active,
        email: updatedUserFull.email,
        nickname: updatedUserFull.nickname,
        avatar: updatedUserFull.avatar,
        created_at: updatedUserFull.created_at,
        updated_at: updatedUserFull.updated_at,
      });
    }

    this.logServiceClient.logJsonLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      context: PasswordValidationService.name,
      message: `Silent password migration completed: userId=${userId}, username=${username}, algorithm=bcrypt→argon2id`,
      env: process.env.NODE_ENV || 'development',
    });
  }

  /**
   * 处理登录成功
   * @param user - 用户对象
   * @param clientIp - 客户端 IP
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async handleLoginSuccess(_user: LoadedUser, _clientIp: string) {
    // 登录锁定功能未在数据库表中设计，暂不实现
    return Promise.resolve();
  }
}
