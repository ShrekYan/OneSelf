import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { RedisModule } from '../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordCacheService } from './password-cache.service';

/**
 * 认证模块
 * 负责用户登录、Token令牌生成和验证等认证功能
 */
@Module({
  imports: [ConfigModule, PrismaModule, CommonModule, RedisModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordCacheService],
  exports: [AuthService],
})
export class AuthModule {}
