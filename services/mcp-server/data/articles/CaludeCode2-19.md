---
title: Spec-Kit Plan 是怎么把需求规格变成技术方案的？
slug: spec-kit-plan-technical-design
date: 2026-06-05
tags: [Claude Code, AI编程, Spec-Kit]
---

# Spec-Kit Plan 是怎么把需求规格变成技术方案的？

前两篇分别讲了 `/speckit-specify` 和 `/speckit-clarify`。

`specify` 负责生成需求规格，`clarify` 负责把模糊需求问清楚。到了这一篇，我们进入第三个阶段：`/speckit-plan`。

如果说 `spec.md` 回答的是“要做什么”，那 `plan.md` 回答的就是“准备怎么做”。

## 一、Plan 在整个流程里的位置

Spec-Kit 的主流程是：

```
Specify → Clarify → Plan → Tasks → Implement
```

`Plan` 位于 `Clarify` 之后、`Tasks` 之前。

它的输入是已经明确过的 `spec.md`，输出则是一组技术设计文档：

```
spec.md
 ↓
/speckit-plan
 ↓
plan.md
research.md
data-model.md
contracts/
quickstart.md
```

它的核心职责是：

把需求规格转换成技术实现方案。

注意，这一步仍然不是写代码。

它做的是技术设计、边界确认、决策记录和验证方案设计。

## 二、Plan 和 Specify 最大的区别

我理解它们的区别是：

| 阶段    | 关注点   | 回答的问题                 |
| ------- | -------- | -------------------------- |
| Specify | 需求     | 用户想要什么？为什么要做？ |
| Clarify | 澄清     | 哪些需求规则还不明确？     |
| Plan    | 技术方案 | 这个需求准备怎么落地？     |

`spec.md` 里不应该写太多实现细节。

但到了 `plan.md`，就必须开始回答技术问题，比如：

- 要改哪些系统？

- 前端调用哪个服务？

- 哪个服务是真正的事实源？

- 数据模型是什么？

- 接口契约是什么？

- 有哪些安全约束？

- 怎么验证功能完成？

所以 Plan 是从“需求语言”转向“工程语言”的阶段。

## 三、Plan 大概怎么执行？

一次 `/speckit-plan` 大概会分成几个阶段：

```
读取 spec.md
 ↓
检查是否还有未澄清的问题
 ↓
读取项目约束和上下文
 ↓
Phase 0：技术调研，生成 research.md
 ↓
Phase 1：设计数据模型、接口契约、验收指南
 ↓
汇总生成 plan.md
```

用一句话概括就是：

先调研，再设计，最后汇总成技术方案。

这比直接让 AI 写代码稳很多。

## 四、案例背景：忘记密码功能

这次案例还是使用我的项目里的忘记密码功能：

```
specs/20260605-104356-forgot-password/
```

前面 `specify` 和 `clarify` 已经明确了几个关键需求：

```
1. 用户可以通过手机号重置密码
2. 当前阶段验证码能力未接入，暂不校验验证码
3. 前端只调用 backend
4. backend 作为中间层调用 auth-service
5. auth-service 是认证事实源
6. 本 feature 不生成任务级单元测试，以 lint/build/typecheck 和 quickstart 手工验收为主
```

这些内容会成为 Plan 阶段的输入。

也就是说，Plan 不是凭空设计，而是从 `spec.md` 推导出来。

## 五、Plan 生成的主文档：plan.md

这个案例生成的主计划文件是：

```
specs/20260605-104356-forgot-password/plan.md
```

它的开头总结了整个技术方案：

```
本功能实现“忘记密码”主链路：用户在已完成的前端忘记密码页面提交手机号、新密码和确认密码后，前端只调用 services/backend 暴露的忘记密码接口；services/backend 作为前端与认证服务之间的中间层，调用 services/auth-service 完成手机号格式校验、账号状态校验、密码规则校验、Argon2id 新密码哈希、用户密码更新、密码相关缓存刷新、既有 Refresh Token 会话失效，并向前端返回统一结果。
```

这段话已经不是单纯的需求描述了。

它明确了：

- 前端入口在哪里

- 前端只调用 backend

- backend 是中间层

- auth-service 负责实际密码重置

- 密码使用 Argon2id

- 重置成功后要处理缓存和 Refresh Token

- 当前验证码能力未接入

- 验证方式以 lint/build/typecheck 和 quickstart 为主

这就是 Plan 的价值：把需求变成工程落地方案。

## 六、Technical Context：把技术上下文说清楚

`plan.md` 中非常重要的一块是 `Technical Context`。

在忘记密码案例里，它记录了：

```
Language/Version:
TypeScript；前端 React 19.2.3 + Vite 7.3.1；后端 NestJS 11.0.1；Prisma ORM 6.4.1

Primary Dependencies:
前端使用 React、MobX、react-hook-form、zod、Ant Design Mobile、Axios 分层 API；
backend 使用 NestJS、Swagger、class-validator、AuthClientService；
auth-service 使用 NestJS、Prisma、Redis、argon2、JWT。

Storage:
auth-service MySQL Users / RefreshTokens 表；Redis 用户缓存、密码缓存、Refresh Token 集合；当前阶段不新增验证码持久化表。

Testing:
不生成任务级单元测试；执行 lint/build/typecheck，并以 quickstart 手工验收。
```

这部分会让后面的 `tasks.md` 不至于乱拆任务。

比如它明确了：

- 不新增验证码表

- backend 不新增持久化存储

- auth-service 使用现有 Users / RefreshTokens

- 不生成任务级单元测试

- 前端不能直接调用 auth-service

这些都是任务拆解时必须遵守的边界。

## 七、Constitution Check：检查是否违反项目原则

Plan 阶段还有一个重要环节：`Constitution Check`。

可以理解为项目“宪法检查”。

它会检查当前技术方案是否符合项目的架构原则、安全规则和开发规范。

忘记密码案例里的检查结果包括：

| 原则               | 状态 | 说明                                                                       |
| ------------------ | ---- | -------------------------------------------------------------------------- |
| 类型安全优先       | PASS | DTO、响应类型、前端 API 类型都要求显式类型，不引入 any                     |
| 默认安全           | PASS | 新密码使用 Argon2id 哈希，不记录明文密码和完整 Token                       |
| 清晰架构边界       | PASS | 前端只调用 backend，backend 调用 auth-service，认证事实源仍在 auth-service |
| 最小变更与优先复用 | PASS | 复用现有页面、AuthClientService、AuthService、缓存服务等能力               |
| 规格与契约驱动     | PASS | 生成接口契约，确保实现和 spec/plan/contracts 一致                          |
| 验证门禁           | PASS | 不写单测是本 feature 例外，但仍保留 lint/build/typecheck 和手工验收        |

这个检查很有用。

因为它能提前发现方案是否违反项目底线。

例如这个项目里，密码重置属于认证领域。

如果 Plan 设计成：

```
backend 直接改用户密码表
```

那就违反了服务边界。

正确方案应该是：

```
web → backend → auth-service
```

backend 只是中间层，auth-service 才是认证事实源。

## 八、Project Structure：明确要改哪些文件

Plan 阶段还会给出项目结构。

这个忘记密码功能涉及三个系统：

```
apps/web
services/backend
services/auth-service
```

`plan.md` 里明确了修改范围：

```
apps/web/
└── src/
 ├── api/ # 新增或复用调用 backend 的认证 API 方法
 └── pages/ForgotPassword/
 ├── index.tsx # 已存在页面，按 backend 契约接入真实 API
 ├── useStore.ts # 替换当前 mock 重置逻辑
 ├── schema.ts # 当前阶段验证码字段可保留但不作为后端必校验
 ├── handle.ts
 └── index.module.scss

services/backend/
└── src/
 ├── auth/
 │ ├── auth.controller.ts # 新增面向前端的忘记密码代理接口
 │ └── dto/
 │ ├── forgot-password-send-code.dto.ts
 │ ├── forgot-password-reset.dto.ts
 │ └── forgot-password-response.dto.ts
 ├── shared/
 │ └── auth-client.service.ts # 复用现有 auth-service 调用封装
 └── common/constants/business-error-codes.ts

services/auth-service/
└── src/
 ├── auth/
 │ ├── auth.controller.ts # 新增忘记密码内部认证接口
 │ ├── auth.service.ts # 新增重置密码事实源业务方法
 │ └── dto/
 │ ├── forgot-password-send-code.dto.ts
 │ ├── forgot-password-reset.dto.ts
 │ └── forgot-password-response.dto.ts
```

这一步对 Monorepo 项目特别关键。

因为 AI 很容易把代码写错服务。

有了 Project Structure，后续 `tasks.md` 就可以围绕这些目录生成任务。

## 九、Phase 0：生成 research.md，记录技术决策

Plan 不只是生成 `plan.md`，还会生成 `research.md`。

这个文件记录的是：

为什么选择这个方案，而不是其他方案。

在忘记密码案例里，`research.md` 记录了多个关键决策。

### 决策 1：前端经由 backend 中间层触发 auth-service

```
Decision: 前端经由 backend 中间层触发 auth-service 密码重置

Rationale:
用户已澄清前端只接触 services/backend，由 backend 作为前端与认证服务之间的中间层。
忘记密码直接修改用户认证凭据、密码哈希算法、Refresh Token 会话状态和认证缓存，属于 services/auth-service 事实源。
```

同时拒绝了两个替代方案：

```
- 前端直接调用 services/auth-service：拒绝，与项目运行边界不一致
- 在 services/backend 直接修改密码：拒绝，会跨越认证边界并造成凭据事实源分散
```

这就是 `research.md` 的价值。

它不只是写“我们要这么做”，还写“为什么不那么做”。

### 决策 2：当前阶段验证码免校验

```
Decision: 当前阶段验证码免校验，但保留发送验证码模拟接口

Rationale:
规格澄清已明确“目前验证码功能未接入”，最终选择为暂不校验验证码。
为了不阻断已存在页面交互，backend 面向前端提供发送验证码接口，auth-service 返回模拟成功或友好提示。
```

拒绝的方案包括：

```
- 固定 Mock 验证码 123456：拒绝，和“不验证验证码”不一致
- 完全移除验证码字段和按钮：拒绝，会扩大前端改动，也不利于后续真实验证码接入
```

这类决策如果不写下来，后续很容易被误解。

### 决策 3：新密码使用 Argon2id

```
Decision: 新密码使用现有 Argon2id 配置重新哈希

Rationale:
项目安全规则要求密码使用 Argon2id。auth-service 已在注册和迁移中使用 argon2.hash，重置密码应复用同一套配置。
```

这让安全要求从 `spec.md` 传导到了技术实现层。

### 决策 4：重置成功后使 Refresh Token 失效

```
Decision: 重置成功后使用户既有 Refresh Token 全部失效

Rationale:
忘记密码属于账号恢复行为，重置成功后旧设备会话不再完全可信。
```

这会直接影响后续任务：必须调用现有 Refresh Token 清理能力。

## 十、Phase 1：生成 data-model.md

`data-model.md` 用来描述这个功能涉及的数据对象、字段、状态变化和验证规则。

在忘记密码案例里，它包含了几个核心对象：

```
用户账号 User Account
Backend 忘记密码代理请求
Auth-Service 密码重置请求
密码重置验证码
安全审计记录
Refresh Token 会话状态
```

比如 `Auth-Service 密码重置请求` 中定义了：

```
mobile: string
password: string
confirmPassword: string
code?: string
verificationBypassed: boolean
result: 'success' | 'invalid_input' | 'account_unavailable' | 'same_password' | 'failed'
requestedAt: number
```

同时明确了验证规则：

```
- mobile 必须通过格式校验
- password 与 confirmPassword 必须一致
- password 必须满足现有密码长度和强度规则
- password 不能与当前密码相同
- 当前阶段不校验 code
```

这一步的意义是：在写代码前，先把请求结构和状态变化讲清楚。

## 十一、Phase 1：生成 contracts 接口契约

这个功能涉及前后端接口，所以 Plan 阶段还生成了契约文件：

```
contracts/forgot-password-api.md
```

它定义了两个前端可调用接口：

```
POST /auth/forgot-password/send-code
POST /auth/forgot-password/reset
```

其中 `reset` 接口请求体是：

```
{
  "mobile": "13800138000",
  "code": "123456",
  "password": "newPassword123",
  "confirmPassword": "newPassword123" }
```

字段规则也写清楚了：

| 字段            | 类型   | 必填 | 规则                 |
| --------------- | ------ | ---- | -------------------- |
| mobile          | string | 是   | 11 位手机号格式      |
| code            | string | 否   | 当前阶段接收但不校验 |
| password        | string | 是   | 复用现有密码规则     |
| confirmPassword | string | 是   | 必须与 password 一致 |

并且明确了副作用：

```
- backend 将请求转发/编排到 auth-service
- auth-service 将用户密码哈希更新为 Argon2id 结果
- auth-service 删除或刷新相关缓存
- auth-service 删除该用户所有 Refresh Token
- 不记录明文密码
```

这就是契约驱动的好处。

前端、backend、auth-service 都可以围绕同一份契约工作。

## 十二、Phase 1：生成 quickstart.md

`quickstart.md` 是验收和使用指南。

在这个忘记密码案例里，它定义了核心手工验收流程。

比如成功重置密码：

```
1. 准备一个已注册手机号账号
2. 打开忘记密码页面
3. 输入手机号、新密码、确认密码
4. 验证码字段可填写任意值
5. 提交重置
6. 期望前端请求 backend，backend 调用 auth-service 完成密码重置
7. 使用新密码登录成功
8. 使用旧密码登录失败
```

还定义了验证码未接入场景：

```
1. 点击获取验证码
2. backend 返回模拟成功提示或友好提示
3. 提交合法手机号和密码
4. 不因为验证码未真实发送或未校验而拒绝重置
```

以及建议执行的验证命令：

```
cd services/auth-service
npm run lint
npm run build

cd services/backend
npm run lint
npm run build

cd apps/web
npm run lint
npx tsc --noEmit
```

这一步非常实用。

因为它把“怎么确认这个功能做好了”写成了可执行清单。

## 十三、Plan 为什么是派生文件？

Plan 有一个重要特点：

`plan.md` 是从 `spec.md` 派生出来的。

所以只要 `spec.md` 变了，就应该重新运行 `/speckit-plan`。

比如如果 Clarify 后新增一条规则：

```
真实验证码必须 10 分钟内有效，且最多错误 5 次
```

那么 Plan 里的内容就可能要变：

- 是否需要 Redis 存储验证码状态

- 是否需要限流逻辑

- contracts 是否要更新错误返回

- data-model 是否要新增验证码字段

- quickstart 是否要新增验证码过期验收场景

如果不重新 Plan，下游文档就会和需求不一致。

这也是 Spec-Kit 很强调“上游变更，下游同步”的原因。

## 十四、Plan 阶段最容易踩的坑

### 1. spec 还没澄清完就开始 plan

如果 `spec.md` 里还有不确定问题，Plan 就会开始猜。

比如没有澄清“前端调用 backend 还是 auth-service”，Plan 可能设计错调用链。

所以 Plan 前最好先执行 Clarify。

### 2. 只写要改什么，不写为什么这么改

如果 `research.md` 只写：

```
使用 backend 中间层
```

但不写原因，后续别人可能会改回直接调用 auth-service。

更好的写法是：

```
选择 backend 中间层，因为前端只接触 backend，auth-service 是认证事实源，backend 不直接修改认证凭据。
```

### 3. 忽略验证方案

Plan 不只是设计实现，还要设计验收。

忘记密码这种认证能力，即使不生成单元测试，也必须保留：

- lint

- build

- typecheck

- 手工验收

- 安全边界检查

不能因为“不写测试”就等于“不验证”。

## 十五、总结

`/speckit-plan` 的本质是：

把已经明确的需求规格，转成可执行的技术方案。

它通常会生成：

| 文件            | 作用                         |
| --------------- | ---------------------------- |
| `plan.md`       | 技术方案总览                 |
| `research.md`   | 技术决策和替代方案记录       |
| `data-model.md` | 数据模型、请求结构、状态变化 |
| `contracts/`    | 前后端或服务间接口契约       |
| `quickstart.md` | 快速验收和使用指南           |

在我的忘记密码案例里，Plan 阶段明确了：

- 前端只调用 backend

- backend 作为中间层调用 auth-service

- auth-service 是认证事实源

- 当前阶段验证码免校验，但保留模拟发送接口

- 新密码使用 Argon2id 哈希

- 重置成功后 Refresh Token 全部失效

- 不新增验证码持久化模型

- 不生成任务级单元测试，但保留 lint/build/typecheck 和 quickstart 手工验收

所以 Plan 不是简单生成一个方案文档，而是把需求、架构、安全、接口、数据、验证全部串起来。

下一篇我会继续讲 `/speckit-tasks`：当技术方案明确后，Spec-Kit 是如何把它拆成一条条可执行任务的。
