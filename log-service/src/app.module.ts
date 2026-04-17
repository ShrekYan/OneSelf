import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
