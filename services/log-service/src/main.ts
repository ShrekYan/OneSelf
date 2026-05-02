// Must import preload FIRST before any other imports!
// This ensures dotenv.config() runs before Prisma is imported
import './preload';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 响应压缩中间件：压缩大于 1KB 的 JSON/文本响应，减少传输体积
  app.use(
    compression({
      threshold: 1024,
      level: 6,
      filter: (req, res) => {
        // 跳过已压缩的二进制格式
        if (String(res.getHeader('Content-Type') || '').includes('image/')) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Log Service API')
    .setDescription('Centralized Log Service API Documentation')
    .setVersion('1.0')
    .addTag('health', 'Health check')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 8890;
  const host = '0.0.0.0';
  await app.listen(port, host);

  console.log(`🚀 Log Service is running on: http://127.0.0.1:${port}`);
  console.log(`🚀 Alternative: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://127.0.0.1:${port}/docs`);
}
void bootstrap();
