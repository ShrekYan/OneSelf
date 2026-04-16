import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRedisService } from './refresh-token-redis.service';
import { LoadedUser } from './user-loader.service';
import { UserDto } from './dto/user.dto';
import jwt from 'jsonwebtoken';

/**
 * Token 生成结果
 */
export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token 生成服务
 * 负责 JWT Token 生成、刷新令牌存储、用户响应 DTO 组装
 */
@Injectable()
export class TokenGeneratorService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly tokenExpiresIn: number;
  private readonly refreshExpiresIn: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly refreshTokenRedisService: RefreshTokenRedisService,
  ) {
    // 从环境变量读取 JWT 配置
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
  }

  /**
   * 获取 access token 过期时间（供 AuthService 使用）
   */
  getTokenExpiresIn(): number {
    return this.tokenExpiresIn;
  }

  /**
   * 生成并保存访问令牌和刷新令牌
   * @param userId - 用户 ID
   * @param clientIp - 客户端 IP（作为设备标识）
   * @returns 生成的令牌
   */
  async generateAndSaveTokens(
    userId: string,
    clientIp: string,
  ): Promise<TokenResult> {
    const accessToken = this.generateAccessToken(userId, clientIp);
    const refreshToken = this.generateRefreshToken(userId, clientIp);
    await this.saveRefreshToken(userId, refreshToken, clientIp);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.tokenExpiresIn,
    };
  }

  /**
   * 根据用户信息组装 UserDto 响应
   * @param user - 加载的用户信息
   * @returns UserDto
   */
  buildUserDto(user: LoadedUser): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email ?? undefined,
      avatar: user.avatar ?? undefined,
      nickname: user.nickname ?? undefined,
    };
  }

  /**
   * 生成访问令牌（公开方法，供 refreshToken 使用）
   * @param userId - 用户 ID
   * @param deviceId - 设备 ID
   * @returns JWT 访问令牌
   */
  generateAccessToken(userId: string, deviceId: string): string {
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
   * 获取 JWT 刷新密钥（供 refreshToken 验证使用）
   */
  getJwtRefreshSecret(): string {
    return this.jwtRefreshSecret;
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
    const expiresAt = Date.now() + this.refreshExpiresIn * 1000;
    await this.refreshTokenRedisService.saveRefreshToken(
      token,
      userId,
      expiresAt,
      clientIp,
    );
  }
}
