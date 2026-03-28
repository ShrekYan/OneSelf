/**
 * 分类卡片组件
 * @description 支持懒加载的分类卡片，包含骨架屏和进入动画
 */

import React from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import type { Category } from '@/pages/Discover/routes/explore/types';
import styles from './index.module.scss';

export interface CategoryCardProps {
  /** 分类数据 */
  category: Category;
  /** 点击回调 */
  onClick: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  // 使用 IntersectionObserver 监听卡片进入可视区域
  const [cardRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '100px',
  });

  const handleClick = (): void => {
    onClick(category.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick(category.id);
    }
  };

  // 卡片是否有图片
  const hasImage = Boolean(category.imageUrl);

  return (
    <div
      ref={cardRef}
      className={`${styles.categoryCardRoot} ${hasImage ? styles.hasImage : ''} ${
        isVisible ? styles.visible : ''
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* 骨架屏：在图片加载完成前显示 */}
      {hasImage && isVisible && <div className={styles.skeleton} />}

      {/* 图片：只有可见后才开始加载 */}
      {hasImage && isVisible && (
        <div className={styles.categoryImage}>
          <img src={category.imageUrl} alt={category.name} loading="lazy" />
        </div>
      )}

      {/* 蒙层 */}
      <div className={styles.categoryOverlay} />

      {/* 文字信息 */}
      <div className={styles.categoryInfo}>
        <h3 className={styles.categoryName}>{category.name}</h3>
        <p className={styles.categoryCount}>{category.articleCount} Articles</p>
      </div>
    </div>
  );
};

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
