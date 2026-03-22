import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  id: number;
  username: string;
  passwordHash: string;
  email: string | null;
  avatar: string | null;
  nickname: string | null;
  status: number;
  loginAttempts: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
}

import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { UserDto } from './dto/user.dto';

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

  constructor(private readonly configService: ConfigService) {
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
  }

  /**
   * 用户登录
   * @param loginDto - 登录请求数据
   * @param clientIp - 客户端 IP
   * @returns 登录响应数据
   */
  async login(loginDto: LoginDto, clientIp: string): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    // TODO: 从数据库查找用户
    const user = await this.findUserByUsername(username);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException({
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: '用户名或密码错误',
      });
    }

    // 检查用户状态
    if (user.status === 0) {
      throw new ForbiddenException({
        code: AuthErrorCode.USER_DISABLED,
        message: '用户已被禁用',
      });
    }

    // 检查锁定状态
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remainingMinutes = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000,
      );
      throw new ForbiddenException({
        code: AuthErrorCode.USER_LOCKED,
        message: `账号已被锁定，请 ${remainingMinutes} 分钟后重试`,
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      // 增加登录失败次数
      await this.handleLoginFailure(user);
      throw new UnauthorizedException({
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: '用户名或密码错误',
      });
    }

    // 重置登录失败次数
    await this.handleLoginSuccess(user, clientIp);

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
        userId: number;
        deviceId: string;
      };

      // 检查刷新令牌是否有效
      const isValid = await this.validateRefreshToken(refreshToken);
      if (!isValid) {
        throw new UnauthorizedException({
          code: 'INVALID_REFRESH_TOKEN',
          message: '刷新令牌无效或已过期',
        });
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
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: '刷新令牌无效或已过期',
      });
    }
  }

  /**
   * 用户登出
   * @param userId - 用户 ID
   */
  async logout(userId: number) {
    // 删除所有刷新令牌
    await this.deleteAllRefreshTokens(userId);
  }

  /**
   * 生成访问令牌
   * @param userId - 用户 ID
   * @param deviceId - 设备 ID
   * @returns JWT 访问令牌
   */
  private generateAccessToken(userId: number, deviceId: string): string {
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
  private generateRefreshToken(userId: number, deviceId: string): string {
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
   * 处理登录成功
   * @param user - 用户对象
   * @param clientIp - 客户端 IP
   */
  private async handleLoginSuccess(user: User, clientIp: string) {
    // TODO: 更新用户登录信息
    user.loginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    user.lastLoginIp = clientIp;
    // await user.save();
    return Promise.resolve();
  }

  /**
   * 处理登录失败
   * @param user - 用户对象
   */
  private async handleLoginFailure(user: User) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    // 检查是否需要锁定
    if (user.loginAttempts >= this.maxLoginAttempts) {
      user.lockedUntil = new Date(Date.now() + this.lockDuration);
      user.status = 2; // 锁定状态
    }

    // TODO: 保存用户状态
    // await user.save();
    return Promise.resolve();
  }

  /**
   * 查找用户（模拟实现）
   * @param username - 用户名
   * @returns 用户对象
   */
  private async findUserByUsername(username: string): Promise<User | null> {
    // TODO: 实际应该从数据库查询
    // 这里是模拟实现
    if (username === 'admin') {
      return {
        id: 1,
        username: 'admin',
        passwordHash: await bcrypt.hash('admin123', 12),
        email: 'admin@example.com',
        avatar: null,
        nickname: '管理员',
        status: 1,
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
        lastLoginIp: null,
      };
    }
    return null;
  }

  /**
   * 保存刷新令牌（模拟实现）
   * @param userId - 用户 ID
   * @param token - 刷新令牌
   * @param deviceId - 设备 ID
   */
  private async saveRefreshToken(
    userId: number,
    token: string,
    deviceId: string,
  ) {
    // TODO: 保存到数据库
    console.log(
      `保存刷新令牌: userId=${userId}, token=${token.slice(0, 20)}..., deviceId=${deviceId}`,
    );
    return Promise.resolve();
  }

  /**
   * 验证刷新令牌（模拟实现）
   * @param token - 刷新令牌
   * @returns 是否有效
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async validateRefreshToken(token: string): Promise<boolean> {
    // TODO: 从数据库验证
    return Promise.resolve(true);
  }

  /**
   * 删除所有刷新令牌（模拟实现）
   * @param userId - 用户 ID
   */
  private async deleteAllRefreshTokens(userId: number) {
    // TODO: 从数据库删除
    console.log(`删除用户 ${userId} 的所有刷新令牌`);
    return Promise.resolve();
  }
}
