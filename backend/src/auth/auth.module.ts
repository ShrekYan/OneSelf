import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * 认证模块
 * 负责用户登录、Token令牌生成和验证等认证功能
 */
@Module({
  //ConfigModule 这个是用来获取配置的模块，这里是为了获取JWT_SECRET
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
