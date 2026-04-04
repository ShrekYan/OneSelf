import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
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
    const categories = await this.prisma.category.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'desc' },
    });

    // 数据库下划线命名 → DTO 驼峰命名转换
    const list: CategoryItemDto[] = categories.map((category: Category) => ({
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

    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      where: { is_active: true },
      orderBy: {
        article_count: 'desc',
      },
    });

    const keywords: HotKeywordDto[] = categories.map(
      (category: Pick<Category, 'id' | 'name'>) => ({
        id: category.id,
        name: category.name,
      }),
    );

    return { keywords };
  }
}
