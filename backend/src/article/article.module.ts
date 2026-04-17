import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommonModule } from '../common/common.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [CommonModule, SharedModule],
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService],
})
export class ArticleModule {}
