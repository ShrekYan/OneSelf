import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserLoaderService } from './user-loader.service';
import { PasswordValidationService } from './password-validation.service';
import { TokenGeneratorService } from './token-generator.service';
import { RefreshTokenRedisService } from './refresh-token-redis.service';
import { PasswordCacheService } from './password-cache.service';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '@/redis/redis.module';
import { CommonModule } from '@/common/common.module';
import { AuthorizationModule } from '@/authorization/authorization.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    RedisModule,
    CommonModule,
    AuthorizationModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserLoaderService,
    PasswordValidationService,
    TokenGeneratorService,
    RefreshTokenRedisService,
    PasswordCacheService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
