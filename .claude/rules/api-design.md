---
# 限制此规范仅适用于 src/api 目录下的文件
pattern: ./src/api/**/*
---

# API 设计规范

## 概述

本文档定义了项目中 API 接口的设计、组织和调用规范，旨在通过统一的标准确保代码的可读性、可维护性以及全链路的类型安全。

---

## 目录结构

### API 文件组织

所有 API 接口定义在 `src/api/` 目录下，采用**按业务领域（Domain-driven）**的分组方式：

```
src/api/
├── CLAUDE.md           # API 开发规范（项目内文档）
├── index.ts            # 统一入口，导出所有业务模块 API
├── index.tsx           # axios 实例配置与导出
├── types.ts            # 全局通用 API 相关类型定义
├── axios-instance.ts   # 核心拦截器、基础配置与请求实例
├── request-cache.ts    # 基于 Map 的轻量级请求缓存工具
├── cancel-manager.ts   # 请求控制器，用于取消重复或未完成的请求
├── api-utils.ts        # 常用工具函数（如：URL 参数拼接、签名计算等）
└── [module]/           # 业务模块目录
    ├── index.ts        # 模块 API 定义与导出
    └── schemas.ts      # (可选) 业务相关的 Zod 校验 Schema
```

**核心规则：**
- **严禁跨模块混用**: `[module]/index.ts` 只应包含该业务领域的接口。
- **单一导出点**: 所有 API 必须通过 `src/api/index.ts` 统一对外提供，以便于在组件中通过 `api.xxx.method` 的方式调用。

---

## 架构设计

### 分层职责

1. **配置层 (`axios-instance.ts`)**: 
   - 封装 Axios 实例，配置 `baseURL`、`timeout`。
   - **请求拦截器**: 动态注入 `Authorization`、`timestamp`、`deviceId` 等公共头。
   - **响应拦截器**: 
     - 状态码预处理（如 401 自动重定向）。
     - 统一解包（直接返回 `data` 内容或抛出异常）。
     - 错误自动重试机制。

2. **类型层 (`types.ts`)**: 
   - 定义标准的后端返回结构 `ApiResponse<T>`。
   - 扩展 Axios 的请求配置项（如 `cache`、`skipErrorToast`）。

3. **业务层 (`[module]/index.ts`)**: 
   - 编写具体的请求函数。
   - **类型约束**: 必须显式声明请求参数接口（`Params`）和响应数据接口（`Response`）。

---

## 核心功能特性

### ✅ 自动化特性
- [x] **智能 Token 注入**: 拦截器自动从 Storage 获取并刷新 Token。
- [x] **全局异常捕获**: 拦截器内置 `Toast` 提示，支持静默模式。
- [x] **幂等性保障**: 自动取消重复的并发请求（`cancel-manager`）。
- [x] **缓存加速**: 支持 GET 请求的客户端缓存，减少冗余网络开销。
- [x] **失败自愈**: 对超时等网络抖动错误进行自动重试。

### 📊 错误码规范
后端返回的 `code` 应遵循以下语义：
- `200 / 0`: 操作成功。
- `401`: 认证失效，触发自动退出。
- `403`: 权限不足。
- `500`: 服务器内部异常。
- `BUSINESS_ERROR`: 业务逻辑错误（由 UI 提示）。

---

## 开发规范

### 1. 类型安全 (Type Safety)

必须为每个 API 定义完整的 TypeScript 类型。对于核心业务数据，建议配合 **Zod** 进行运行时校验。

```typescript
import { api } from '@/api/index.tsx'
import { z } from 'zod'

// 1. 定义 Schema (可选但推荐，用于防御性编程)
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
})

// 2. 定义类型
export interface ProductListParams {
  page: number
  pageSize: number
  categoryId: string
}

export type ProductListResponse = PaginatedListResponse<z.infer<typeof ProductSchema>>

// 3. 实现接口
export const productApi = {
  getList: async (params: ProductListParams): Promise<ProductListResponse> => {
    return await api.get('/api/v1/product/list', { params })
  }
}
```

### 2. 命名契约 (Naming Convention)

| 动词 | 场景 | 示例 |
| :--- | :--- | :--- |
| `get` | 获取单条数据/详情 | `getProductDetail` |
| `list` | 获取列表数据 | `listProducts` |
| `create` | 新增资源 | `createOrder` |
| `update` | 更新资源 (全量/增量) | `updateUserProfile` |
| `delete` | 删除资源 | `deleteComment` |
| `submit` | 提交表单/流转状态 | `submitAudit` |

### 3. 请求配置最佳实践

#### 启用缓存
适用于分类列表、配置信息等非实时变动数据。
```typescript
api.get('/api/config', { cache: true, cacheTime: 5 * 60 * 1000 })
```

#### 错误处理自定义
默认开启 Toast 提示。若需手动处理错误（如表单校验），需关闭全局提示。
```typescript
try {
  await api.post('/login', data, { skipErrorToast: true })
} catch (error) {
  // 手动在 UI 上展示错误
}
```

---

## 检查清单 (Checklist)

在提交 API 相关代码前，请确认：
- [ ] **路径规范**: 是否使用了别名 `@/api`？
- [ ] **解耦性**: 是否按业务模块正确拆分目录？
- [ ] **健壮性**: 响应类型是否包含所有必填字段？
- [ ] **导出**: 是否已在 `src/api/index.ts` 中完成导出以便全局调用？
- [ ] **清理**: 是否移除了调试用的 `console.log`？

---

## 最佳实践建议

1. **先设计后编码**: 先与后端约定 JSON 结构，并在此文档对应的模块中定义接口类型。
2. **复用类型**: 基础的业务实体（如 `User`, `Order`）应在 `src/types/` 中定义，API 模块仅引用。
3. **防御性编程**: 对后端返回的不确定性数据（如 `null` 或 `undefined`），在 Response 类型中明确标注并做好降级处理。
