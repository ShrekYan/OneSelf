import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { CommonModule } from '../common/common.module';
import { SharedModule } from '../shared/shared.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSyncService } from './user-sync.service';

/**
 * 用户信息模块
 * 负责用户信息查询、更新等用户管理功能
 */
@Module({
  imports: [PrismaModule, RedisModule, CommonModule, SharedModule],
  controllers: [UsersController],
  providers: [UsersService, UserSyncService],
  exports: [UsersService, UserSyncService],
})
export class UsersModule {}
