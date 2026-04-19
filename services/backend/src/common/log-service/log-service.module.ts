import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LogServiceClientService } from './log-service-client.service';

@Module({
  imports: [HttpModule],
  providers: [LogServiceClientService],
  exports: [LogServiceClientService],
})
export class LogServiceModule {}
