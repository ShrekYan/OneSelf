import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useObserver } from 'mobx-react';
import { Toast } from 'antd-mobile';
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
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';
import styles from './index.module.scss';

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
   * 处理刷新事件
   */
  const handleRefresh = useCallback(async () => {
    store.setRefreshing(true);
    await store.refreshProductList();
  }, []);

  /**
   * 处理加载更多事件
   */
  const handleLoadMore = useCallback(async () => {
    await store.loadMoreProductList();
  }, []);

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
      if (!target.closest(`.${styles.sortDropdown}`)) {
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
      <div className={styles.container}>
        {/* 顶部搜索栏 */}
        <SearchBar
          keyword={store.searchKeyword}
          inputRef={searchInputRef}
          onChange={handleSearchInputChange}
          onClear={handleClearSearch}
        />

        {/* 分类和排序栏 */}
        <FilterBar
          currentCategory={store.currentCategory}
          currentSort={store.currentSort}
          showSortMenu={showSortMenu}
          onCategorySelect={handleCategorySelect}
          onSortMenuToggle={handleSortMenuToggle}
          onSortSelect={handleSortSelect}
        />

        {/* 商品列表容器 */}
        <ProductList
          productList={store.productList}
          loading={store.loading}
          loadingMore={store.loadingMore}
          hasMore={store.hasMore}
          refreshing={store.refreshing}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          onProductCardClick={handleProductCardClick}
          onAddToCart={handleAddToCart}
          onCollect={handleCollect}
        />

        {/* 底部导航栏 */}
        <div className={styles.bottomNav}>
          {ProductConst.NAVIGATION_ITEMS.map(item => (
            <div
              key={item.id}
              className={`${styles.navItem} ${store.currentNav === item.id ? styles.active : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  });
};

export default Product;
