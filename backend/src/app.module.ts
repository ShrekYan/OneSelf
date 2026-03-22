import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';

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
    // ProductModule 是负责处理商品相关功能的模块，如查询商品列表、商品详情等。
    // ProductModule 是非全局模块，其他模块需要在 imports 中显式导入才能使用其服务。
    ProductModule,
    // AuthModule 是负责处理用户认证相关功能的模块，如登录、刷新令牌、登出等。
    AuthModule,
  ],
  // AppController 是应用的根控制器，负责处理应用的 HTTP 请求。
  // 这里将 AppController 导入到 AppModule 中，使得应用中的所有模块都可以使用 AppController 提供的路由处理方法。
  controllers: [AppController],
  // AppService 是应用的根服务，负责处理应用的业务逻辑。
  // 这里将 AppService 导入到 AppModule 中，使得应用中的所有模块都可以使用 AppService 提供的方法。
  providers: [AppService],
})
export class AppModule {}
