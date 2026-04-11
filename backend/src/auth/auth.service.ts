import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PasswordCacheService } from './password-cache.service';
import { UserCacheService } from '../users/user-cache.service';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { BusinessException } from '../common/exceptions/business.exception';
import { BusinessErrorCode } from '../common/constants/business-error-codes';
import { appendJsonLog } from '@/common/utils/file-logger';

interface User {
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

import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { UserDto } from './dto/user.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

/**
 * 认证错误码
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_DISABLED = 'USER_DISABLED',
  USER_LOCKED = 'USER_LOCKED',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
}

/**
 * 认证服务
 * 负责用户登录、Token令牌生成和验证等核心功能
 */
@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly tokenExpiresIn: number;
  private readonly refreshExpiresIn: number;
  private readonly maxLoginAttempts: number;
  private readonly lockDuration: number;
  private readonly argon2Options: argon2.Options;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly passwordCacheService: PasswordCacheService,
    private readonly userCacheService: UserCacheService,
  ) {
    // 从环境变量读取 JWT 配置和其他配置
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
    this.jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'default-refresh-secret';
    this.tokenExpiresIn = parseInt(
      this.configService.get<string>('TOKEN_EXPIRES_IN') || '7200',
      10,
    );
    this.refreshExpiresIn = parseInt(
      this.configService.get<string>('REFRESH_EXPIRES_IN') || '604800',
      10,
    );
    this.maxLoginAttempts = parseInt(
      this.configService.get<string>('MAX_LOGIN_ATTEMPTS') || '5',
      10,
    );
    this.lockDuration = parseInt(
      this.configService.get<string>('LOCK_DURATION') || '900000',
      10,
    ); // 15分钟

    // JWT 密钥强度校验
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    const isProduction = nodeEnv === 'production';

    // 校验密钥强度的辅助函数
    const validateSecret = (secret: string, name: string): void => {
      if (
        !secret ||
        secret === `default-${name.toLowerCase()}` ||
        secret.length < 32
      ) {
        const message = `${name} must be configured with a strong key (length ≥ 32 characters)`;
        if (isProduction) {
          throw new Error(
            `❌ ${message} in production. Please check your environment configuration.`,
          );
        } else {
          console.warn(
            `⚠️  ${message}. This is insfecure for production deployment.`,
          );
        }
      }
    };
    validateSecret(this.jwtSecret, 'JWT_SECRET');
    validateSecret(this.jwtRefreshSecret, 'JWT_REFRESH_SECRET');

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
   * 用户注册
   * @param registerDto - 注册请求数据
   * @param clientIp - 客户端 IP
   * @returns 注册响应数据（包含登录令牌）
   */
  async register(
    registerDto: RegisterDto,
    clientIp: string,
  ): Promise<RegisterResponseDto> {
    const { mobile, password } = registerDto;

    // 检查手机号是否已注册（手机号存在 username 字段）
    const existingUser = await this.prismaService.users.findUnique({
      where: { username: mobile },
    });

    if (existingUser) {
      throw new BusinessException(
        BusinessErrorCode.AUTH_MOBILE_ALREADY_REGISTERED,
      );
    }

    // 查找最后一个用户获取最大 ID 并递增
    const lastUser = await this.prismaService.users.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    // 解析生成新 ID
    let nextNumber = 1;
    if (lastUser?.id) {
      const match = lastUser.id.match(/^author-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    const newId = `author-${nextNumber}`;

    // 加密密码 - 新用户默认使用 argon2id
    const passwordHash = await argon2.hash(password, this.argon2Options);

    // 创建用户
    const now = BigInt(Date.now());
    const user = await this.prismaService.users.create({
      data: {
        id: newId,
        username: mobile,
        password_hash: passwordHash,
        password_algorithm: 'argon2id',
        email: null,
        nickname: null,
        avatar: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    });

    // 生成 Token
    const accessToken = this.generateAccessToken(user.id, clientIp);
    const refreshToken = this.generateRefreshToken(user.id, clientIp);
    await this.saveRefreshToken(user.id, refreshToken, clientIp);

    // 组装响应
    const userDto: UserDto = {
      id: user.id,
      username: user.username,
      email: user.email ?? undefined,
      avatar: user.avatar ?? undefined,
      nickname: user.nickname ?? undefined,
    };

    // 直接返回数据，TransformInterceptor 会自动包装成 ApiResult.success
    return {
      accessToken,
      refreshToken,
      expiresIn: this.tokenExpiresIn,
      user: userDto,
    };
  }

  /**
   * 用户登录
   * @param loginDto - 登录请求数据
   * @param clientIp - 客户端 IP
   * @returns 登录响应数据
   */
  async login(loginDto: LoginDto, clientIp: string): Promise<LoginResponseDto> {
    const { username, password } = loginDto;
    const startTime = Date.now();

    // 先尝试从 Redis 获取缓存的用户全信息
    const cachedUserInfo =
      await this.userCacheService.getCachedUserInfo(username);

    let user: User | null;
    let userFromDb = false;

    if (cachedUserInfo) {
      // 用户信息缓存命中：直接使用缓存数据，完全跳过 DB 查询
      user = {
        id: cachedUserInfo.id,
        username: cachedUserInfo.username,
        password_hash: cachedUserInfo.password_hash,
        password_algorithm: cachedUserInfo.password_algorithm,
        email: cachedUserInfo.email,
        nickname: cachedUserInfo.nickname,
        avatar: cachedUserInfo.avatar,
        is_active: cachedUserInfo.is_active,
        created_at: cachedUserInfo.created_at,
        updated_at: cachedUserInfo.updated_at,
      };
      this.logger.debug(
        `User info cache hit for username=${username}, elapsed=${Date.now() - startTime}ms`,
      );
    } else {
      // 缓存未命中：从数据库查询完整信息
      user = await this.findUserByUsername(username);
      userFromDb = true;

      // 查询成功，写入用户信息缓存
      if (user) {
        await this.userCacheService.setUserInfoCache(username, {
          id: user.id,
          username: user.username,
          password_hash: user.password_hash,
          password_algorithm: user.password_algorithm,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          is_active: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at,
        });
      }
    }

    if (!user) {
      // 用户不存在，清除缓存
      await this.userCacheService.deleteUserInfoCache(username);
      await this.passwordCacheService.deletePasswordCache(username);
      throw new BusinessException(BusinessErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    // 检查用户状态
    if (!user.is_active) {
      throw new BusinessException(BusinessErrorCode.AUTH_USER_DISABLED);
    }

    // 根据算法选择验证方法验证密码
    const isPasswordValid = await this.verifyPassword(
      password,
      user.password_hash,
      user.password_algorithm,
    );

    if (!isPasswordValid) {
      // 增加登录失败次数
      await this.handleLoginFailure(user);
      throw new BusinessException(BusinessErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    // 验证成功，如果是从数据库加载的，写入 Redis 缓存
    if (userFromDb) {
      await this.passwordCacheService.setPasswordCache(
        username,
        user.password_hash,
      );
    }

    // 重置登录失败次数
    await this.handleLoginSuccess(user, clientIp);

    // 静默迁移：如果当前用户还是 bcrypt 算法，异步升级为 argon2id
    if (!user.password_algorithm || user.password_algorithm === 'bcrypt') {
      // 不阻塞登录响应，异步执行升级
      setImmediate(() => {
        void (async () => {
          try {
            await this.silentMigrateToArgon2id(user.id, username, password);
            this.logger.log(
              `Silent password migration completed for user ${username} (bcrypt → argon2id)`,
            );
          } catch (error) {
            // 迁移失败不影响当前登录，下次登录再试
            this.logger.warn(
              `Silent password migration failed for user ${username}: ${error instanceof Error ? error.message : String(error)}`,
            );
            appendJsonLog({
              timestamp: new Date().toISOString(),
              level: 'warn',
              context: AuthService.name,
              message: `Silent password migration failed for user ${username}`,
              error: error instanceof Error ? error.message : String(error),
              env: process.env.NODE_ENV || 'development',
            });
          }
        })();
      });
    }

    // 生成 Token
    const accessToken = this.generateAccessToken(user.id, clientIp);
    const refreshToken = this.generateRefreshToken(user.id, clientIp);

    // 保存刷新令牌
    await this.saveRefreshToken(user.id, refreshToken, clientIp);

    const userDto: UserDto = {
      id: user.id,
      username: user.username,
      email: user.email ?? undefined,
      avatar: user.avatar ?? undefined,
      nickname: user.nickname ?? undefined,
    };

    this.logger.debug(
      `Login completed for username=${username}, elapsed=${Date.now() - startTime}ms`,
    );

    // 直接返回数据，TransformInterceptor 会自动包装成 ApiResult.success
    return {
      accessToken,
      refreshToken,
      expiresIn: this.tokenExpiresIn,
      user: userDto,
    };
  }

  /**
   * 刷新访问令牌
   * @param refreshToken - 刷新令牌
   * @returns 新s的访问令牌
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponseDto> {
    try {
      // 验证刷新令牌
      const payload = jwt.verify(refreshToken, this.jwtRefreshSecret) as {
        userId: string;
        deviceId: string;
      };

      // 检查刷新令牌是否有效
      const isValid = await this.validateRefreshToken(refreshToken);
      if (!isValid) {
        throw new BusinessException(
          BusinessErrorCode.AUTH_INVALID_REFRESH_TOKEN,
          undefined,
          HttpStatus.GONE, // 保持原来的 410 状态码
        );
      }

      // 生成新的访问令牌
      const accessToken = this.generateAccessToken(
        payload.userId,
        payload.deviceId,
      );

      return {
        accessToken,
        expiresIn: this.tokenExpiresIn,
      };
    } catch {
      throw new BusinessException(
        BusinessErrorCode.AUTH_INVALID_REFRESH_TOKEN,
        undefined,
        HttpStatus.GONE, // 保持原来的 410 状态码
      );
    }
  }

  /**
   * 用户登出
   * @param userId - 用户 ID
   */
  async logout(userId: string) {
    // 删除所有刷新令牌
    await this.deleteAllRefreshTokens(userId);
  }

  /**
   * 生成访问令牌
   * @param userId - 用户 ID
   * @param deviceId - 设备 ID
   * @returns JWT 访问令牌
   */
  private generateAccessToken(userId: string, deviceId: string): string {
    return jwt.sign(
      {
        userId,
        deviceId,
        type: 'access',
      },
      this.jwtSecret,
      {
        expiresIn: this.tokenExpiresIn,
      },
    );
  }

  /**
   * 生成刷新令牌
   * @param userId - 用户 ID
   * @param deviceId - 设备 ID
   * @returns JWT 刷新令牌
   */
  private generateRefreshToken(userId: string, deviceId: string): string {
    return jwt.sign(
      {
        userId,
        deviceId,
        type: 'refresh',
      },
      this.jwtRefreshSecret,
      {
        expiresIn: this.refreshExpiresIn,
      },
    );
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
    // 默认兼容 bcrypt
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
    await this.userCacheService.deleteUserInfoCache(username);

    appendJsonLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      context: AuthService.name,
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
  private async handleLoginSuccess(_user: User, _clientIp: string) {
    // 登录锁定功能未在数据库表中设计，暂不实现
    return Promise.resolve();
  }

  /**
   * 处理登录失败
   * @param user - 用户对象
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async handleLoginFailure(_user: User) {
    // 登录锁定功能未在数据库表中设计，暂不实现
    return Promise.resolve();
  }

  /**
   * 从数据库查找用户
   * @param username - 用户名（手机号）
   * @returns 用户对象
   */
  private async findUserByUsername(username: string): Promise<User | null> {
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

    // 保留默认 admin 用户用于测试
    if (username === 'admin') {
      // 默认 admin 用户使用 bcrypt
      return {
        id: 'author-1',
        username: 'admin',
        password_hash: await bcrypt.hash('admin123', 12),
        password_algorithm: 'bcrypt',
        email: 'admin@example.com',
        nickname: '管理员',
        avatar: null,
        is_active: true,
        created_at: BigInt(Date.now()),
        updated_at: BigInt(Date.now()),
      };
    }

    return null;
  }

  /**
   * 保存刷新令牌
   * @param userId - 用户 ID
   * @param token - 刷新令牌
   * @param clientIp - 客户端 IP
   */
  private async saveRefreshToken(
    userId: string,
    token: string,
    clientIp: string,
  ) {
    const id = uuidv4();
    const now = Date.now();
    const expiresAt = BigInt(now + this.refreshExpiresIn * 1000);

    await this.prismaService.refreshTokens.create({
      data: {
        id,
        user_id: userId,
        refresh_token: token,
        client_ip: clientIp,
        expires_at: expiresAt,
        created_at: BigInt(now),
      },
    });
  }

  /**
   * 验证刷新令牌
   * @param token - 刷新令牌
   * @returns 是否有效
   */
  private async validateRefreshToken(token: string): Promise<boolean> {
    // 先尝试从 Redis 缓存获取
    const cacheKey = `refresh:token:${token}`;

    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached === 'valid') {
        // 缓存命中，直接返回有效
        return true;
      }
    } catch {
      // Redis 出错不阻塞，降级查询数据库
    }

    // 缓存未命中或 Redis 出错，查询数据库
    const record = await this.prismaService.refreshTokens.findUnique({
      where: { refresh_token: token },
    });

    if (!record) return false;
    if (record.revoked) return false;

    const now = BigInt(Date.now());
    if (record.expires_at < now) return false;

    // 验证成功，写入 Redis 缓存
    try {
      const ttlSeconds = Number(
        (record.expires_at - BigInt(Date.now())) / 1000n,
      );
      if (ttlSeconds > 0) {
        await this.redisService.set(cacheKey, 'valid', 'EX', ttlSeconds);
      }
    } catch {
      // 缓存写入失败不影响验证结果
    }

    return true;
  }

  /**
   * 删除所有刷新令牌
   * @param userId - 用户 ID
   */
  private async deleteAllRefreshTokens(userId: string) {
    // 先查询所有 token，清除 Redis 缓存
    const tokens = await this.prismaService.refreshTokens.findMany({
      where: { user_id: userId },
      select: { refresh_token: true },
    });

    // 逐个清除 Redis 缓存
    for (const { refresh_token } of tokens) {
      const cacheKey = `refresh:token:${refresh_token}`;
      try {
        await this.redisService.del(cacheKey);
      } catch {
        // 删除缓存失败不影响主流程
      }
    }

    // 删除数据库记录
    await this.prismaService.refreshTokens.deleteMany({
      where: { user_id: userId },
    });
  }
}
