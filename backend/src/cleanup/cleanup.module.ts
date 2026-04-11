import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { CleanupService } from './cleanup.service';

/**
 * 清理模块
 * 负责定时清理数据库中过期的冗余数据，保持表体积稳定
 */
@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [CleanupService],
})
export class CleanupModule {}
