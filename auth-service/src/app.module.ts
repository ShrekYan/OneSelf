import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@/common/common.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '@/redis/redis.module';
import { AuthorizationModule } from '@/authorization/authorization.module';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { IntrospectModule } from '@/introspect/introspect.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    CommonModule,
    PrismaModule,
    RedisModule,
    AuthorizationModule,
    UsersModule,
    AuthModule,
    IntrospectModule,
  ],
})
export class AppModule {}
