import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  password_hash: string;
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

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
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
      throw new ConflictException({
        code: 'MOBILE_ALREADY_REGISTERED',
        message: '手机号已注册',
      });
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

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 12);

    // 创建用户
    const now = BigInt(Date.now());
    const user = await this.prismaService.users.create({
      data: {
        id: newId,
        username: mobile,
        password_hash: passwordHash,
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

    // 从数据库查找用户
    const user = await this.findUserByUsername(username);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException({
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: '用户名或密码错误',
      });
    }

    // 检查用户状态
    if (!user.is_active) {
      throw new ForbiddenException({
        code: AuthErrorCode.USER_DISABLED,
        message: '用户已被禁用',
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

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
        userId: string;
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
      return {
        id: 'author-1',
        username: 'admin',
        password_hash: await bcrypt.hash('admin123', 12),
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
   * 保存刷新令牌（模拟实现）
   * @param userId - 用户 ID
   * @param token - 刷新令牌
   * @param deviceId - 设备 ID
   */
  private async saveRefreshToken(
    userId: string,
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
  private async deleteAllRefreshTokens(userId: string) {
    // TODO: 从数据库删除
    console.log(`删除用户 ${userId} 的所有刷新令牌`);
    return Promise.resolve();
  }
}
