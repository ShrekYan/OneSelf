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
  currentNav: string;                // 当前导航项
  isLoading: boolean;                // 请求锁（防止并发请求）

  // Setter 方法
  setSearchKeyword: (keyword: string) => void;
  setCurrentCategory: (category: string) => void;
  setCurrentSort: (sort: SortType) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setLoadingMore: (loadingMore: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setPage: (page: number) => void;
  setCurrentNav: (nav: string) => void;
  setProductList: (list: ProductItem[]) => void;
  addProductList: (list: ProductItem[]) => void;
  setIsLoading: (isLoading: boolean) => void;

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
    currentNav: "home",
    isLoading: false,

    // ============ Setter 方法 ============

    /**
     * 设置搜索关键词
     */
    setSearchKeyword(keyword: string) {
      runInAction(() => {
        store.searchKeyword = keyword;
        store.page = 1;
        store.hasMore = true;
      });
    },

    /**
     * 设置当前分类
     */
    setCurrentCategory(category: string) {
      runInAction(() => {
        store.currentCategory = category;
        store.page = 1;
        store.hasMore = true;
      });
    },

    /**
     * 设置排序方式
     */
    setCurrentSort(sort: SortType) {
      runInAction(() => {
        store.currentSort = sort;
        store.page = 1;
        store.hasMore = true;
      });
    },

    /**
     * 设置加载状态
     */
    setLoading(loading: boolean) {
      runInAction(() => {
        store.loading = loading;
      });
    },

    /**
     * 设置刷新状态
     */
    setRefreshing(refreshing: boolean) {
      runInAction(() => {
        store.refreshing = refreshing;
      });
    },

    /**
     * 设置加载更多状态
     */
    setLoadingMore(loadingMore: boolean) {
      runInAction(() => {
        store.loadingMore = loadingMore;
      });
    },

    /**
     * 设置是否有更多数据
     */
    setHasMore(hasMore: boolean) {
      runInAction(() => {
        store.hasMore = hasMore;
      });
    },

    /**
     * 设置当前页码
     */
    setPage(page: number) {
      runInAction(() => {
        store.page = page;
      });
    },

    /**
     * 设置当前导航项
     */
    setCurrentNav(nav: string) {
      runInAction(() => {
        store.currentNav = nav;
      });
    },

    /**
     * 设置加载锁状态
     */
    setIsLoading(isLoading: boolean) {
      runInAction(() => {
        store.isLoading = isLoading;
      });
    },

    /**
     * 设置商品列表（替换）
     */
    setProductList(list: ProductItem[]) {
      runInAction(() => {
        store.productList = list;
      });
    },

    /**
     * 添加商品列表（追加）
     * 会过滤掉已存在的商品，避免重复 key 错误
     */
    addProductList(list: ProductItem[]) {
      runInAction(() => {
        // existingMap: 已有商品的 Map，key 为商品 ID，value 为商品对象
        const existingMap = new Map(store.productList.map(p => [p.id, p]));
        // newItems: 过滤掉已存在的商品后的新商品列表
        const newItems = list.filter(item => !existingMap.has(item.id));
        store.productList = [...store.productList, ...newItems];
      });
    },

    // ============ 业务方法 ============

    /**
     * 清空商品列表并重置分页
     */
    clearProductList() {
      runInAction(() => {
        store.productList = [];
        store.page = 1;
        store.hasMore = true;
      });
    },

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
          store.setRefreshing(false);
          store.setLoadingMore(false);
          store.setIsLoading(false);
        });
      } catch (error) {
        console.error("获取商品列表失败:", error);
        runInAction(() => {
          store.setLoading(false);
          store.setRefreshing(false);
          store.setLoadingMore(false);
          store.setIsLoading(false);
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
      if (store.loadingMore || !store.hasMore || store.isLoading) return;

      store.setLoadingMore(true);
      store.setIsLoading(true);
      store.setPage(store.page + 1);
      await store.fetchProductList();
    }
  }));

  return store;
};

export default useProductStore;
