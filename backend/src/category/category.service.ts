import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Categories, HotSearchKeywords } from '@prisma/client';
import {
  CategoryListResponseDto,
  CategoryItemDto,
  HotKeywordsResponseDto,
  HotKeywordDto,
} from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getList(): Promise<CategoryListResponseDto> {
    const categories = await this.prisma.categories.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'desc' },
    });

    // 数据库下划线命名 → DTO 驼峰命名转换
    const list: CategoryItemDto[] = categories.map((category: Categories) => ({
      id: category.id,
      name: category.name,
      articleCount: category.article_count,
      imageUrl: category.image_url ?? undefined,
      description: category.description ?? undefined,
      sortOrder: category.sort_order ?? undefined,
    }));

    return {
      list,
      total: list.length,
    };
  }

  async getHotKeywords(): Promise<HotKeywordsResponseDto> {
    // 只查询 id 和 name 两个字段，优化查询性能

    const keywords = await this.prisma.hotSearchKeywords.findMany({
      where: { is_active: true }, // ← 加上这句，只查询激活的关键词
      orderBy: {
        sort_order: 'desc',
      },
    });

    const result: HotKeywordDto[] = keywords.map((item: HotSearchKeywords) => ({
      id: item.id,
      name: item.keyword,
    }));

    return { keywords: result };
  }
}
