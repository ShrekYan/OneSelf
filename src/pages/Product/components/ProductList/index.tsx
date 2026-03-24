import React from 'react';
import { PullToRefresh, InfiniteScroll, Loading, Toast } from 'antd-mobile';
import type { ProductItem } from '@/types/product';
import { ProductCard } from '../ProductCard';
import styles from './index.module.scss';

/**
 * 商品列表组件属性
 */
export interface ProductListProps {
  /** 商品列表数据 */
  productList: ProductItem[];
  /** 是否正在加载 */
  loading: boolean;
  /** 是否正在加载更多 */
  loadingMore: boolean;
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 是否正在刷新 */
  refreshing: boolean;
  /** 刷新回调 */
  onRefresh: () => Promise<void>;
  /** 加载更多回调 */
  onLoadMore: () => Promise<void>;
  /** 商品卡片点击回调 */
  onProductCardClick: (product: ProductItem) => void;
  /** 添加到购物车回调 */
  onAddToCart: (e: React.MouseEvent, product: ProductItem) => void;
  /** 收藏商品回调 */
  onCollect: (e: React.MouseEvent, product: ProductItem) => void;
}

/**
 * 商品列表容器组件
 * 集成下拉刷新、无限滚动加载、空状态展示等功能
 */
const ProductList: React.FC<ProductListProps> = ({
  productList,
  loading,
  loadingMore,
  hasMore,
  onRefresh,
  onLoadMore,
  onProductCardClick,
  onAddToCart,
  onCollect,
}) => {
  return (
    <div className={styles.productListContainer}>
      <PullToRefresh
        onRefresh={async () => {
          await onRefresh();
          Toast.show({
            icon: 'success',
            content: '刷新成功',
          });
        }}
      >
        {/* 加载中状态 */}
        {loading && productList.length === 0 ? (
          <div className={styles.loadingContainer}>
            <Loading color="primary" />
          </div>
        ) : /* 无数据状态 */ productList.length === 0 ? (
          <div className={styles.noDataContainer}>
            <div className={styles.noDataIcon}>🛍️</div>
            <div className={styles.noDataText}>暂无商品</div>
          </div>
        ) : (
          <InfiniteScroll
            loadMore={async () => {
              await onLoadMore();
            }}
            hasMore={hasMore}
            threshold={100}
          >
            {/* 商品瀑布流列表 */}
            <div className={styles.productWaterfall}>
              {productList.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCardClick={onProductCardClick}
                  onCollect={onCollect}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {/* 加载更多状态 */}
            {loadingMore && (
              <div className={styles.loadingContainer}>
                <Loading color="primary" />
                <span style={{ marginLeft: 8 }}>加载中...</span>
              </div>
            )}

            {/* 没有更多数据提示 */}
            {!hasMore && productList.length > 0 && (
              <div className={styles.noMoreContainer}>—— 没有更多商品了 ——</div>
            )}
          </InfiniteScroll>
        )}
      </PullToRefresh>
    </div>
  );
};

export default ProductList;
