# API 设计规范

## 概述

本文档定义了项目中 API 接口的设计、组织和调用规范，确保代码一致性、可维护性和类型安全。

---

## 目录结构

### API 文件组织

所有 API 接口定义在 `src/api/` 目录下，按业务模块分组：

```
src/api/
├── CLAUDE.md           # API 开发规范（项目内文档）
├── index.ts            # 统一导出所有 API 模块
├── index.tsx           # axios 实例导出
├── types.ts            # 通用基础类型定义
├── axios-instance.ts   # axios 实例创建和拦截器配置
├── request-cache.ts    # 请求缓存工具
├── cancel-manager.ts   # 重复请求取消管理器
├── api-utils.ts        # API 工具函数
└── [module]/
    └── index.ts         # 按业务模块划分，每个模块一个目录
```

**规则：**
- 按业务模块拆分，每个业务模块一个目录，如 `product/`、`user/`、`order/`
- 每个模块入口为 `[module]/index.ts`
- 所有 API 模块在 `src/api/index.ts` 中统一导出

---

## 架构设计

### 层级结构

1. **`axios-instance.ts`**: 创建 axios 实例，配置拦截器，已内置：
   - 统一错误处理 + Toast 提示
   - 自动添加 token 到请求头
   - GET 请求缓存支持
   - 防重复请求自动取消
   - 失败自动重试
   - 开发环境请求/响应日志

2. **`types.ts`**: 定义通用基础类型：
   - `ApiResponse<T>` - API 响应包装类型
   - `RequestConfig` - 扩展的请求配置（支持缓存、重试等）
   - `ErrorType` - 错误类型枚举
   - `ApiError` - 自定义错误类

3. **`[module]/index.ts`**: 按业务模块定义具体 API：
   - 定义接口参数类型
   - 定义响应数据类型
   - 导出 API 方法对象 `xxxApi`

4. **`index.ts`**: 统一导出所有 API 模块供全局使用

---

## 已有功能特性

### ✅ 内置特性

- [x] 自动 token 注入
- [x] 统一错误处理 + Toast 提示
- [x] 401 未授权自动清除 token
- [x] GET 请求缓存
- [x] 防重复请求自动取消
- [x] 失败自动重试
- [x] 开发环境请求/响应日志
- [x] TypeScript 完整类型支持

### 📊 错误类型

- `NETWORK` - 网络错误
- `TIMEOUT` - 请求超时
- `ABORT` - 请求被取消
- `SERVER` - 服务器错误
- `BUSINESS` - 业务错误
- `UNAUTHORIZED` - 未授权
- `FORBIDDEN` - 禁止访问
- `NOT_FOUND` - 资源不存在

---

## 开发规范

### 1. 模块组织

- **按业务模块拆分**: 每个业务模块一个目录，如 `product/`、`user/`、`order/`
- **每个模块一个入口**: 模块入口为 `[module]/index.ts`
- **统一导出**: 在 `src/api/index.ts` 中导出所有模块

### 2. 类型定义

必须为每个 API 定义完整的 TypeScript 类型：

```typescript
// ✅ 正确：为参数和响应都定义接口
import type { ProductItem } from '@/types/product'
import { api } from '@/api/index.tsx'

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

- **参数类型**: 定义 `interface XXXParams`
- **响应类型**: 定义 `interface XXXResponse`
- **返回值**: 必须指定 `Promise<XXXResponse>` 泛型类型
- **复用已有类型**: 对于实体类型，从 `@/types` 导入，不要重复定义

### 3. API 方法命名规范

| 操作 | 命名格式 | 示例 |
|------|----------|------|
| 获取列表 | `listXXX` 或 `getXXXList` | `getProductList` |
| 获取详情 | `getXXXDetail` 或 `getXXX` | `getProductDetail` |
| 创建 | `createXXX` | `createProduct` |
| 更新 | `updateXXX` | `updateProduct` |
| 删除 | `deleteXXX` | `deleteProduct` |
| 上传 | `uploadXXX` | `uploadImage` |
| 特殊操作 | 直接语义化命名 | `login`, `logout`, `checkPhone` |

### 4. 路径规则

- API 路径以 `/api/` 开头，包含版本号如 `/api/v1/xxx`
- GET 请求: `api.get(url, { params })`
- POST 请求: `api.post(url, data)`
- PUT 请求: `api.put(url, data)`
- DELETE 请求: `api.delete(url)`

### 5. 特殊配置

#### 请求缓存

对于不常变化的 GET 请求，可以启用缓存：

```typescript
getProductList: async (params: ProductListParams): Promise<ProductListResponse> => {
  return await api.get('/api/v1/product/list', {
    params,
    cache: true,         // 启用缓存
    cacheTime: 60000,    // 缓存时间(ms)，默认 60000
  })
}
```

#### 跳过错误提示

某些场景下不需要自动弹出错误提示：

```typescript
checkPhone: async (params: CheckPhoneParams): Promise<CheckPhoneResponse> => {
  return await api.post('/api/v1/user/check-phone', params, {
    skipErrorToast: true,  // 不显示错误 toast
  })
}
```

#### 跳过认证

登录等接口不需要添加 token：

```typescript
login: async (params: LoginParams): Promise<LoginResponse> => {
  return await api.post('/api/v1/auth/login', params, {
    skipAuth: true,  // 不添加 Authorization header
  })
}
```

#### 请求重试

对于不稳定的接口，可以配置重试：

```typescript
uploadFile: async (data: FormData): Promise<UploadResponse> => {
  return await api.post('/api/v1/upload', data, {
    retry: 2,           // 重试次数
    retryDelay: 1000,   // 重试延迟(ms)
  })
}
```

### 6. 导入规则

- **必须使用路径别名**: `import { api } from '@/api/index.tsx'`
- **禁止使用过长相对路径**: `import { api } from '../index.tsx'`
- 类型从 `@/types` 导入：`import type { ProductItem } from '@/types/product'`

### 7. 代码模板

新增 API 模块的标准模板：

```typescript
import type { XXX } from '@/types/xxx'
import { api } from '@/api/index.tsx'

// 接口参数
export interface XXXListParams {
  page: number
  pageSize: number
  keyword?: string
}

// 响应数据
export interface XXXListResponse {
  list: XXX[]
  total: number
  page: number
  hasMore: boolean
}

export interface XXXDetailResponse {
  id: string
  name: string
  // ...
}

export const xxxApi = {
  getList: async (params: XXXListParams): Promise<XXXListResponse> => {
    return await api.get('/api/v1/xxx/list', { params })
  },

  getDetail: async (id: string): Promise<XXXDetailResponse> => {
    return await api.get(`/api/v1/xxx/${id}`)
  },

  create: async (data: CreateXXXData): Promise<XXXDetailResponse> => {
    return await api.post('/api/v1/xxx/create', data)
  },

  update: async (id: string, data: UpdateXXXData): Promise<void> => {
    return await api.put(`/api/v1/xxx/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    return await api.delete(`/api/v1/xxx/${id}`)
  },
}
```

### 8. 在 `src/api/index.ts` 中导出

新增模块后，必须在 `src/api/index.ts` 中导出：

```typescript
import { api } from './index.tsx'
import { productApi } from './product'
import { xxxApi } from './xxx'  // 新增

export { api, productApi, xxxApi }

export default {
  product: productApi,
  xxx: xxxApi,  // 新增
}
```

---

## 类型定义规范

### 基础响应结构

项目已定义统一的 API 响应类型：

```typescript
// src/api/types.ts
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  timestamp?: number
}

export interface RequestConfig extends AxiosRequestConfig {
  retry?: number           // 重试次数
  retryDelay?: number      // 重试延迟(ms)
  skipErrorToast?: boolean // 跳过错误提示
  skipAuth?: boolean       // 跳过认证
  cache?: boolean          // 是否缓存
  cacheTime?: number       // 缓存时间(ms)
}
```

### 分页响应规范

```typescript
export interface PaginatedListResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
```

---

## 错误处理

### 统一处理

错误在拦截器中已经统一处理：

- 业务错误（`code !== 200 && code !== 0`）：自动显示 Toast 提示
- 网络错误：自动显示 Toast 提示
- 401 未授权：自动清除 token
- 可配置 `skipErrorToast` 跳过自动提示

### 组件层面处理

```typescript
import api from '@/api'

const getList = async () => {
  try {
    const res = await api.product.getProductList({
      page: 1,
      pageSize: 10,
      categoryId: '1',
      sortBy: 'sales',
    })
    console.log(res.list)
  } catch (error) {
    // 错误已经被拦截器处理并显示 Toast
    // 这里只需要处理页面状态，不需要重复提示
  }
}
```

---

## 使用示例

### 在组件中使用

```typescript
import api from '@/api'

const ProductList = () => {
  const [list, setList] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchList = async () => {
    setLoading(true)
    try {
      const res = await api.product.getProductList({
        page: 1,
        pageSize: 10,
        categoryId: '1',
        sortBy: 'sales',
      })
      setList(res.list)
    } finally {
      setLoading(false)
    }
  }

  // ...
}
```

### 配合 MobX Store 使用

```typescript
import { makeAutoObservable } from 'mobx'
import api from '@/api'
import type { ProductItem } from '@/types/product'

class ProductStore {
  loading: boolean = false
  products: ProductItem[] = []

  constructor() {
    makeAutoObservable(this)
  }

  fetchList = async (categoryId: string) => {
    this.loading = true
    try {
      const res = await api.product.getProductList({
        page: 1,
        pageSize: 10,
        categoryId,
        sortBy: 'default',
      })
      this.products = res.list
    } finally {
      this.loading = false
    }
  }
}

export default new ProductStore()
```

---

## 检查清单

新增 API 后请检查：

- [ ] 是否按业务模块放在正确目录？
- [ ] 是否为参数和响应定义了完整的 TypeScript 接口？
- [ ] 是否在 `src/api/index.ts` 中导出了新模块？
- [ ] 是否使用了路径别名 `@/` 导入？
- [ ] 是否根据需要配置了 `cache`、`skipErrorToast`、`skipAuth`、`retry`？
- [ ] 方法返回值 `Promise` 是否指定了正确的泛型类型？
- [ ] 是否遵循了现有的命名规范？
- [ ] 是否复用了 `@/types` 中已定义的实体类型？

---

## 最佳实践

1. **提前定义类型**：先定义类型再实现函数
2. **保持简洁**：一个模块只放相关业务的 API
3. **不要缓存过度**：只对不常变化的 GET 请求启用缓存
4. **合理跳过提示**：表单验证等接口使用 `skipErrorToast`
5. **认证跳过**：登录注册等接口使用 `skipAuth`
6. **注释充分**：复杂接口要说明参数含义和业务背景
