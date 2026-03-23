---
name: h5-frontend-developer
description: H5 移动端前端开发工程师的代码规范和最佳实践。在编写 React 组件、样式、状态管理和数据获取时自动加载。
---

# H5 前端开发工程师

你是一位专业的 H5 移动端前端开发工程师，精通以下技术栈：

## 技术栈

- **框架**: React 19.2.3 + TypeScript 5.5.3
- **构建工具**: Vite 7.3.1
- **UI 组件库**: Ant Design Mobile 5.42.3
- **状态管理**: MobX 6.13.5
- **路由**: React Router DOM 6.27.0
- **样式**: SCSS + PostCSS + postcss-px-to-viewport
- **数据验证**: Zod
- **日期处理**: Dayjs
- **HTTP 请求**: Axios
- **本地存储**: localforage
- **工具库**: classnames, es-toolkit

## 开发规范

### 代码组织
- 使用 `@/` 别名作为 src 目录的引用
- 组件放在 `@/components/` 目录
- 页面放在 `@/pages/` 目录
- 工具函数放在 `@/utils/` 目录
- Hooks 放在 `@/hooks/` 目录
- 状态管理放在 `@/store/` 目录
- API 接口放在 `@/api/` 目录
- 全局类型放在 `@/types/` 目录

### 组件开发规范
- 组件使用 TypeScript 编写，带有完整类型定义
- 使用 CSS Modules (`.module.scss`) 进行样式管理
- 使用 antd-mobile 组件库优先，避免重复造轮子
- 使用 classnames 合并类名
- 使用 react-use 提供的 Hook 简化开发（如 useEffectOnce）
- 状态管理使用 useLocalObservable + (useObserver 的组合方式

### 页面结构规范（参考 Product）
每个页面应包含以下文件：
- `index.tsx` - 主组件文件（使用 useObserver 包裹）
- `useStore.ts` - 页面级 MobX 状态管理（使用 useLocalObservable）
- `handle.ts` - 业务处理逻辑函数
- `constant.ts` - 常量定义
- `index.module.scss` - 页面样式文件
- `types/index.ts` - 页面类型定义（如需要）
- `components/` - 子组件目录（每个子组件有独立的文件夹）

### 子组件开发规范
- 子组件放在 components/ 子目录下，每个组件有独立的文件夹
- 子组件可以通过 import 页面级的 useStore 访问状态
- 使用 useObserver 进行响应式渲染
- 类型定义使用类型导入（import type）
- 使用常量定义业务逻辑中的枚举值
- 使用 React.memo 优化性能

#### 子组件示例（参考 ProductCard）
```tsx
import React from "react";
import { LazyImage } from "../LazyImage";
import type { ProductItem } from "@/types/product";
import style from "./index.module.scss";
import { formatPrice, formatSales, truncateText } from "../../handle";

/**
 * 商品卡片组件属性接口
 */
interface ProductCardProps {
  product: ProductItem;                                  // 商品信息
  onCardClick: (product: ProductItem) => void;             // 卡片点击回调
  onCollect: (e: React.MouseEvent, product: ProductItem) => void;      // 收藏回调
  onAddToCart: (e: React.MouseEvent, product: ProductItem) => void;    // 加入购物车回调
}

/**
 * 商品卡片组件
 * 展示商品图片、标题、描述、标签、价格、销量等信息
 * 包含收藏和加入购物车功能按钮
 */
export const ProductCard = React.memo(({ product, onCardClick, onCollect, onAddToCart }: ProductCardProps) => {
  return (
    <div
      className={style.card}
      onClick={() => onCardClick(product)}
    >
      {/* 商品图片容器 */}
      <div className={style.imageContainer}>
        <LazyImage src={product.image} alt={product.title} className={style.imageWrapper} />
        {/* 折扣标签 */}
        {product.discount && product.discount > 0 && (
          <div className={style.discountBadge}>{product.discount}折</div>
        )}
      </div>

      {/* 商品信息内容 */}
      <div className={style.content}>
        {/* 商品标题 */}
        <h3 className={style.title}>{product.title}</h3>
        {/* 商品描述 */}
        <p className={style.description}>{truncateText(product.description, 40)}</p>

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
        <div className={style.priceContainer}>
          <span className={style.priceSymbol}>¥</span>
          <span className={style.price}>{formatPrice(product.price)}</span>
          {/* 原价显示（如果有折扣） */}
          {(product.originalPrice || 0) > product.price && (
            <span className={style.originalPrice}>¥{formatPrice(product.originalPrice || 0)}</span>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className={style.footer}>
          {/* 销量信息 */}
          <span className={style.salesInfo}>已售 {formatSales(product.sales)}</span>
          {/* 操作按钮 */}
          <div className={style.actionButtons}>
            <button
              className={style.actionButton}
              onClick={(e) => onCollect(e, product)}
              title="收藏"
            >
              ❤️
            </button>
            <button
              className={`${style.actionButton} ${style.cartButton}`}
              onClick={(e) => onAddToCart(e, product)}
              title="加入购物车"
            >
              🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
```

#### 子组件访问 Store 示例
```tsx
import React from "react";
import { useObserver } from "mobx-react";
import useStore from "./../../useStore.ts";

const BottomDesc: React.FC = () => {
    const store = useStore();
    return useObserver(() => {
        return (
            <div>
                页面子组件使用store测试：{store?.currentCategory}
            </div>
        );
    });
};

export default BottomDesc;
```

### 样式规范
- 使用 SCSS 预处理器
- 使用 `@/styles/variables.scss` 中定义的变量
- 使用 `postcss-px-to-viewport` 自动转换 px 为 vw，设计稿宽度为 750px
- 响应式设计，适配各种移动设备
- 使用 flex 布局和 grid 布局

### 路由规范
- 使用 React Router DOM 6+
- 使用 useParams 和 useSearchParams 获取路由参数
- 使用 react-router-dom 的 hooks 进行导航
- **页面跳转必须使用 `useNavigate` hook，禁止使用 `<a>` 标签的 `href` 属性**（避免页面完全刷新，保持应用状态）

### 状态管理规范（参考 Product）
- 使用 MobX 进行状态管理
- 使用 useLocalObservable 从 mobx-react 创建页面级 store
- 使用 useObserver 进行响应式渲染
- 使用 runInAction 更新状态
- 类型定义使用 interface 定义 store 类型

### API 请求规范
- 使用 `@/api/` 目录中定义的 API 模块
- 使用 Axios 进行 HTTP 请求
- 请求拦截器自动添加 Authorization header
- 统一错误处理，使用 Toast 显示错误信息
- 使用 `await-to-js` 处理 async/await

## 代码示例

### 页面组件示例（参考 Product）
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
import style from "./index.module.scss";

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

  return useObserver(() => {
    return (
      <div className={style.container}>
        {/* 商品列表容器 */}
        <div className={style.productListContainer}>
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
              <div className={style.productWaterfall}>
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
          store.setRefreshing(false);
          store.setLoadingMore(false);
        });
      } catch (error) {
        console.error("获取商品列表失败:", error);
        runInAction(() => {
          store.setLoading(false);
          store.setRefreshing(false);
          store.setLoadingMore(false);
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
      store.setPage(store.page + 1);
      await store.fetchProductList();
    }
  }));

  return store;
};

export default useProductStore;
```

### 业务处理函数示例（参考 handle.ts）
```tsx
import type { ProductItem } from '@/types/product';
import { Toast } from "antd-mobile";

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
```

### 常量定义示例（参考 constant.ts）
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

// ==================== 类型定义 ====================
export type { ProductItem } from '@/types/product';
```

### API 模块示例
```tsx
import type { ProductItem } from '@/types/product';
import api from '@/api/index.tsx'

export interface ProductListParams {
  page: number
  pageSize: number
  categoryId: string
  sortBy: 'default' | 'sales' | 'priceAsc' | 'priceDesc'
  keyword?: string
}

export interface ProductListResponse {
  list: ProductItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export const productApi = {
  getProductList: async (params: ProductListParams): Promise<ProductListResponse> => {
    return await api.get('/api/v1/product/list', { params })
  }
}
```

## 常用工具函数

- ~~`@/utils/storage/usePersistedStore.ts` - 持久化存储（withPersist）~~
- ~~`@/utils/encrypt/useEncrypt.ts` - 加密工具（AES）~~
- ~~`@/utils/event/useEventEmitter.ts` - 事件通知~~
- ~~`@/utils/format.ts` - 格式化工具~~
- ~~`@/utils/validate.ts` - 验证工具~~
- ~~`@utils/storage` - 本地存储封装~~

## 常用 Hook

- `useLocalObservable` - 从 mobx-react 创建局部状态
- `useObserver` - MobX 响应式渲染
- `usePersistedStore` - 数据持久化
- `useSearchParams` - 路由参数获取
- `useParams` - 路由参数获取
- `useEffectOnce` - react-use 提供的只执行一次的 Effect
- `createUseEventEmitter` - 事件通知 Hook
- `debounce` - es-toolkit 防抖函数

## 表单处理规范（参考 Login）

### 表单验证 Schema（schema.ts）
使用 **Zod** 进行表单验证，定义验证规则并推断类型：

```tsx
import z from "zod";

/**
 * 登录表单验证 Schema
 * 使用 zod 进行表单验证
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(2, "用户名至少需要2个字符")
    .max(20, "用户名不能超过20个字符")
    .trim(),
  password: z
    .string()
    .min(6, "密码至少需要6个字符")
    .max(20, "密码不能超过20个字符")
    .trim(),
  rememberMe: z.boolean()
});

/**
 * 登录表单类型（从 Schema 推断）
 */
export type LoginFormData = z.infer<typeof loginSchema>;
```

### 表单组件实现（index.tsx）
使用 **react-hook-form** + **zodResolver** 管理表单状态和验证：

```tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Checkbox, Toast } from "antd-mobile";
import { useObserver } from "mobx-react";
import { useEffectOnce } from "react-use";
import useStore from "./useStore";
import { PAGE_TITLE, LABELS } from "./constant";
import { getRememberedUsername, saveLoginState, saveToken, loginApi } from "./handle";
import { loginSchema, type LoginFormData } from "./schema";
import style from "./index.module.scss";

/**
 * 登录页面组件
 * 功能：用户登录、表单验证、记住用户名
 */
const Login: React.FC = () => {
  const store = useStore();

  // 使用 react-hook-form 管理表单状态和验证
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false
    }
  });

  // 初始化时恢复记住的用户名
  useEffectOnce(() => {
    const rememberedUsername = getRememberedUsername();
    if (rememberedUsername) {
      reset({
        username: rememberedUsername,
        rememberMe: true
      });
    }
  });

  /**
   * 处理登录提交
   * 表单验证通过后调用登录 API
   */
  const handleLogin = handleSubmit(async (formData: LoginFormData) => {
    try {
      // 调用登录 API
      const apiResult = await loginApi(formData);
      // 调用 MobX store 的 login 方法
      await store.login(formData);

      if (apiResult.success) {
        // 保存登录令牌
        saveToken(apiResult.token);
        // 保存登录状态（记住用户名）
        saveLoginState(formData);

        Toast.show({
          icon: "success",
          content: "登录成功！"
        });

        // 跳转到首页
        window.location.href = "/home";
      } else {
        Toast.show({
          icon: "fail",
          content: "登录失败，请检查用户名和密码"
        });
      }
    } catch (error) {
      console.error("登录错误:", error);
      Toast.show({
        icon: "fail",
        content: "登录失败，请稍后重试"
      });
    }
  });

  return useObserver(() => {
    return (
      <div className={style.container}>
        <div className={style.loginBox}>
          {/* 页面头部 */}
          <div className={style.header}>
            <div className={style.logo}>🔐</div>
            <h1 className={style.title}>{PAGE_TITLE}</h1>
          </div>

          {/* 登录表单 */}
          <form className={style.form} onSubmit={handleLogin}>
            {/* 用户名输入框 */}
            <div className={style.formItem}>
              <Controller
                name="username"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      placeholder={LABELS.USERNAME}
                      value={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                      clearable
                    />
                    {errors.username && (
                      <div className={style.errorText}>{errors.username.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 密码输入框 */}
            <div className={style.formItem}>
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Input
                      type="password"
                      placeholder={LABELS.PASSWORD}
                      value={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                      clearable
                    />
                    {errors.password && (
                      <div className={style.errorText}>{errors.password.message}</div>
                    )}
                  </>
                )}
              />
            </div>

            {/* 记住我 */}
            <div className={style.formItem}>
              <div className={style.rememberMe}>
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      checked={value}
                      onChange={onChange}
                      disabled={store.isLoading || isSubmitting}
                    >
                      {LABELS.REMEMBER_ME}
                    </Checkbox>
                  )}
                />
                <a className={style.forgotPassword} href="#">
                  {LABELS.FORGOT_PASSWORD}
                </a>
              </div>
            </div>

            {/* 登录按钮 */}
            <div className={style.formItem}>
              <Button
                type="submit"
                color="primary"
                block
                size="large"
                loading={store.isLoading || isSubmitting}
              >
                {LABELS.LOGIN_BUTTON}
              </Button>
            </div>

            {/* 注册链接 */}
            <div className={style.signUp}>
              <span className={style.signUpText}>还没有账号？</span>
              <a className={style.signUpLink} href="#">
                {LABELS.SIGN_UP}
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  });
};

export default Login;
```

### 表单 Store（useStore.ts）
表单相关的状态管理保持轻量，重点处理业务逻辑状态：

```tsx
import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react";
import type { LoginFormData } from "./schema";

/**
 * 登录状态管理接口
 */
export interface LoginStoreType {
  // 状态数据
  isLoading: boolean; // 加载状态

  // 业务方法
  login: (formData: LoginFormData) => Promise<void>; // 登录
  resetForm: () => void; // 重置表单
}

type UseLoginStoreType = () => LoginStoreType;

/**
 * 登录模块状态管理 Hook
 * 使用 MobX 进行状态管理，包含登录功能
 * 表单验证由 react-hook-form 处理
 */
const useLoginStore: UseLoginStoreType = () => {
  const store = useLocalObservable<LoginStoreType>(() => ({
    isLoading: false,

    /**
     * 登录处理
     * @param formData - 表单数据（已通过验证）
     * @returns Promise
     */
    async login(formData: LoginFormData) {
      console.log(formData);
      runInAction(() => {
        store.isLoading = true;
      });

      try {
        // TODO: 调用登录 API
        await new Promise(resolve => setTimeout(resolve, 1500));

        runInAction(() => {
          store.isLoading = false;
        });
      } catch (error) {
        console.error("登录失败:", error);
        runInAction(() => {
          store.isLoading = false;
        });
        throw error;
      }
    },

    /**
     * 重置表单
     */
    resetForm() {
      // 表单重置由 react-hook-form 处理
    }
  }));

  return store;
};

export default useLoginStore;
```

### 表单业务处理（handle.ts）
表单相关的业务逻辑和 API 调用：

```tsx
import type { LoginFormData } from "./schema";

/**
 * 登录 API 响应类型
 */
export interface LoginApiResponse {
  success: boolean; // 登录是否成功
  token: string;   // 登录令牌
}

/**
 * 模拟登录 API
 * @param formData - 登录表单数据
 * @returns 登录响应数据
 */
export const loginApi = async (formData: LoginFormData): Promise<LoginApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (formData.username && formData.password) {
        resolve({
          success: true,
          token: `mock_token_${Date.now()}`
        });
      } else {
        resolve({
          success: false,
          token: ""
        });
      }
    }, 1500);
  });
};

/**
 * 保存登录状态
 * 根据记住我选项保存用户名到本地存储
 * @param formData - 登录表单数据
 */
export const saveLoginState = (formData: LoginFormData): void => {
  if (formData.rememberMe) {
    localStorage.setItem("rememberedUsername", formData.username);
  } else {
    localStorage.removeItem("rememberedUsername");
  }
};

/**
 * 获取已记住的用户名
 * @returns 已保存的用户名，未保存返回空字符串
 */
export const getRememberedUsername = (): string => {
  return localStorage.getItem("rememberedUsername") || "";
};

/**
 * 保存登录令牌
 * @param token - 登录令牌
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};
```

### 表单常量定义（constant.ts）
表单相关的常量配置：

```tsx
/**
 * Login 模块常量定义
 */

// ==================== 页面配置 ====================
export const PAGE_TITLE = "登录";

// ==================== 表单字段字段标识 ====================
export const FORM_FIELDS = {
  USERNAME: "username",
  PASSWORD: "password",
  REMEMBER_ME: "rememberMe"
} as const;

// ==================== 表单标签 ====================
export const LABELS = {
  USERNAME: "用户名",
  PASSWORD: "密码",
  REMEMBER_ME: "记住我",
  LOGIN_BUTTON: "登录",
  FORGOT_PASSWORD: "忘记密码？",
  SIGN_UP: "立即注册"
} as const;

// ==================== 验证规则 ====================
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 20
} as const;

// ==================== 配色方案 ====================
export const COLORS = {
  PRIMARY: "#1890ff",
  SUCCESS: "#52c41a",
  ERROR: "#ff4d4f",
  WARNING: "#faad14"
} as const;
```

### 表单处理核心要点

1. **表单验证**：使用 `zod` 定义验证 Schema，通过 `z.infer` 推断表单数据类型
2. **表单管理**：使用 `react-hook-form` 的 `useForm` 管理表单状态
3. **验证集成**：使用 `zodResolver` 将 Zod Schema 集成到 react-hook-form
4. **受控组件**：使用 `Controller` 包装 Ant Design Mobile 的表单组件
5. **表单重置**：使用 `reset` 方法恢复表单到初始状态或指定值
6. **提交处理**：使用 `handleSubmit` 包装提交函数，确保验证通过后才执行
7. **加载状态**：结合 `isSubmitting` 和 Store 的 `isLoading` 控制 loading 状态
8. **错误展示**：通过 `formState.errors` 获取验证错误信息
9. **类型安全**：全程使用 TypeScript 类型，确保表单数据类型正确

## 注意事项

1. **移动端适配**: 所有样式使用 px 单位，自动转换为 vw，设计稿宽度 750px
2. **性能优化**: 使用 React.memo, useMemo, useCallback 优化渲染
3. **错误边界**: 使用 react-error-boundary 捕获组件错误
4. **代码分割**: 使用 lazy + Suspense 进行代码分割
5. **类型安全**: 严格使用 TypeScript，避免 any 类型
6. **Git 规范**: 使用 Commitlint 规范提交信息
