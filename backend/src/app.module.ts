import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './article/article.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { RedisModule } from './redis/redis.module';
import { CorsMiddleware } from './common/middleware/cors.middleware';
import { JwtParseMiddleware } from './common/middleware/jwt-parse.middleware';
import { RequestLogMiddleware } from './common/middleware/request-log.middleware';

// @Module() 是 NestJS 提供的装饰器，用于声明一个模块（Module）。
// 模块是 NestJS 应用的基本组织单位，每个应用至少有一个根模块（AppModule）。
// 模块负责组织和管理应用的不同部分，如控制器、服务、提供者等。
// 加了它后，NestJS 会自动扫描并加载该模块下的所有组件，实现组件的自动发现与注册。
@Module({
  // AppModule 是 NestJS 应用的根模块，负责启动应用并配置全局依赖。
  imports: [
    // ConfigModule 用于加载和管理应用的配置文件。
    // forRoot() 方法用于配置 ConfigModule，这里指定了配置文件的路径和环境变量的处理方式。
    // isGlobal: true 表示将 ConfigModule 注册为全局模块，使得应用中的所有模块都可以使用其提供的配置。
    // envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'] 表示先加载当前环境的配置文件（如 .env.development），如果不存在则加载默认的 .env 文件。
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    // PrismaModule - Prisma ORM 全局模块，提供数据库连接
    PrismaModule,
    // CommonModule - 公共基础设施模块，统一管理全局过滤器、拦截器、守卫
    CommonModule,
    // RedisModule - Redis 缓存模块，提供缓存服务
    RedisModule,
    // AuthModule 是负责处理用户认证相关功能的模块，如登录、刷新令牌、登出等。
    AuthModule,
    // CategoryModule 负责文章分类相关接口
    CategoryModule,
    // ArticleModule 负责文章相关接口
    ArticleModule,
    // UsersModule 负责用户信息查询和更新
    UsersModule,
  ],
  // AppController 是应用的根控制器，负责处理应用的 HTTP 请求。
  // 这里将 AppController 导入到 AppModule 中，使得应用中的所有模块都可以使用 AppController 提供的路由处理方法。
  controllers: [AppController],
  // AppService 是应用的根服务，负责处理应用的业务逻辑。
  // 这里将 AppService 导入到 AppModule 中，使得应用中的所有模块都可以使用 AppService 提供的方法。
  // 全局过滤器和拦截器已经移动到 CommonModule 中统一注册
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // CORS 中间件必须放在最前面，优先处理 OPTIONS 预检请求
    consumer.apply(CorsMiddleware).forRoutes('*');
    // 注册请求日志中间件到所有路由（必须在 JwtParse 之前，才能准确计时）
    consumer.apply(RequestLogMiddleware).forRoutes('*');
    // 注册 JWT 解析中间件到所有路由
    consumer.apply(JwtParseMiddleware).forRoutes('*');
  }
}
