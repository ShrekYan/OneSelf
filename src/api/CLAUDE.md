# API 模块开发规范

## 目录结构

```
src/api/
├── CLAUDE.md           # 本文件，API 开发规范
├── index.ts             # 统一导出所有 API 模块
├── core/                # Axios 扩展核心功能
│   ├── api-utils.ts     # API 工具函数
│   ├── axios-instance.ts# Axios 实例配置
│   ├── cancel-manager.ts# 请求取消管理器
│   ├── request-cache.ts # 请求缓存工具
│   └── types.ts         # API 通用类型定义
└── [模块]/
    └── index.ts         # 按业务模块划分，每个模块一个目录
```

## 架构设计

### 层级结构

1. **`axios-instance.ts`**: 创建 axios 实例，配置拦截器，处理：
   - 统一错误处理
   - 自动添加 token
   - 请求缓存
   - 防重复请求
   - 重试逻辑
   - 开发环境日志

2. **`types.ts`**: 定义通用基础类型：
   - `ApiResponse<T>` - API 响应包装类型
   - `RequestConfig` - 扩展的请求配置
   - `ErrorType` - 错误类型枚举
   - `ApiError` - 自定义错误类

3. **`[module]/index.ts`**: 按业务模块定义具体 API：
   - 定义接口参数类型
   - 定义响应数据类型
   - 导出 API 方法对象

4. **`index.ts`**: 统一导出所有 API 模块供全局使用

## 开发规范

### 1. 模块组织

- **按业务模块拆分**: 每个业务模块一个目录，如 `product/`、`user/`、`order/`
- **每个模块一个文件**: 模块入口为 `[module]/index.ts`
- **统一导出**: 在 `src/api/index.ts` 中导出所有模块

### 2. 类型定义

必须为每个 API 定义完整的 TypeScript 类型：

```typescript
// ✅ 正确：为参数和响应都定义接口
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
- **返回值 Promise**: 必须指定 Promise 的泛型类型
- **复用已有类型**: 对于实体类型，从 `@/types` 导入，不要重复定义

### 3. API 方法命名规范

```typescript
// ✅ 推荐：动词开头，清晰表达用途
getXXX - 获取数据
listXXX - 获取列表
createXXX - 创建数据
updateXXX - 更新数据
deleteXXX - 删除数据
uploadXXX - 上传文件
```

### 4. 路径规则

- API 路径以 `/api/` 开头，版本号如 `/api/v1/xxx`
- 使用方法：`api.get(url, { params })` 对应 GET 请求
- 使用方法：`api.post(url, data)` 对应 POST 请求

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
- **禁止**: `import { api } from '../index.tsx'`
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

### 8. 在 src/api/index.ts 中导出

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

## 已有功能特性

### ✅ 已实现

- [x] 自动 token 注入
- [x] 统一错误处理 + Toast 提示
- [x] 401 未授权自动清除 token
- [x] 请求缓存 (GET)
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

## 使用示例

### 组件中使用

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
    // 这里只需要处理页面状态
  }
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

## 检查清单

新增 API 后请检查：

- [ ] 是否按业务模块放在正确目录？
- [ ] 是否为参数和响应定义了完整的 TypeScript 接口？
- [ ] 是否在 `src/api/index.ts` 中导出了新模块？
- [ ] 是否使用了路径别名 `@/` 导入？
- [ ] 是否根据需要配置了 `cache`、`skipErrorToast`、`skipAuth`？
- [ ] 方法返回值 Promise 是否指定了正确的泛型类型？
- [ ] 是否遵循了现有的命名规范？

