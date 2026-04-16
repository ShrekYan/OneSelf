import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .setTitle('Auth Service API')
    .setDescription('Authentication & Authorization Service API Documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication')
    .addTag('introspect', 'Token introspection')
    .addTag('health', 'Health check')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 8889;
  const host = '0.0.0.0';
  await app.listen(port, host);

  console.log(`🚀 Auth Service is running on: http://127.0.0.1:${port}`);
  console.log(`🚀 Alternative: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://127.0.0.1:${port}/docs`);
}

bootstrap();
