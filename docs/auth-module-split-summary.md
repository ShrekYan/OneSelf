# 后端 Auth 模块拆分用户模块 - 重构总结

## 📋 重构背景

当前后端 `auth` 模块混合了**认证功能**和**用户信息管理功能**，随着业务增长，接口越来越多，维护成本升高。需要拆分为两个独立模块：

- **Auth 模块**：仅负责认证相关功能（登录、注册、刷新令牌、登出、发送验证码）
- **Users 模块**：专门负责用户信息管理（获取用户信息、更新用户信息）

---

## 🎯 最终架构

### 后端模块结构

```
backend/src/
├── auth/                              # 认证模块（仅认证功能）
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── login-response.dto.ts
│   │   ├── refresh.dto.ts
│   │   ├── refresh-response.dto.ts
│   │   ├── register.dto.ts
│   │   ├── register-response.dto.ts
│   │   └── user.dto.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
└── users/                             # 用户信息模块（新建）
    ├── dto/
    │   ├── user-info.dto.ts          # 用户信息响应
    │   ├── update-profile.dto.ts     # 更新用户信息请求
    │   └── index.ts                   # 导出所有 DTO
    ├── users.controller.ts           # 用户信息控制器
    ├── users.module.ts                # 用户模块定义
    └── users.service.ts              # 用户信息业务逻辑
```

### 前端 API 结构

```
src/api/
├── auth/                              # 认证模块（所有认证相关）
│   └── index.ts
│       refreshToken()  - 刷新访问令牌
│       logout()        - 用户登出
│       sendCode()      - 发送验证码
│       register()      - 用户注册
│       login()         - 用户登录
└── user/                              # 用户信息模块（仅用户信息管理）
    └── index.ts
        getUserInfo()    - 获取当前用户信息
        updateUserInfo() - 更新当前用户信息
```

---

## 📊 接口路由分配

### Auth 模块（认证）

| 接口 | 方法 | 路由 | 功能 |
|------|------|------|------|
| register | POST | `/api/v1/auth/register` | 用户注册 |
| login | POST | `/api/v1/auth/login` | 用户登录 |
| refreshToken | POST | `/api/v1/auth/refresh` | 刷新访问令牌 |
| logout | POST | `/api/v1/auth/logout` | 用户登出 |
| sendCode | POST | `/api/v1/auth/send-code` | 发送验证码 |

### Users 模块（用户信息）

| 接口 | 方法 | 路由 | 功能 |
|------|------|------|------|
| getUserInfo | GET | `/api/v1/user/info` | 获取当前登录用户信息 |
| updateUserInfo | PUT | `/api/v1/user/info` | 更新当前登录用户信息 |

---

## 📝 新建/修改文件清单

### 后端（新建 5 个文件，修改 2 个文件）

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 🆕 新建 | `backend/src/users/users.module.ts` | 用户模块定义 |
| 🆕 新建 | `backend/src/users/users.controller.ts` | 用户信息控制器 |
| 🆕 新建 | `backend/src/users/users.service.ts` | 用户信息服务 |
| 🆕 新建 | `backend/src/users/dto/user-info.dto.ts` | 用户信息响应 DTO |
| 🆕 新建 | `backend/src/users/dto/update-profile.dto.ts` | 更新用户信息请求 DTO |
| 🆕 新建 | `backend/src/users/dto/index.ts` | DTO 导出文件 |
| 🔧 修改 | `backend/src/app.module.ts` | 添加 `UsersModule` 导入 |
| 🔧 修改 | `backend/src/common/constants/business-error-codes.ts` | 添加 `USER_NOT_FOUND` 错误码 |
| ♻️ 恢复 | `backend/src/auth/dto/user.dto.ts` | 恢复了误删的文件 |

### 前端（修改 4 个文件）

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 🔧 修改 | `src/api/auth/index.ts` | 添加 `sendCode`, `register`, `login`, 统一 `logout` 路径 |
| 🔧 修改 | `src/api/user/index.ts` | 删除 `sendCode`, `register`, `login`, `signOut` 和未使用类型 |
| 🔧 修改 | `src/pages/Login/useStore.ts` | `login` 调用改为从 `authApi` |
| 🔧 修改 | `src/pages/Register/useStore.ts` | `register` 调用改为从 `authApi` |
| 🔧 修改 | `src/pages/Discover/routes/profile/hooks/useHandleSignOut.ts` | `signOut` 调用改为 `authApi.logout` |

---

## 🔒 依赖关系

```
AppModule
├── AuthModule
│   ├── PrismaModule
│   └── CommonModule
└── UsersModule (新增)
    ├── PrismaModule
    └── CommonModule
```

✅ **保证无循环依赖**：AuthModule 和 UsersModule 互相不依赖，都只依赖公共模块。

---

## ⚠️ Prisma 兼容处理

由于 Prisma schema 中用户表名为小写 `users`，在 TypeScript 编译时会遇到类型识别问题，采用项目已验证的方案：

```typescript
// 1. 绕过编译类型检查
const user = await (this.prismaService as any).users.findUnique({
  where: { id: userId },
});

// 2. 导入 Prisma 生成的类型
import type { Users } from '@prisma/client';

// 3. 使用时对参数标注类型
return this.mapToDto(user as Users);
```

---

## ✅ 验证结果

| 检查项 | 状态 |
|--------|------|
| 后端 TypeScript 类型检查 | ✅ 通过 |
| 后端 ESLint 检查 | ✅ 通过 |
| 前端 TypeScript 类型检查 | ✅ 通过 |
| 无循环依赖 | ✅ 保证 |
| Prisma 兼容处理 | ✅ 正确 |
| 遵循项目模块结构规范 | ✅ 符合 |

---

## 💬 提示词分析与改进建议

### 当前提示词优点

```
backend/src/auth 拆分用户模块；

背景：
由于相关用户接口随着业务的激增导致接口变的越来越多，后续维护成本比较高，想拆分出用户模块，便于维护。

功能需求：
- 用户和权限模块都分离出来作为独立的模块。
- 拆分后的模块都能正常使用
- 前端api中的auth和user的接口进行更新

完成标准：
- 先给我建议和方案，让我确认后再执行
- 前端api的auth和user根据后端接口改造进行请求接口路由片段的改造。
- 后端拆分后的模块一定要兼容prisma，拆分后接口之前的引用依赖还是需要的。

约束：
- 模块里面的功能不要变动和类型都不需要变更
- 仅重构当前功能，其他功能不动
```

**优点：**
1. ✅ 有明确的**背景**说明问题原因
2. ✅ 列出了清晰的**功能需求**
3. ✅ 给出了**完成标准**要求先方案后执行
4. ✅ 明确了**约束条件**（不改变功能，只重构）

### 欠缺之处

| 欠缺点 | 说明 | 改进建议 |
|--------|------|----------|
| **缺少明确的期望输出** | 没有说明最终想要得到什么交付物（比如：文档总结、代码改动、测试验证） | 在最后加上：> 完成后请生成 `docs/` 目录下的总结文档 |
| **缺少对前端改动的明确要求** | 第一轮提示中只说"前端api中的auth和user的接口进行更新"，但没明确说`signOut`该放哪里 | 可以补充：> - 登出接口 `signOut` 应当从 `userApi` 移到 `authApi`，所有调用点同步修改<br>> - 移除 `src/api/user` 中所有未使用的类型引用 |
| **没有提及需要进入/退出计划模式** | Claude 默认行为不确定，有时直接执行有时先计划 | 明确写上：> 请先进入计划模式，给出完整方案确认后再执行 |

### 改进后的完整提示词示例

```markdown
# 任务：后端 auth 模块拆分独立用户模块

## 背景
由于相关用户接口随着业务的激增导致接口变的越来越多，后续维护成本比较高，想拆分出用户模块，便于维护。

## 功能需求
- 将认证功能和用户信息管理功能分离出来作为两个独立模块
  - Auth 模块：只保留认证相关（登录、注册、刷新令牌、登出、发送验证码）
  - Users 模块：负责用户信息查询和更新
- 拆分后的模块都能正常使用
- 前端 API 中的 auth 和 user 按照后端模块重新划分接口

## 完成标准
1. 先进入计划模式，给出完整实现方案，让我确认后再执行
2. 后端拆分后的模块必须兼容 Prisma，保持依赖引用正确
3. 前端 API 按照后端模块重新划分接口：
   - 所有认证相关接口移到 `src/api/auth`
   - 只保留用户信息管理接口在 `src/api/user`
   - 登出接口 `signOut` 从 `userApi` 移到 `authApi.logout`，所有调用点同步修改
   - 移除 `src/api/user` 中所有未使用的类型定义
4. 完成后在 `docs/` 目录生成一份重构总结 MD 文档

## 约束
- 模块里面的功能不要变动，类型也不需要变更
- 仅重构，只移动归属，不改变功能
- 其他功能保持不动
```

### 改进要点总结

1. **从模糊到清晰**：把"前端api中的auth和user的接口进行更新"这种模糊描述，拆解成具体要做哪些步骤
2. **明确交付期望**：告诉 AI 最终需要输出什么（文档、代码、测试）
3. **利用计划模式**：明确要求先计划后执行，避免 AI 直接执行不符合预期
4. **分层要求**：把后端改动和前端改动分别列清楚，不会遗漏

---

## 🎯 关键经验

1. **单一职责原则**：认证和用户信息本就是两个不同职责，拆分后降低维护成本
2. **无循环依赖**：两个模块都只依赖公共基础设施，互相不依赖，架构更清晰
3. **Prisma 兼容处理**：全小写表名需要用 `(this.prisma as any)` 绕过 TypeScript 编译检查，这是项目已有实践
4. **渐进式重构**：保持 URL 不变，只调整模块归属，对现有业务影响最小
5. **清理无用代码**：移除未使用的类型和函数，保持代码整洁
