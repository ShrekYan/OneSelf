# Backend Users 模块 - getUserInfo 接口文档

## 📋 模块基本信息

| 项           | 详情                                 |
| ------------ | ------------------------------------ |
| **模块路径** | `services/backend/src/users/`        |
| **接口名称** | `getUserInfo`                        |
| **请求方式** | `POST`                               |
| **完整路由** | `POST /api/v1/user/info`             |
| **返回类型** | `UserDto`                            |
| **认证要求** | JWT Token（Cookie 或 Header Bearer） |

---

## 🎯 功能描述

获取当前登录用户的基本信息。接口遵循微服务架构原则：

- **auth-service**：负责 JWT Token 认证验证（通过 RemoteJwtAuthGuard 远程调用）
- **backend**：负责用户信息查询，直接访问本地数据库

---

## 📐 接口定义

### 请求参数

无参数，用户 ID 从 JWT Token 中自动解析获取。

### 返回数据结构（UserDto）

```typescript
{
  code: 200,
  message: "Success",
  data: {
    id: "author-1",           // 用户 ID
    username: "13800138000",  // 用户名（手机号）
    email?: "user@example.com", // 邮箱（可选）
    nickname?: "张三",         // 昵称（可选）
    avatar?: "https://example.com/avatar.jpg"  // 头像 URL（可选）
  }
}
```

### Swagger 文档

启动 backend 服务后，访问：`http://localhost:8888/docs` →「用户信息」标签

---

## 🔒 认证流程

```
1. 请求携带 Token（Cookie 优先，Header Bearer 备用）
       ↓
2. RemoteJwtAuthGuard 提取 Token
       ↓
3. 调用 auth-client.introspect(token) 远程验证
       ↓
4. 验证通过 → 挂载 userId 到 request
       ↓
5. @CurrentUserId() 装饰器提取 userId
       ↓
6. 调用 usersService.getUserInfo(userId) 查询数据库
       ↓
7. 返回 UserDto 数据（由全局拦截器自动包裹 { code, message, data }）
```

---

## 📁 涉及文件清单

| 文件路径                                         | 变更类型 | 说明                                     |
| ------------------------------------------------ | -------- | ---------------------------------------- |
| `services/backend/src/users/dto/user.dto.ts`     | ✅ 新建  | 与 auth-service 字段 100% 对齐的 UserDto |
| `services/backend/src/users/dto/index.ts`        | ✅ 修改  | 新增 UserDto 导出                        |
| `services/backend/src/users/users.controller.ts` | ✅ 修改  | GET → POST，返回类型改为 UserDto         |
| `services/backend/src/users/users.service.ts`    | ✅ 修改  | 返回类型 UserDto，移除 bio 字段          |

---

## ✅ 质量检查清单

| 检查项                           | 状态              |
| -------------------------------- | ----------------- |
| TypeScript 编译通过              | ✅ 0 error        |
| ESLint 检查通过                  | ✅ 0 error        |
| JWT 认证守卫正确应用             | ✅                |
| POST 请求方式正确                | ✅                |
| 返回格式 { code, message, data } | ✅ 全局拦截器确保 |
| UserDto 与 auth-service 字段对齐 | ✅ 100% 一致      |
| Swagger 注解完整                 | ✅                |
| 服务解耦（独立 DTO）             | ✅                |

---

## 🎯 架构设计原则

1. **单一职责**：auth-service 只做认证，backend 只做业务数据查询
2. **服务解耦**：backend 独立定义 UserDto，不依赖 auth-service 内部类型
3. **向后兼容**：UserInfoDto 保留导出，不影响现有代码
4. **类型安全**：移除 any 类型断言，严格类型检查

---

## 📌 后续可优化项

- `UpdateProfileDto.bio` 字段与数据库不一致问题（数据库无 bio 字段）
- 考虑增加用户信息缓存（Redis）降低数据库压力
- 考虑增加用户信息变更日志审计
