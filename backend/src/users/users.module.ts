import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * 用户信息模块
 * 负责用户信息查询、更新等用户管理功能
 */
@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
