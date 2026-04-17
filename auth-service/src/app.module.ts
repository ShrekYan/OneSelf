import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@/common/common.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '@/redis/redis.module';
import { AuthorizationModule } from '@/authorization/authorization.module';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { IntrospectModule } from '@/introspect/introspect.module';
import { CorsMiddleware } from '@/common/middleware/cors.middleware';
import { RequestLogMiddleware } from '@/common/middleware/request-log.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    HttpModule,
    CommonModule,
    PrismaModule,
    RedisModule,
    AuthorizationModule,
    UsersModule,
    AuthModule,
    IntrospectModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorsMiddleware).forRoutes('*');
    consumer.apply(RequestLogMiddleware).forRoutes('*');
  }
}
