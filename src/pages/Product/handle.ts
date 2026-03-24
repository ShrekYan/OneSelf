import type { ProductItem } from '@/types/product';
import { Toast } from 'antd-mobile';

/**
 * 格式化价格显示
 * @param price - 原始价格数值
 * @returns 格式化后的价格字符串，保留两位小数
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * 格式化销量显示
 * @param sales - 销量数值
 * @returns 格式化后的销量字符串，超过1万显示为"x.x万+"
 */
export const formatSales = (sales: number): string => {
  if (sales >= 10000) {
    return `${(sales / 10000).toFixed(1)}万+`;
  }
  return `${sales}+`;
};

/**
 * 截取文本并添加省略号
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @returns 截取后的文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '…';
};

/**
 * 导航到商品详情页面
 * @param productId - 商品ID
 */
export const navigateToProductDetail = (productId: string): void => {
  console.log(`导航到商品详情页: ${productId}`);
  window.location.href = `/product/detail/${productId}`;
};

/**
 * 导航到购物车页面
 */
export const navigateToCart = (): void => {
  console.log('导航到购物车');
  window.location.href = '/cart';
};

/**
 * 导航到商品分类页面
 * @param categoryId - 分类ID
 */
export const navigateToCategory = (categoryId: string): void => {
  console.log(`导航到分类页: ${categoryId}`);
  window.location.href = `/product/category/${categoryId}`;
};

/**
 * 导航到商品搜索页面
 */
export const navigateToSearch = (): void => {
  console.log('导航到搜索页');
  window.location.href = '/product/search';
};

/**
 * 导航到用户个人中心页面
 */
export const navigateToProfile = (): void => {
  console.log('导航到个人中心');
  window.location.href = '/profile';
};

/**
 * 添加商品到购物车
 * @param product - 商品信息
 */
export const addToCart = (product: ProductItem): void => {
  console.log(`添加到购物车: ${product.title}`);
  Toast.show({
    icon: 'success',
    content: '已加入购物车',
  });
};

/**
 * 收藏商品
 * @param product - 商品信息
 */
export const collectProduct = (product: ProductItem): void => {
  console.log(`收藏商品: ${product.title}`);
  Toast.show({
    icon: 'success',
    content: '收藏成功',
  });
};

/**
 * 根据折扣率计算折扣后价格
 * @param product - 商品信息
 * @returns 折扣后的价格
 */
export const getDiscountPrice = (product: ProductItem): number => {
  if (product.discount && product.discount > 0 && product.originalPrice) {
    return Math.round(product.originalPrice * (1 - product.discount / 100));
  }
  return product.price;
};

/**
 * 计算折扣百分比
 * @param originalPrice - 原价
 * @param currentPrice - 当前价格
 * @returns 折扣百分比
 */
export const calculateDiscountPercent = (
  originalPrice: number,
  currentPrice: number,
): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
