import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { RedisModule } from '../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../shared/shared.module';
import { AuthController } from './auth.controller';
// All services below have been migrated to auth-service and deleted
// import { AuthService } from './auth.service';
// import { PasswordCacheService } from './password-cache.service';
// import { RefreshTokenRedisService } from './refresh-token-redis.service';
// import { UserLoaderService } from './user-loader.service';
// import { PasswordValidationService } from './password-validation.service';
// import { TokenGeneratorService } from './token-generator.service';

/**
 * 认证模块
 * 支持双模式：
 * - 本地模式：使用本地认证服务（兼容旧版本）
 * - 远程模式：转发请求到独立 auth-service（新模式）
 * 通过环境变量 REMOTE_AUTH_ENABLE 控制开关
 *
 * After migration to auth-service: all core services have been moved
 * Only keep controller for proxy forwarding to keep API path unchanged
 */
@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    CommonModule,
    RedisModule,
    UsersModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [
    // All services migrated to auth-service, commented out for easy rollback if needed
    // AuthService,
    // PasswordCacheService,
    // RefreshTokenRedisService,
    // UserLoaderService,
    // PasswordValidationService,
    // TokenGeneratorService,
  ],
  // exports: [AuthService],
})
export class AuthModule {}
