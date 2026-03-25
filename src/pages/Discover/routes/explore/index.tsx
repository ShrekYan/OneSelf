import React from 'react';
import styles from './index.module.scss';

interface Category {
  id: string;
  name: string;
  articleCount: number;
  imageUrl?: string;
}

const categories: Category[] = [
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    articleCount: 142,
    imageUrl:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    articleCount: 284,
    imageUrl:
      'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=300&fit=crop',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    articleCount: 95,
    imageUrl:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
  },
  {
    id: 'life-culture',
    name: 'Life & Culture',
    articleCount: 213,
  },
  {
    id: 'web3-crypto',
    name: 'Web3 & Crypto',
    articleCount: 87,
  },
  {
    id: 'startups',
    name: 'Startups',
    articleCount: 164,
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
  },
];

const ExplorePage: React.FC = () => {
  const handleCategoryClick = (_id: string) => {
    console.log('Navigate to category:', _id);
    // TODO: 跳转到分类文章列表页面
  };

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <div className={styles.logoB}>B</div>
        </div>
        <h1 className={styles.title}>Explore Topics</h1>
        <div className={styles.rightSection}>
          <div className={styles.iconBtn}>
            <svg viewBox="0 0 24 24" aria-label="搜索">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className={styles.iconBtn}>
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
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
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
          {categories.map(category => (
            <div
              key={category.id}
              className={`${styles.categoryCard} ${category.imageUrl ? styles.hasImage : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCategoryClick(category.id);
                }
              }}
            >
              {category.imageUrl && (
                <div className={styles.categoryImage}>
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                  />
                </div>
              )}
              <div className={styles.categoryOverlay} />
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryCount}>
                  {category.articleCount} Articles
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
