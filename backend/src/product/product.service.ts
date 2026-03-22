import { Injectable } from '@nestjs/common';
import {
  QueryProductListDto,
  ProductListResponseDto,
  ProductItemDto,
} from './dto';
import { SortBy } from './dto/query-product-list.dto';

@Injectable()
export class ProductService {
  // Mock 数据，后续替换为数据库查询
  private readonly mockProducts: ProductItemDto[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max 256GB 原色钛金属',
      description: 'A17 Pro 芯片，钛金属设计，4800 万像素主摄',
      price: 9999,
      originalPrice: 11999,
      sales: 15800,
      stock: 999,
      category: 'electronics',
      tags: ['热销', '新品', '包邮'],
      image: 'https://picsum.photos/300/300?random=11',
      rating: 4.9,
      reviews: 2340,
      discount: 17,
    },
    {
      id: '2',
      title: 'MacBook Pro 14英寸 M3 Pro芯片',
      description: '18GB内存 512GB固态硬盘 深空灰色',
      price: 16999,
      originalPrice: 18999,
      sales: 5200,
      stock: 500,
      category: 'electronics',
      tags: ['办公', '高性能'],
      image: 'https://picsum.photos/300/300?random=12',
      rating: 4.8,
      reviews: 890,
      discount: 11,
    },
    {
      id: '3',
      title: '耐克 Nike Air Max 270 运动鞋',
      description: '休闲跑步鞋 透气缓震 潮流百搭',
      price: 899,
      originalPrice: 1299,
      sales: 32000,
      stock: 2000,
      category: 'clothing',
      tags: ['爆款', '免运费'],
      image: 'https://picsum.photos/300/300?random=13',
      rating: 4.7,
      reviews: 5600,
      discount: 31,
    },
    {
      id: '4',
      title: 'SK-II 神仙水 230ml 精华液',
      description: 'PITERA™ 精华 改善肌肤问题 提升肌肤质地',
      price: 1599,
      originalPrice: 1890,
      sales: 8900,
      stock: 800,
      category: 'beauty',
      tags: ['进口', '正品保障'],
      image: 'https://picsum.photos/300/300?random=14',
      rating: 4.9,
      reviews: 3200,
      discount: 15,
    },
    {
      id: '5',
      title: '雅诗兰黛小棕瓶精华 30ml',
      description: '抗皱修护 保湿滋润 紧致肌肤',
      price: 980,
      originalPrice: 1180,
      sales: 12500,
      stock: 1500,
      category: 'beauty',
      tags: ['热销', '赠品'],
      image: 'https://picsum.photos/300/300?random=15',
      rating: 4.8,
      reviews: 4500,
      discount: 17,
    },
    {
      id: '6',
      title: '三得利白桃乌龙茶 500ml*12瓶',
      description: '无糖低卡 0脂0卡 桃香清新',
      price: 59,
      originalPrice: 79,
      sales: 68000,
      stock: 5000,
      category: 'food',
      tags: ['爆款', '超值'],
      image: 'https://picsum.photos/300/300?random=16',
      rating: 4.6,
      reviews: 8900,
      discount: 25,
    },
    {
      id: '7',
      title: '小米空气净化器4 Pro',
      description: '除甲醛 除菌除异味 智能控制',
      price: 1599,
      originalPrice: 1899,
      sales: 4500,
      stock: 600,
      category: 'home',
      tags: ['智能家居', '健康'],
      image: 'https://picsum.photos/300/300?random=17',
      rating: 4.7,
      reviews: 2100,
      discount: 16,
    },
    {
      id: '8',
      title: '迪卡侬运动背包 30L',
      description: '登山徒步 旅行通勤 防水耐磨',
      price: 199,
      originalPrice: 299,
      sales: 28000,
      stock: 3000,
      category: 'sports',
      tags: ['户外', '大容量'],
      image: 'https://picsum.photos/300/405?random=18',
      rating: 4.5,
      reviews: 6800,
      discount: 33,
    },
    {
      id: '9',
      title: '索尼 WH-1000XM5 降噪耳机',
      description: '无线蓝牙 头戴式 主动降噪',
      price: 2499,
      originalPrice: 2899,
      sales: 3800,
      stock: 400,
      category: 'electronics',
      tags: ['数码', '降噪'],
      image: 'https://picsum.photos/300/300?random=19',
      rating: 4.9,
      reviews: 1500,
      discount: 14,
    },
    {
      id: '10',
      title: '优衣库 UNIQLO 羊绒针织衫',
      description: '100%羊毛 保暖舒适 经典款',
      price: 399,
      originalPrice: 599,
      sales: 15600,
      stock: 1800,
      category: 'clothing',
      tags: ['保暖', '舒适'],
      image: 'https://picsum.photos/300/300?random=20',
      rating: 4.6,
      reviews: 4200,
      discount: 33,
    },
    {
      id: '11',
      title: '星巴克深度烘焙咖啡豆 227g',
      description: '进口咖啡豆 浓郁香醇 意式拼配',
      price: 128,
      originalPrice: 158,
      sales: 9800,
      stock: 2500,
      category: 'food',
      tags: ['进口', '咖啡'],
      image: 'https://picsum.photos/300/300?random=21',
      rating: 4.7,
      reviews: 3200,
      discount: 19,
    },
    {
      id: '12',
      title: '宜家 MALM 马尔姆床架',
      description: '实木床架 北欧简约 1.5米双人床',
      price: 1299,
      originalPrice: 1599,
      sales: 3200,
      stock: 200,
      category: 'home',
      tags: ['家具', '简约'],
      image: 'https://picsum.photos/300/300?random=22',
      rating: 4.5,
      reviews: 890,
      discount: 19,
    },
  ];

  async queryProductList(
    query: QueryProductListDto,
  ): Promise<ProductListResponseDto> {
    // 复制一份 mock 数据，避免修改原始数据
    let filteredData = [...this.mockProducts];

    // 根据分类筛选
    if (query.categoryId && query.categoryId !== 'all') {
      filteredData = filteredData.filter(
        (product) => product.category === query.categoryId,
      );
    }

    // 根据搜索关键词筛选
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      filteredData = filteredData.filter(
        (product) =>
          product.title.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword) ||
          product.tags.some((tag) => tag.toLowerCase().includes(keyword)),
      );
    }

    // 根据排序方式排序
    this.sortProducts(filteredData, query.sortBy);

    // 计算总数
    const total = filteredData.length;

    // 获取分页参数（确保有默认值）
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // 是否有更多数据
    const hasMore = endIndex < total;

    return {
      list: paginatedData,
      total,
      page,
      pageSize,
      hasMore,
    };
  }

  private sortProducts(
    products: ProductItemDto[],
    sortBy: SortBy = SortBy.DEFAULT,
  ): void {
    switch (sortBy) {
      case SortBy.SALES:
        products.sort((a, b) => b.sales - a.sales);
        break;
      case SortBy.PRICE_ASC:
        products.sort((a, b) => a.price - b.price);
        break;
      case SortBy.PRICE_DESC:
        products.sort((a, b) => b.price - a.price);
        break;
      case SortBy.DEFAULT:
      default:
        // 默认排序：综合排序（可扩展为按销量、评分、创建时间等因素）
        products.sort((a, b) => b.sales - a.sales);
        break;
    }
  }
}
