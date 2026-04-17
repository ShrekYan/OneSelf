import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthClientService } from './auth-client.service';
import { RemoteJwtAuthGuard } from './remote-jwt-auth.guard';
import { RemoteJwtParseMiddleware } from './remote-jwt-parse.middleware';

@Module({
  imports: [HttpModule],
  providers: [AuthClientService, RemoteJwtAuthGuard, RemoteJwtParseMiddleware],
  exports: [AuthClientService, RemoteJwtAuthGuard, RemoteJwtParseMiddleware],
})
export class SharedModule {}
