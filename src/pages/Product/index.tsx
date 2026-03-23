import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useObserver } from 'mobx-react';
import { PullToRefresh, InfiniteScroll, Loading, Toast } from 'antd-mobile';
import { useEffectOnce } from 'react-use';
import { debounce } from 'es-toolkit';
import useStore, { SortType } from './useStore';
import { ProductConst } from './constant';
import { type ProductItem } from '@/types/product';
import {
  navigateToProductDetail,
  navigateToCart,
  addToCart,
  collectProduct,
} from './handle';
import { ProductCard } from './components/ProductCard';
import style from './index.module.scss';

/**
 * 商品列表页面组件
 * 功能：商品展示、搜索、分类筛选、排序、下拉刷新、无限滚动
 */
const Product: React.FC = () => {
  const store = useStore();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // 防抖搜索函数
  const debouncedSearch = useMemo(
    () =>
      debounce((keyword: string) => {
        // keyword: 用户输入的搜索关键词
        store.setSearchKeyword(keyword);
        store.clearProductList();
        store.fetchProductList();
      }, ProductConst.SEARCH_DEBOUNCE_TIME),
    [],
  );

  // 页面初始化时加载商品列表
  useEffectOnce(() => {
    store.fetchProductList();
  });

  /**
   * 处理搜索输入变化
   * 使用防抖避免频繁请求
   */
  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value; // value: 输入框的当前值
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  /**
   * 清空搜索内容
   */
  const handleClearSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      store.setSearchKeyword('');
      store.clearProductList();
      store.fetchProductList();
    }
  }, []);

  /**
   * 处理分类选择
   * @param categoryId - 选中的分类ID
   */
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      if (store.currentCategory === categoryId) return;

      store.setCurrentCategory(categoryId);
      store.clearProductList();
      store.fetchProductList();
    },
    [store.currentCategory],
  );

  /**
   * 切换排序菜单显示状态
   */
  const handleSortMenuToggle = useCallback(() => {
    setShowSortMenu(prev => !prev);
  }, []);

  /**
   * 处理排序方式选择
   * @param sortId - 选中的排序ID
   */
  const handleSortSelect = useCallback(
    (sortId: string) => {
      if (store.currentSort === sortId) {
        setShowSortMenu(false);
        return;
      }

      store.setCurrentSort(sortId as SortType);
      store.clearProductList();
      store.fetchProductList();
      setShowSortMenu(false);
    },
    [store.currentSort],
  );

  /**
   * 处理商品卡片点击事件
   * 跳转到商品详情页
   * @param product - 点击的商品信息
   */
  const handleProductCardClick = useCallback((product: ProductItem) => {
    navigateToProductDetail(product.id);
  }, []);

  /**
   * 处理添加到购物车事件
   * @param e - 鼠标事件
   * @param product - 商品信息
   */
  const handleAddToCart = useCallback(
    (e: React.MouseEvent, product: ProductItem) => {
      e.stopPropagation();
      addToCart(product);
    },
    [],
  );

  /**
   * 处理收藏商品事件
   * @param e - 鼠标事件
   * @param product - 商品信息
   */
  const handleCollect = useCallback(
    (e: React.MouseEvent, product: ProductItem) => {
      e.stopPropagation();
      collectProduct(product);
    },
    [],
  );

  /**
   * 处理底部导航点击事件
   * @param navId - 导航项ID
   */
  const handleNavClick = useCallback((navId: string) => {
    if (navId === 'cart') {
      navigateToCart();
      return;
    }

    store.setCurrentNav(navId);
    Toast.show({
      content: `切换到: ${ProductConst.NAVIGATION_ITEMS.find(n => n.id === navId)?.name}`,
    });
  }, []);

  /**
   * 点击页面外部关闭排序菜单
   */
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement; // target: 点击的目标元素
      if (!target.closest(`.${style['sort-dropdown']}`)) {
        setShowSortMenu(false);
      }
    };

    if (showSortMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSortMenu]);

  return useObserver(() => {
    return (
      <div className={style.container}>
        {/* 顶部搜索栏 */}
        <div className={style['search-bar']}>
          <div className={style['search-input-container']}>
            <span className={style['search-icon']}>🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className={style['search-input']}
              placeholder="搜索商品..."
              onChange={handleSearchInputChange}
              value={store.searchKeyword}
            />
            {store.searchKeyword && (
              <div
                className={style['clear-button']}
                onClick={handleClearSearch}
              >
                ✕
              </div>
            )}
          </div>
        </div>

        {/* 分类和排序栏 */}
        <div className={style['filter-bar']}>
          <div className={style['filter-row']}>
            <div className={style['category-nav']}>
              {ProductConst.CATEGORIES.map(category => (
                <div
                  key={category.id}
                  className={`${style['category-item']} ${
                    store.currentCategory === category.id ? style.active : ''
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>
            <div className={style['sort-dropdown']}>
              <button
                className={`${style['sort-button']} ${showSortMenu ? style.active : ''}`}
                onClick={handleSortMenuToggle}
              >
                {
                  ProductConst.SORT_OPTIONS.find(
                    s => s.id === store.currentSort,
                  )?.name
                }
                <span className={style['sort-arrow']}>▼</span>
              </button>
              {showSortMenu && (
                <div className={style['sort-menu']}>
                  {ProductConst.SORT_OPTIONS.map(option => (
                    <div
                      key={option.id}
                      className={`${style['sort-option']} ${
                        store.currentSort === option.id ? style.active : ''
                      }`}
                      onClick={() => handleSortSelect(option.id)}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 商品列表容器 */}
        <div className={style['product-list-container']}>
          <PullToRefresh
            onRefresh={async () => {
              store.setRefreshing(true);
              await store.refreshProductList();
              Toast.show({
                icon: 'success',
                content: '刷新成功',
              });
            }}
          >
            {/* 加载中状态 */}
            {store.loading && store.page === 1 ? (
              <div className={style['loading-container']}>
                <Loading color="primary" />
              </div>
            ) : /* 无数据状态 */ store.productList.length === 0 ? (
              <div className={style['no-data-container']}>
                <div className={style['no-data-icon']}>🛍️</div>
                <div className={style['no-data-text']}>暂无商品</div>
              </div>
            ) : (
              <InfiniteScroll
                loadMore={async () => {
                  await store.loadMoreProductList();
                }}
                hasMore={store.hasMore}
                threshold={100}
              >
                {/* 商品瀑布流列表 */}
                <div className={style['product-waterfall']}>
                  {store.productList.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onCardClick={handleProductCardClick}
                      onCollect={handleCollect}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* 加载更多状态 */}
                {store.loadingMore && (
                  <div className={style['loading-container']}>
                    <Loading color="primary" />
                    <span style={{ marginLeft: 8 }}>加载中...</span>
                  </div>
                )}

                {/* 没有更多数据提示 */}
                {!store.hasMore && store.productList.length > 0 && (
                  <div className={style['no-more-container']}>
                    —— 没有更多商品了 ——
                  </div>
                )}
              </InfiniteScroll>
            )}
          </PullToRefresh>
        </div>

        {/* 底部导航栏 */}
        <div className={style['bottom-nav']}>
          {ProductConst.NAVIGATION_ITEMS.map(item => (
            <div
              key={item.id}
              className={`${style['nav-item']} ${store.currentNav === item.id ? style.active : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className={style['nav-icon']}>{item.icon}</span>
              <span className={style['nav-text']}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  });
};

export default Product;
