import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.scss';
import useExploreStore from './useStore';
import { useHandleCategoryClick } from './hooks/useHandleCategoryClick';
import { CategoryCard } from './components';

/**
 * Explore 探索页面
 * @description 发现内容，按分类浏览文章
 */
const ExplorePage: React.FC = () => {
  // 在组件顶层调用 Hook 获取 store
  const exploreStore = useExploreStore();
  // 在组件顶层调用 Hook 获取 navigate，返回实际处理函数
  const onCategoryClick = useHandleCategoryClick();
  const navigate = useNavigate();

  // 组件加载时获取分类数据
  useEffect(() => {
    void exploreStore.fetchCategories();
  }, [exploreStore]);

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  return useObserver(() => (
    <div className={styles.exploreRoot}>
      {/* 顶部导航栏 */}
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <div className={styles.logoB}>B</div>
        </div>
        <h1 className={styles.title}>Explore Topics</h1>
        <div className={styles.rightSection}>
          <div className={styles.iconBtn} onClick={handleSearchClick}>
            <svg viewBox="0 0 24 24" aria-label="搜索">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className={styles.iconBtn} onClick={handleNotificationsClick}>
            <svg viewBox="0 0 24 24" aria-label="通知">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className={styles.notificationDot} />
          </div>
        </div>
      </header>

      {/* 欢迎横幅 */}
      <section className={styles.banner}>
        <div className={styles.bannerIcon}>
          <svg viewBox="0 0 24 24" aria-label="书本">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
          </svg>
        </div>
        <h2 className={styles.bannerTitle}>Find your next read</h2>
        <p className={styles.bannerDesc}>
          Explore thousands of articles across topics that matter to you.
        </p>
      </section>

      {/* 分类列表 */}
      <section className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>Popular Categories</h2>
        <div className={styles.categoriesGrid}>
          {exploreStore.loading ? (
            <div className={styles.loadingPlaceholder}>加载中...</div>
          ) : (
            exploreStore
              .filteredCategories()
              .map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={onCategoryClick}
                />
              ))
          )}
        </div>
      </section>
    </div>
  ));
};

ExplorePage.displayName = 'ExplorePage';

export default ExplorePage;
