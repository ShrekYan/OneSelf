/**
 * 商品数据类型
 */
export type ProductItem = {
  id: string;                    // 商品ID
  title: string;                 // 商品标题
  description: string;            // 商品描述
  price: number;                 // 当前价格
  originalPrice?: number;          // 原价（可选）
  sales: number;                 // 销量
  stock: number;                 // 库存
  category: string;              // 商品分类
  tags: string[];               // 商品标签
  image: string;                // 商品图片URL
  rating: number;                // 评分
  reviews: number;               // 评论数
  discount?: number;             // 折扣值（可选）
};
