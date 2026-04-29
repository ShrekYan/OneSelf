---
# 限制此规范仅适用于 apps/web/src/api 目录下的文件
pattern: ./apps/web/src/api/**/*
---

# API 设计规范

## 概述

本文档定义了项目中 API 接口的设计、组织和调用规范，旨在通过统一的标准确保代码的可读性、可维护性以及全链路的类型安全。

---

## 目录结构

### API 文件组织

所有 API 接口定义在 `apps/web/src/api/` 目录下，采用**按业务领域（Domain-driven）**的分组方式：

```
apps/web/src/api/
├── index.ts              # 统一入口，聚合 axios 实例与所有业务模块 API
├── core/                 # 核心工具层
│   ├── axios-instance.ts # Axios 实例配置、拦截器、缓存、取消管理
│   ├── types.ts          # 全局通用 API 相关类型定义
│   ├── request-cache.ts  # 基于 Map 的轻量级请求缓存工具
│   ├── cancel-manager.ts # 请求控制器，用于取消重复或未完成的请求
│   └── api-utils.ts      # 常用工具函数（如：URL 参数拼接等）
└── [module]/             # 业务模块目录（product / user / article / category / auth 等）
    └── index.ts          # 模块 API 定义与导出
```

**核心规则：**
- **严禁跨模块混用**: `[module]/index.ts` 只应包含该业务领域的接口。
- **单一导出点**: 所有 API 通过 `apps/web/src/api/index.ts` 统一对外提供，支持两种调用方式：
  1. `import api from '@/api'; api.get(...)` - 直接调用 axios 实例
  2. `import api from '@/api'; api.product.getProductList(...)` - 调用业务模块 API

---

## 架构设计

### 分层职责

1. **核心层 (`core/`)**:
   - `axios-instance.ts`: 封装 Axios 实例，配置 `baseURL`、`timeout`
   - **请求拦截器**: 动态注入 `Authorization`、时间戳、取消令牌
   - **响应拦截器**:
     - 状态码预处理（401 自动刷新 Token，410 跳转登录）
     - 统一解包（直接返回 `data.data` 内容）
     - 错误自动重试机制（可配置重试次数和延迟）
   - `types.ts`: 定义标准的后端返回结构 `ApiResponse<T>` 和错误类型
   - `request-cache.ts`: GET 请求缓存实现
   - `cancel-manager.ts`: 重复请求取消管理

2. **业务层 (`[module]/index.ts`)**:
   - 编写具体的请求函数
   - **类型约束**: 必须显式声明请求参数接口（`Params`）和响应数据接口（`Response`）

---

## 核心功能特性

### ✅ 自动化特性
- [x] **智能 Token 注入**: 拦截器自动从 Storage 获取 Token
- [x] **Token 自动刷新**: 401 时自动刷新 Token，支持请求队列等待
- [x] **全局异常捕获**: 拦截器内置 `Toast` 提示，支持静默模式
- [x] **幂等性保障**: 自动取消重复的并发请求（`cancel-manager`）
- [x] **缓存加速**: 支持 GET 请求的客户端缓存，减少冗余网络开销
- [x] **失败自愈**: 对超时等网络抖动错误进行自动重试（可配置）

### 📊 错误码规范
后端返回的 `code` 应遵循以下语义：
- `200 / 0`: 操作成功，拦截器自动返回 `data.data`
- `401`: Token 过期，触发自动刷新
- `410`: 认证失效（Token 无效或被拉黑），清除所有 Token 跳转登录
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部异常
- 其他业务错误码由 UI 层自行处理

---

## 开发规范

### 1. 类型安全 (Type Safety)

必须为每个 API 定义完整的 TypeScript 类型。

```typescript
import { api } from '@/api';
import type { ProductItem } from '@/types/product';

// 1. 定义请求参数类型
export interface ProductListParams {
  page: number;
  pageSize: number;
  categoryId: string;
  sortBy: 'default' | 'sales' | 'priceAsc' | 'priceDesc';
  keyword?: string;
}

// 2. 定义响应数据类型
export interface ProductListResponse {
  list: ProductItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 3. 实现接口（注意：响应拦截器已自动解包 data.data）
export const productApi = {
  getProductList: async (
    params: ProductListParams,
  ): Promise<ProductListResponse> => {
    return await api.get('/api/v1/product/list', { params });
  },
};
```

### 2. 命名契约 (Naming Convention)

| 动词 | 场景 | 示例 |
| :--- | :--- | :--- |
| `get` | 获取单条数据/详情 | `getProductDetail` |
| `list` | 获取列表数据 | `getProductList` |
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

#### 跳过认证
用于登录、注册等不需要 Token 的接口。
```typescript
api.post('/api/v1/auth/login', data, { skipAuth: true })
```

#### 自动重试
对网络抖动错误启用自动重试。
```typescript
api.get('/api/v1/product/list', {
  params,
  retry: 2,        // 重试 2 次
  retryDelay: 1000 // 每次间隔 1 秒
})
```

---

## 模块注册规范

新增业务模块时，必须在 `apps/web/src/api/index.ts` 中完成注册：

```typescript
// 1. 导入模块
import { yourModuleApi } from './your-module';

// 2. 导出模块
export { yourModuleApi };

// 3. 在 DefaultApi 接口中声明
interface DefaultApi extends AxiosInstance {
  product: typeof productApi;
  yourModule: typeof yourModuleApi;
}

// 4. 挂载到默认导出对象
const defaultApi = api as DefaultApi;
defaultApi.yourModule = yourModuleApi;
```

---

---

## 🔒 HttpOnly Cookie 安全规范（强制）

### 背景
为防范 XSS 攻击窃取 Token，本项目采用 **HttpOnly Cookie + SameSite** 的安全认证方案。

### 核心规则

| 规则 | 要求 |
|------|------|
| ✅ **Token 存储** | 前端 **禁止** 存储 accessToken/refreshToken |
| ✅ **Axios 配置** | 必须开启 `withCredentials: true` |
| ✅ **Token 刷新** | 刷新接口不传参数，后端从 Cookie 自动读取 |
| ✅ **请求头** | 禁止手动设置 `Authorization` 头（Cookie 自动携带） |
| ✅ **登出流程** | 调用登出接口，后端清除 Cookie |

### 兼容策略
- **旧用户**：localStorage 中 refreshToken 可作为降级参数传入
- **新用户**：完全依赖 Cookie，不传任何参数

### 刷新 Token 的正确实现

```typescript
// ❌ 错误：导入聚合 API 对象导致循环依赖
import defaultApi from '../index';
defaultApi.auth.refreshToken();

// ✅ 正确：在 axios-instance 内部直接调用
// 不依赖业务层 API，避免循环
const refreshResponse = await api.post(
  '/api/v1/auth/refresh',
  { refreshToken }, // 可选，仅兼容旧用户
  { skipAuth: true, skipErrorToast: true }
);
```

---

## 🔄 循环依赖防范指南

### API 模块分层原则

```
┌─────────────────────────────────────────┐
│              业务 API 层                │
│  auth / user / product / article        │
└────────────┬────────────────────────────┘
             │ 依赖
┌────────────▼────────────────────────────┐
│              API 聚合层                 │
│  @/api/index - defaultApi 导出对象      │
└────────────┬────────────────────────────┘
             │ 依赖
┌────────────▼────────────────────────────┐
│              核心工具层                 │
│  axios-instance / request-cache / types │
└─────────────────────────────────────────┘
```

### 禁止的依赖方向

- ❌ **核心层 → 聚合层**：axios-instance 禁止 import @/api
- ❌ **核心层 → 业务层**：axios-instance 禁止直接导入 auth/user 等
- ✅ **业务层 → 聚合层**：业务 API 可以 import { api } from '@/api'

### 循环依赖检测

1. **开发环境**：Vite 控制台会有 `Circular dependency` 警告
2. **构建检测**：使用 `madge` 工具检测
   ```bash
   npx madge --circular src/api/
   ```

### 修复方案优先级

1. **分层重构**：将刷新逻辑抽离到 core 层内部，不依赖业务层
2. **延迟导入**：使用函数级别的 import，而非模块顶层
3. **动态 import**：`import('../auth').then(...)`

---

## 检查清单 (Checklist)

在提交 API 相关代码前，请确认：
- [ ] **路径规范**: 是否使用了别名 `@/api`？
- [ ] **解耦性**: 是否按业务模块正确拆分目录？
- [ ] **健壮性**: 响应类型是否包含所有必填字段？
- [ ] **导出**: 是否已在 `apps/web/src/api/index.ts` 中完成注册？
- [ ] **类型**: 是否为每个 API 定义了 Params 和 Response 类型？
- [ ] **清理**: 是否移除了调试用的 `console.log`？
- [ ] **安全**: 是否遵守 HttpOnly Cookie 规范，未在前端存储 Token？
- [ ] **架构**: 没有引入新的循环依赖（核心层不导入聚合层）？

---

## 最佳实践建议

1. **先设计后编码**: 先与后端约定 JSON 结构，并在此文档对应的模块中定义接口类型。
2. **复用类型**: 基础的业务实体（如 `User`, `Product`）应在 `apps/web/src/types/` 中定义，API 模块仅引用。
3. **防御性编程**: 对后端返回的不确定性数据（如 `null` 或 `undefined`），在 Response 类型中明确标注并做好降级处理。
4. **统一入口**: 组件中始终使用 `import api from '@/api'` 导入，不要直接导入业务模块。
5. **分层意识**: 编写核心层代码时，始终检查导入语句，避免向上层依赖。
