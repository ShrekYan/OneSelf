import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  //AppModule 是 NestJS 应用的根模块，负责启动应用并配置全局依赖。
  const app = await NestFactory.create(AppModule);

  // 启用 CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 全局验证管道：自动校验所有进入控制器的请求体/DTO
  // whitelist=true          → 只保留 DTO（Data Transfer Object，数据传输对象）中声明的属性，多余字段被过滤
  // forbidNonWhitelisted=true → 若出现多余字段直接抛 400，拒绝请求
  // transform=true          → 把普通对象转成 DTO 实例，顺便做类型转换（如字符串→数字）
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 启用 API 版本控制，作用：让同一个接口支持多个版本（如 /v1/users 与 /v2/users），
  // 区分方式：在控制器或路由上通过 @Version('1')/@Version('2') 指定版本，
  // 请求时 URI 中携带版本号，Nest 会自动匹配对应版本的处理函数。
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 设置全局前缀，作用：在所有路由前添加固定路径（如 /api），
  // 避免与其他服务冲突，同时也方便前端调用时的路径拼接。
  app.setGlobalPrefix('api');

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('health', '健康检查')
    .addTag('product', '商品接口')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 8888;
  const host = '0.0.0.0';
  await app.listen(port, host);

  console.log(`🚀 Application is running on: http://127.0.0.1:${port}`);
  console.log(`🚀 Alternative: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://127.0.0.1:${port}/docs`);
}

void bootstrap();
