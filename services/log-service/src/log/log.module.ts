import { Module } from '@nestjs/common';
import { LogController, HealthController } from './log.controller';

@Module({
  controllers: [LogController, HealthController],
})
export class LogModule {}
