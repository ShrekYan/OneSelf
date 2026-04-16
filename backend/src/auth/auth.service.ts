import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordCacheService } from './password-cache.service';
import { UserSyncService } from '../users/user-sync.service';
import { RefreshTokenRedisService } from './refresh-token-redis.service';
import { UserLoaderService } from './user-loader.service';
import { PasswordValidationService } from './password-validation.service';
import { TokenGeneratorService } from './token-generator.service';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { BusinessException } from '../common/exceptions/business.exception';
import { BusinessErrorCode } from '../common/constants/business-error-codes';

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
  private readonly argon2Options: argon2.Options;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly passwordCacheService: PasswordCacheService,
    private readonly userSyncService: UserSyncService,
    private readonly refreshTokenRedisService: RefreshTokenRedisService,
    private readonly userLoader: UserLoaderService,
    private readonly passwordValidation: PasswordValidationService,
    private readonly tokenGenerator: TokenGeneratorService,
  ) {
    // JWT 密钥强度校验 - 保留在这里因为是服务启动校验
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
            `⚠️  ${message}. This is insecure for production deployment.`,
          );
        }
      }
    };

    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'default-refresh-secret';
    validateSecret(jwtSecret, 'JWT_SECRET');
    validateSecret(jwtRefreshSecret, 'JWT_REFRESH_SECRET');

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

    // 生成 Token 并保存刷新令牌
    const { accessToken, refreshToken } =
      await this.tokenGenerator.generateAndSaveTokens(user.id, clientIp);

    // 新用户注册完成，同步到预加载缓存
    await this.userSyncService.syncSingleUserToRedis(user.username, {
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
      expiresIn: this.tokenGenerator.getTokenExpiresIn(),
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

    // 1. 加载用户（优先缓存，未命中回源 DB 并回填缓存）
    const { user, userFromDb } = await this.userLoader.loadUser(username);

    // 2. 检查用户状态
    // loadUser 如果找不到用户会直接抛出异常，所以这里 user 一定非 null
    if (!user!.is_active) {
      throw new BusinessException(BusinessErrorCode.AUTH_USER_DISABLED);
    }

    // 3. 验证密码
    const isPasswordValid = await this.passwordValidation.validatePassword(
      password,
      user!,
    );

    if (!isPasswordValid) {
      await this.passwordValidation.handleLoginFailure(user!);
      throw new BusinessException(BusinessErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    // 4. 处理验证成功：缓存密码、重置失败次数
    await this.passwordValidation.processValidPassword(
      user!,
      userFromDb,
      clientIp,
    );

    // 5. 如果需要，启动静默密码迁移（bcrypt → argon2id）
    this.passwordValidation.startSilentMigration(user!, password);

    // 6. 生成 Token 并保存刷新令牌
    const { accessToken, refreshToken } =
      await this.tokenGenerator.generateAndSaveTokens(user!.id, clientIp);

    // 7. 组装响应 DTO
    const userDto = this.tokenGenerator.buildUserDto(user!);

    this.logger.debug(
      `Login completed for username=${username}, elapsed=${Date.now() - startTime}ms`,
    );

    // 直接返回数据，TransformInterceptor 会自动包装成 ApiResult.success
    return {
      accessToken,
      refreshToken,
      expiresIn: this.tokenGenerator.getTokenExpiresIn(),
      user: userDto,
    };
  }

  /**
   * 刷新访问令牌
   * @param refreshToken - 刷新令牌
   * @returns 新的访问令牌
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponseDto> {
    try {
      // 验证刷新令牌
      const payload = jwt.verify(
        refreshToken,
        this.tokenGenerator.getJwtRefreshSecret(),
      ) as {
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
      const accessToken = this.tokenGenerator.generateAccessToken(
        payload.userId,
        payload.deviceId,
      );

      return {
        accessToken,
        expiresIn: this.tokenGenerator.getTokenExpiresIn(),
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
   * @param refreshToken - 可选，当前设备的刷新令牌，只登出当前设备
   */
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // 删除单个 token（登出当前设备）
      await this.refreshTokenRedisService.deleteRefreshToken(
        userId,
        refreshToken,
      );
    } else {
      // 没有传 token 则删除用户所有 token（踢出所有设备）
      await this.refreshTokenRedisService.deleteAllUserRefreshTokens(userId);
    }
  }

  /**
   * 验证刷新令牌
   * @param token - 刷新令牌
   * @returns 是否有效
   */
  private async validateRefreshToken(token: string): Promise<boolean> {
    const data = await this.refreshTokenRedisService.getRefreshToken(token);
    return data !== null;
  }
}
