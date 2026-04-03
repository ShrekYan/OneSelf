import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import { DotLoading } from 'antd-mobile';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './index.module.scss';
import CategoryTabs from './components/category-tabs';
import ArticleListItem from './components/article-list-item';
import { useArticleListStore } from './useStore';
import * as handle from './handle';

const ArticleListPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const store = useArticleListStore();
  const categoryTabsRef = useRef<{ scrollToTab: (tabId: string) => void }>(
    null,
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  const handleLoadMore = handle.useHandleLoadMore(store);

  // 页面加载时获取分类列表
  useEffect(() => {
    store.fetchCategories();
  }, [store]);

  // 从路由参数初始化选中分类（分类列表加载完成后才能检查是否存在）
  useEffect(() => {
    if (categoryId && store.categories.length > 0) {
      // 检查分类是否存在
      const categoryExists = store.categories.some(
        cat => cat.id === categoryId,
      );
      if (categoryExists) {
        handle.handleTabChange(store, categoryId);
        // 延迟一帧让 DOM 更新后再滚动
        requestAnimationFrame(() => {
          categoryTabsRef.current?.scrollToTab(categoryId);
        });
      }
    }
  }, [categoryId, store.categories, store]);

  // 使用 reaction 监听 selectedCategoryId 和 categories 变化，只要变化就重新获取文章
  // 这是 MobX 推荐的响应式做法，可靠监听 observable 值变化
  useEffect(() => {
    const dispose = reaction(
      () => [store.selectedCategoryId, store.categories.length],
      () => {
        // 只有当分类列表已经加载完成才请求
        if (store.categories.length > 0) {
          // console.log('store.categories.length');
          store.fetchArticles();
        }
      },
      { fireImmediately: true }, // 初始化时立即触发一次，获取第一批数据
    );

    return dispose; // 组件卸载时清理 reaction，防止内存泄漏
  }, [store]);

  return useObserver(() => {
    console.log(store.hasMore);
    return (
      <div className={styles.articleListContainer}>
        {/* 顶部导航栏 - 毛玻璃效果，和详情页保持一致 */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <button className={styles.navButton} onClick={handleBack}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={styles.title}>{'文章列表'}</div>
            <div className={styles.rightActions}></div>
          </div>
        </header>

        {/* 分类标签栏 + 文章列表区域 */}
        <div className={styles.contentContainer}>
          {/* 分类标签栏 */}
          <CategoryTabs
            ref={categoryTabsRef}
            tabs={store.categories}
            defaultSelectedId={store.selectedCategoryId}
            onTabChange={tabId => handle.handleTabChange(store, tabId)}
          />

          {/* 文章列表区域 */}
          <div className={styles.listContainer}>
            <InfiniteScroll
              useWindow={true}
              loadMore={handleLoadMore}
              hasMore={store.hasMore}
              threshold={100}
            >
              {store.loading && store.allArticles.length === 0 && (
                <div className={styles.loadingContainer}>
                  <DotLoading color="primary" />
                </div>
              )}
              {!store.loading && store.allArticles.length === 0 && (
                <div className={styles.emptyContainer}>
                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <line x1="18" y1="18" x2="6" y2="6" />
                  </svg>
                  <p className={styles.emptyText}>暂无文章</p>
                </div>
              )}
              {store.allArticles.map(article => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  onClick={handleArticleClick}
                  onLikeClick={() => handle.handleLikeClick(store, article.id)}
                />
              ))}
              {store.loadingMore && (
                <div className={styles.loadingMore}>
                  <DotLoading color="primary" />
                  <span>加载中...</span>
                </div>
              )}
              {!store.hasMore && store.allArticles.length > 0 && (
                <div className={styles.noMore}>—— 已经到底啦 ——</div>
              )}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    );
  });
};

ArticleListPage.displayName = 'ArticleListPage';

export default ArticleListPage;
