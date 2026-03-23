import React from 'react';
import { LazyImage } from '../LazyImage';
import type { ProductItem } from '@/types/product';
import style from './index.module.scss';
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
      <div className={style.card} onClick={() => onCardClick(product)}>
        {/* 商品图片容器 */}
        <div className={style['image-container']}>
          <LazyImage
            src={product.image}
            alt={product.title}
            className={style['image-wrapper']}
          />
          {/* 折扣标签 */}
          {product.discount && product.discount > 0 && (
            <div className={style['discount-badge']}>{product.discount}折</div>
          )}
        </div>

        {/* 商品信息内容 */}
        <div className={style.content}>
          {/* 商品标题 */}
          <h3 className={style.title}>{product.title}</h3>
          {/* 商品描述 */}
          <p className={style.description}>
            {truncateText(product.description, 40)}
          </p>

          {/* 商品标签区域 */}
          <div className={style.meta}>
            <div className={style.tags}>
              {product.tags.slice(0, 2).map((tag, index) => (
                // tag: 商品标签文本，index: 标签的索引
                <span key={index} className={style.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 价格信息区域 */}
          <div className={style['price-container']}>
            <span className={style['price-symbol']}>¥</span>
            <span className={style.price}>{formatPrice(product.price)}</span>
            {/* 原价显示（如果有折扣） */}
            {(product.originalPrice || 0) > product.price && (
              <span className={style['original-price']}>
                ¥{formatPrice(product.originalPrice || 0)}
              </span>
            )}
          </div>

          {/* 底部操作栏 */}
          <div className={style.footer}>
            {/* 销量信息 */}
            <span className={style['sales-info']}>
              已售 {formatSales(product.sales)}
            </span>
            {/* 操作按钮 */}
            <div className={style['action-buttons']}>
              <button
                className={style['action-button']}
                onClick={e => onCollect(e, product)}
                title="收藏"
              >
                ❤️
              </button>
              <button
                className={`${style['action-button']} ${style['cart-button']}`}
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
