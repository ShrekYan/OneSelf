# 路由拦截器接口替换与循环依赖修复 - 模块功能文档

## 📋 模块概述

**模块路径**：`apps/web/src/routes/components/RouteInterceptor.tsx`

**功能定位**：前端路由守卫，负责用户认证状态检查、Token 验证、登录跳转。

---

## 🎯 核心功能

### 1. 权限认证检查

- 对需要认证的路由（`/profile`、`/settings`、`/article/edit`、`/publish` 等前缀）进行拦截
- 调用后端接口验证用户登录状态
- Cookie 自动携带，无需手动处理

### 2. 缓存优化策略

- `sessionStorage` 缓存用户信息，减少重复接口调用
- 注意：缓存仅作性能优化，接口验证才是真正的认证依据

### 3. 登录状态跳转

- 认证失败时自动跳转到登录页
- 携带 `redirect` 参数，登录成功后可回到原页面

---

## 🔗 API 依赖

### 用户信息接口

| 项            | 说明                                      |
| ------------- | ----------------------------------------- |
| **接口函数**  | `getCurrentUser()`                        |
| **所在文件**  | `apps/web/src/api/auth/index.ts`          |
| **HTTP 方法** | `POST`                                    |
| **完整路径**  | `/api/v1/user/info`                       |
| **返回类型**  | `Promise<UserDto>`                        |
| **特殊配置**  | `skipAuth: true` + `skipErrorToast: true` |

**特殊配置说明**：

- `skipAuth`：避免 401 拦截导致死循环
- `skipErrorToast`：静默失败，统一由 RouteInterceptor 处理跳转逻辑

---

## 🏗️ 关键实现

### 认证状态管理

```typescript
type AuthStatus = 'idle' | 'pending' | 'authenticated' | 'unauthenticated';
```

### 认证流程

```
1. 判断路由是否需要认证
   ↓
2. 检查 sessionStorage 缓存（性能优化）
   ├─ 有缓存 → 直接设置已认证状态
   └─ 无缓存 → 继续下一步
   ↓
3. 调用 getCurrentUser() 接口验证
   ├─ 成功 → 写入缓存，设置已认证
   └─ 失败 → 清理缓存，跳转登录页
```

---

## ⚠️ 重要注意事项

### 1. 循环依赖问题

**API 模块间存在循环依赖链**，导入时必须注意：

```typescript
// ❌ 错误：相对路径导入，形成循环
import api from '../core/axios-instance';

// ✅ 正确：从 @/api 入口导入，打破循环
import { api } from '@/api';
```

### 2. 卸载保护

使用 `isMounted` 标记防止组件卸载后 `setState` 导致警告。

---

## 📁 相关文件清单

| 文件路径                                              | 说明                                |
| ----------------------------------------------------- | ----------------------------------- |
| `apps/web/src/routes/components/RouteInterceptor.tsx` | 路由拦截器主组件                    |
| `apps/web/src/api/auth/index.ts`                      | 认证相关 API，含 `getCurrentUser()` |
| `apps/web/src/api/core/axios-instance.ts`             | Axios 实例封装                      |
| `apps/web/src/api/index.ts`                           | API 统一入口                        |

---

**文档生成日期**：2026-04-29
