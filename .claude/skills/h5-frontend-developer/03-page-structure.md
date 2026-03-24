# 03 - 页面结构规范

每个页面应包含以下文件：

- `index.tsx` - 主组件文件（使用 useObserver 包裹）
- `useStore.ts` - 页面级 MobX 状态管理（使用 useLocalObservable）
- `handle.ts` - 业务处理逻辑函数
- `constant.ts` - 常量定义
- `index.module.scss` - 页面样式文件
- `types/index.ts` - 页面类型定义（如需要）
- `components/` - 子组件目录（每个子组件有独立的文件夹）

---

## 完整示例参考

### 页面组件示例

```tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useObserver } from "mobx-react";
import { PullToRefresh, InfiniteScroll, Loading, Toast } from "antd-mobile";
import { useEffectOnce } from "react-use";
import { debounce } from "es-toolkit";
import useStore, { SortType } from "./useStore";
import { ProductConst } from "./constant";
import { type ProductItem } from "@/types/product";
import {
  navigateToProductDetail,
  navigateToCart,
  addToCart,
  collectProduct
} from "./handle";
import { ProductCard } from "./components/ProductCard";
import styles from "./index.module.scss";

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
    []
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
    [debouncedSearch]
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
   * 处理收藏点击事件
   */
  const handleCollect = useCallback((e: React.MouseEvent, product: ProductItem) => {
    collectProduct(product);
  }, []);

  /**
   * 处理加入购物车点击事件
   */
  const handleAddToCart = useCallback((e: React.MouseEvent, product: ProductItem) => {
    addToCart(e, product);
  }, []);

  return useObserver(() => {
    return (
      <div className={styles.container}>
        {/* 商品列表容器 */}
        <div className={styles.productListContainer}>
          <PullToRefresh
            onRefresh={async () => {
              store.setRefreshing(true);
              await store.refreshProductList();
              Toast.show({
                icon: "success",
                content: "刷新成功"
              });
            }}
          >
            <InfiniteScroll
              loadMore={async () => {
                await store.loadMoreProductList();
              }}
              hasMore={store.hasMore}
              threshold={100}
            >
              {/* 商品瀑布流列表 */}
              <div className={styles.productWaterfall}>
                {store.productList.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onCardClick={handleProductCardClick}
                    onCollect={handleCollect}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </PullToRefresh>
        </div>
      </div>
    );
  });
};

export default Product;
```

### Store 示例（使用 useLocalObservable）

```tsx
import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react";
import { productApi } from "@/api/product";
import type { ProductItem } from "@/types/product";

/**
 * 排序类型枚举
 */
export type SortType = 'default' | 'sales' | 'priceAsc' | 'priceDesc'

/**
 * 商品状态管理接口
 */
export interface ProductStoreType {
  // 状态数据
  productList: ProductItem[];        // 商品列表数据
  searchKeyword: string;              // 搜索关键词
  currentCategory: string;            // 当前分类
  currentSort: SortType;             // 当前排序方式
  loading: boolean;                  // 加载状态
  refreshing: boolean;               // 刷新状态
  loadingMore: boolean;              // 加载更多状态
  hasMore: boolean;                  // 是否有更多数据
  page: number;                      // 当前页码
  pageSize: number;                  // 每页数量

  // Setter 方法
  setSearchKeyword: (keyword: string) => void;
  setCurrentCategory: (category: string) => void;
  setCurrentSort: (sort: SortType) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setLoadingMore: (loadingMore: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setPage: (page: number) => void;
  setProductList: (list: ProductItem[]) => void;
  addProductList: (list: ProductItem[]) => void;

  // 业务方法
  fetchProductList: () => Promise<void>;      // 获取商品列表
  refreshProductList: () => Promise<void>;     // 刷新商品列表
  loadMoreProductList: () => Promise<void>;     // 加载更多商品
  clearProductList: () => void;              // 清空商品列表
}

type UseProductStoreType = () => ProductStoreType;

/**
 * 商品模块状态管理 Hook
 * 使用 MobX 进行状态管理，包含商品列表、搜索、分类、排序等功能
 */
const useProductStore: UseProductStoreType = () => {
  const store = useLocalObservable<ProductStoreType>(() => ({
    // 初始化状态
    productList: [],
    searchKeyword: "",
    currentCategory: "all",
    currentSort: "default",
    loading: false,
    refreshing: false,
    loadingMore: false,
    hasMore: true,
    page: 1,
    pageSize: 10,

    /**
     * 获取商品列表
     * 根据当前分页、分类、排序、搜索条件获取数据
     */
    async fetchProductList() {
      store.setLoading(true);

      try {
        // res: API 返回的商品列表数据
        const res = await productApi.getProductList({
          page: store.page,
          pageSize: store.pageSize,
          categoryId: store.currentCategory,
          sortBy: store.currentSort,
          keyword: store.searchKeyword || undefined,
        });

        runInAction(() => {
          if (store.page === 1) {
            store.setProductList(res.list);
          } else {
            store.addProductList(res.list);
          }

          store.setHasMore(res.hasMore);
          store.setLoading(false);
          store.refreshing = false;
          store.loadingMore = false;
        });
      } catch (error) {
        console.error("获取商品列表失败:", error);
        runInAction(() => {
          store.setLoading(false);
          store.refreshing = false;
          store.loadingMore = false;
        });
      }
    },

    /**
     * 刷新商品列表
     * 重置到第一页并重新获取数据
     */
    async refreshProductList() {
      store.setRefreshing(true);
      store.setPage(1);
      await store.fetchProductList();
    },

    /**
     * 加载更多商品
     * 增加页码并获取下一页数据
     * 使用请求锁防止并发请求
     */
    async loadMoreProductList() {
      if (store.loadingMore || !store.hasMore) return;

      store.setLoadingMore(true);
      store.setPage(store.page + 1);
      await store.fetchProductList();
    }
  }));

  return store;
};

export default useProductStore;
```

### 业务处理函数示例（handle.ts）

```tsx
import type { ProductItem } from '@/types/product';
import { Toast } from "antd-mobile";
import { NavigateOptions, To, useNavigate } from "react-router-dom";

/**
 * 格式化价格显示
 * @param price - 原始价格数值
 * @returns 格式化后的价格字符串，保留两位小数
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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
 * 截断文本
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * 添加商品到购物车
 * @param product - 商品信息
 */
export const addToCart = (product: ProductItem): void => {
  console.log(`添加到购物车: ${product.title}`);
  Toast.show({
    icon: "success",
    content: "已加入购物车"
  });
};

/**
 * 收藏商品
 * @param product - 商品信息
 */
export const collectProduct = (product: ProductItem): void => {
  console.log(`收藏商品: ${product.title}`);
  Toast.show({
    icon: "success",
    content: "收藏成功"
  });
};

/**
 * 跳转到商品详情页
 */
export const navigateToProductDetail = (productId: string): void => {
  const navigate = useNavigate();
  navigate(`/product/${productId}`);
};
```

### 常量定义示例（constant.ts）

```tsx
/**
 * Product 模块常量定义
 */

// ==================== 常量配置 ====================
export const PAGE_SIZE = 10;              // 每页显示的商品数量
export const SEARCH_DEBOUNCE_TIME = 300;  // 搜索防抖时间（毫秒）

// ==================== 分类配置 ====================
export const CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "electronics", name: "数码家电" },
  { id: "clothing", name: "服饰鞋包" },
  { id: "food", name: "食品生鲜" },
  { id: "beauty", name: "美妆护肤" },
  { id: "home", name: "家居生活" },
  { id: "sports", name: "运动户外" }
];

export interface CategoryItem {
  id: string;
  name: string;
}

// ==================== 排序配置 ====================
export const SORT_OPTIONS = [
  { id: "default", name: "综合" },
  { id: "sales", name: "销量" },
  { id: "priceAsc", name: "价格升序" },
  { id: "priceDesc", name: "价格降序" }
];

export interface SortOptionItem {
  id: string;
  name: string;
}

// ==================== 导航配置 ====================
export const NAVIGATION_ITEMS = [
  { id: "home", name: "首页", icon: "🏠" },
  { id: "category", name: "分类", icon: "📂" },
  { id: "cart", name: "购物车", icon: "🛒" },
  { id: "profile", name: "我的", icon: "👤" }
];

export interface NavigationItem {
  id: string;
  name: string;
  icon: string;
}

// ==================== 类型导出 ====================
export type { ProductItem } from '@/types/product';
```
