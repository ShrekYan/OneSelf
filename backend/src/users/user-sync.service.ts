import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { safeJsonStringify } from '../common/utils/json.util';

export interface PreloadedUser {
  id: string;
  username: string;
  password_hash: string;
  password_algorithm: string | null;
  is_active: boolean;
  email: string | null;
  nickname: string | null;
  avatar: string | null;
  created_at: bigint;
  updated_at: bigint;
}

@Injectable()
export class UserSyncService implements OnModuleInit {
  private readonly logger = new Logger(UserSyncService.name);
  private currentVersion: number | null = null;
  private readonly CURRENT_VERSION_KEY = 'user:full:current-version';
  private readonly BATCH_SIZE = 1000;
  private readonly TTL = 604800; // 7 天

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * 模块初始化时自动执行全量同步
   */
  async onModuleInit() {
    if (process.env.USER_PRELOAD_ENABLED !== 'false') {
      await this.syncAllUsersToRedis();
    } else {
      this.logger.log('User preload is disabled by configuration');
    }
  }

  /**
   * 获取当前生效版本号
   */
  async getCurrentVersion(): Promise<number | null> {
    if (this.currentVersion !== null) {
      return this.currentVersion;
    }
    const versionStr = await this.redis.get(this.CURRENT_VERSION_KEY);
    if (!versionStr) {
      return null;
    }
    this.currentVersion = parseInt(versionStr, 10);
    return this.currentVersion;
  }

  /**
   * 全量同步所有用户到 Redis（原子性保证）
   * 流程：生成新版本 → 分批写入 → 原子切换 → 异步清理旧版本
   */
  async syncAllUsersToRedis(): Promise<void> {
    const startTime = Date.now();
    const newVersion = startTime;
    let lastId = '';
    let syncedCount = 0;
    let oldVersion: number | null = null;

    this.logger.log(
      `Starting atomic full user sync, new version=${newVersion}...`,
    );

    try {
      // 1. 获取当前旧版本
      oldVersion = await this.getCurrentVersion();
      this.logger.debug(`Current old version: ${oldVersion}`);

      // 2. 分批读取并写入新版本
      while (true) {
        // 游标分页分批查询
        const batch = await this.prisma.users.findMany({
          take: this.BATCH_SIZE,
          skip: lastId ? 1 : 0,
          cursor: lastId ? { id: lastId } : undefined,
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
          orderBy: { id: 'asc' },
        });

        if (batch.length === 0) break;

        // pipeline 批量写入新版本
        const pipeline = this.redis.pipeline();
        for (const user of batch) {
          const key = this.getVersionUserKey(newVersion, user.username);
          pipeline.set(
            key,
            safeJsonStringify({
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
            } satisfies PreloadedUser),
            'EX',
            this.TTL,
          );
          lastId = user.id;
          syncedCount++;
        }
        await pipeline.exec();

        this.logger.debug(
          `Synced batch of ${batch.length} users, total=${syncedCount}`,
        );
      }

      // 3. ✅ 原子切换版本：所有数据写入完成才切换
      await this.redis.set(this.CURRENT_VERSION_KEY, String(newVersion));
      this.currentVersion = newVersion;

      const elapsed = Date.now() - startTime;
      this.logger.log(
        `✅ Atomic user sync completed. Total=${syncedCount} users, version=${newVersion}, elapsed=${elapsed}ms`,
      );

      // 4. 异步清理旧版本（不阻塞启动）
      if (oldVersion !== null && oldVersion !== newVersion) {
        setImmediate(() => {
          void this.cleanupOldVersion(oldVersion!).catch((err) => {
            this.logger.error(
              `Failed to cleanup old version ${oldVersion}, will retry on next sync: ${err instanceof Error ? err.message : String(err)}`,
            );
          });
        });
      }
    } catch (error) {
      // 同步失败，不影响旧版本，保持服务可用
      const elapsed = Date.now() - startTime;
      this.logger.error(
        `❌ Atomic user sync failed after ${elapsed}ms, synced=${syncedCount}, keeping old version=${oldVersion}`,
        error,
      );
      throw error; // 抛出错误阻止服务启动，让运维知道出问题了
    }
  }

  /**
   * 同步单个用户到当前版本（写穿透）
   * 用于注册/更新用户信息后，保持缓存一致
   */
  async syncSingleUserToRedis(
    username: string,
    userData: PreloadedUser,
  ): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    if (currentVersion === null) {
      // 还没做过全量同步，不需要同步单个
      return;
    }
    const key = this.getVersionUserKey(currentVersion, username);
    await this.redis.set(key, safeJsonStringify(userData), 'EX', this.TTL);
    this.logger.debug(
      `Synced single user ${username} to version ${currentVersion}`,
    );
  }

  /**
   * 从当前版本删除用户（删除用户时调用）
   */
  async deleteUserFromRedis(username: string): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    if (currentVersion === null) {
      return;
    }
    const key = this.getVersionUserKey(currentVersion, username);
    await this.redis.del(key);
    this.logger.debug(
      `Deleted user ${username} from version ${currentVersion}`,
    );
  }

  /**
   * 获取当前生效版本中用户的缓存 Key
   * 供外部（AuthService）查询使用
   */
  async getUserKey(username: string): Promise<string | null> {
    const currentVersion = await this.getCurrentVersion();
    if (currentVersion === null) {
      return null;
    }
    return this.getVersionUserKey(currentVersion, username);
  }

  /**
   * 拼装带版本号的用户 Key
   */
  private getVersionUserKey(version: number, username: string): string {
    return `user:full:v${version}:${username}`;
  }

  /**
   * 清理旧版本所有用户数据
   * 通过扫描匹配模式删除，避免一次性删除大量 key 阻塞 Redis
   */
  private async cleanupOldVersion(oldVersion: number): Promise<void> {
    this.logger.log(`Starting async cleanup of old version ${oldVersion}...`);
    const startTime = Date.now();
    const pattern = `user:full:v${oldVersion}:*`;
    const BATCH_DELETE = 100;
    let deletedCount = 0;

    // 使用 SCAN 分批删除，避免阻塞 Redis
    let cursor = '0';
    do {
      const [newCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        BATCH_DELETE,
      );
      cursor = newCursor;

      if (keys.length > 0) {
        await this.redis.del(...keys);
        deletedCount += keys.length;
      }

      // 给 Redis 喘口气，避免批量删除占满 CPU
      if (deletedCount % 10000 === 0 && deletedCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        this.logger.debug(
          `Cleaned up ${deletedCount} keys from old version ${oldVersion}`,
        );
      }
    } while (cursor !== '0');

    const elapsed = Date.now() - startTime;
    this.logger.log(
      `✅ Cleanup of old version ${oldVersion} completed, deleted=${deletedCount} keys, elapsed=${elapsed}ms`,
    );
  }

  /**
   * 手动触发重新同步（可以通过 API 调用）
   */
  async triggerResync(): Promise<{ syncedCount: number; elapsedMs: number }> {
    const startTime = Date.now();
    await this.syncAllUsersToRedis();
    const count = await this.prisma.users.count();
    return {
      syncedCount: count,
      elapsedMs: Date.now() - startTime,
    };
  }
}
