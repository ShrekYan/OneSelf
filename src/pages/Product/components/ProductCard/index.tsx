import React from 'react';
import { LazyImage } from '../LazyImage';
import type { ProductItem } from '@/types/product';
import styles from './index.module.scss';
import { formatPrice, formatSales, truncateText } from '../../handle';

/**
 * 商品卡片组件属性接口
 */
interface ProductCardProps {
  product: ProductItem; // 商品信息
  onCardClick: (product: ProductItem) => void; // 卡片点击回调
  onCollect: (e: React.MouseEvent, product: ProductItem) => void; // 收藏回调
  onAddToCart: (e: React.MouseEvent, product: ProductItem) => void; // 加入购物车回调
}

/**
 * 商品卡片组件
 * 展示商品图片、标题、描述、标签、价格、销量等信息
 * 包含收藏和加入购物车功能按钮
 */
export const ProductCard = React.memo(
  ({ product, onCardClick, onCollect, onAddToCart }: ProductCardProps) => {
    return (
      <div className={styles.card} onClick={() => onCardClick(product)}>
        {/* 商品图片容器 */}
        <div className={styles.imageContainer}>
          <LazyImage
            src={product.image}
            alt={product.title}
            className={styles.imageWrapper}
          />
          {/* 折扣标签 */}
          {product.discount && product.discount > 0 && (
            <div className={styles.discountBadge}>{product.discount}折</div>
          )}
        </div>

        {/* 商品信息内容 */}
        <div className={styles.content}>
          {/* 商品标题 */}
          <h3 className={styles.title}>{product.title}</h3>
          {/* 商品描述 */}
          <p className={styles.description}>
            {truncateText(product.description, 40)}
          </p>

          {/* 商品标签区域 */}
          <div className={styles.meta}>
            <div className={styles.tags}>
              {product.tags.slice(0, 2).map((tag, index) => (
                // tag: 商品标签文本，index: 标签的索引
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 价格信息区域 */}
          <div className={styles.priceContainer}>
            <span className={styles.priceSymbol}>¥</span>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {/* 原价显示（如果有折扣） */}
            {(product.originalPrice || 0) > product.price && (
              <span className={styles.originalPrice}>
                ¥{formatPrice(product.originalPrice || 0)}
              </span>
            )}
          </div>

          {/* 底部操作栏 */}
          <div className={styles.footer}>
            {/* 销量信息 */}
            <span className={styles.salesInfo}>
              已售 {formatSales(product.sales)}
            </span>
            {/* 操作按钮 */}
            <div className={styles.actionButtons}>
              <button
                className={styles.actionButton}
                onClick={e => onCollect(e, product)}
                title="收藏"
              >
                ❤️
              </button>
              <button
                className={`${styles.actionButton} ${styles.cartButton}`}
                onClick={e => onAddToCart(e, product)}
                title="加入购物车"
              >
                🛒
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
