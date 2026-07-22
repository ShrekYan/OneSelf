---
title: Spec-Kit Tasks 是怎么把技术方案拆成可执行任务的？
slug: spec-kit-tasks-executable-breakdown
date: 2026-06-05
tags: [Claude Code, AI编程, Spec-Kit]
---

# Spec-Kit Tasks 是怎么把技术方案拆成可执行任务的？

前面几篇已经讲了 Spec-Kit 的前三个阶段：

- `/speckit-specify`：把一句需求变成 `spec.md`

- `/speckit-clarify`：把模糊需求问清楚

- `/speckit-plan`：把需求规格变成技术方案

这一篇继续讲第四个阶段：`/speckit-tasks`。

如果说 `plan.md` 解决的是“准备怎么做”，那 `tasks.md` 解决的就是“具体先做哪一步、后做哪一步”。

## 一、Tasks 在整个流程里的位置

Spec-Kit 的主流程是：

```
Specify → Clarify → Plan → Tasks → Implement
```

`Tasks` 位于 `Plan` 之后、`Implement` 之前。

它的输入是前面已经生成好的设计文档：

```
spec.md
plan.md
research.md
data-model.md
contracts/
quickstart.md
```

它的输出是：

```
tasks.md
```

也就是一份可以直接执行的任务清单。

简单理解：

```
技术方案
 ↓
/speckit-tasks
 ↓
可执行任务清单
```

这一步非常关键，因为它决定了后续 `/speckit-implement` 是“按计划推进”，还是“想到哪写到哪”。

## 二、Tasks 阶段解决什么问题？

很多时候，`plan.md` 虽然已经说明了技术方案，但还不能直接拿来执行。

比如忘记密码功能的 Plan 里已经明确：

- 前端只调用 `services/backend`

- `backend` 作为中间层调用 `auth-service`

- `auth-service` 是认证事实源

- 当前阶段验证码免校验

- 新密码使用 Argon2id

- 重置成功后 Refresh Token 失效

- 不生成任务级单元测试

但这些仍然是“方案描述”。

真正开发时还要拆成：

- 先建哪些 DTO？

- 先改 auth-service 还是 backend？

- 前端 API 什么时候接入？

- 哪些任务可以并行？

- 哪些任务必须先完成？

- 每个用户故事怎么独立验收？

这就是 `/speckit-tasks` 要做的事。

## 三、Tasks 的核心产物长什么样？

在我的忘记密码案例里，生成的任务文件是：

```
specs/20260605-104356-forgot-password/tasks.md
```

开头会说明它的输入来源：

```
**Input**: Design documents from `specs/20260605-104356-forgot-password/` **Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/forgot-password-api.md, quickstart.md
```

也就是说，`tasks.md` 不是凭空生成的。

它是从前面所有设计文档推导出来的。

这点很重要。

因为如果 `plan.md` 没写清楚，`tasks.md` 就很难拆得清楚。

## 四、任务格式：每一条都要可执行

忘记密码案例里的任务格式是：

```
[ID] [P?] [Story] Description
```

含义如下：

| 标记        | 含义                                         |
| ----------- | -------------------------------------------- |
| `ID`        | 任务编号，例如 T001、T002                    |
| `[P]`       | 可并行执行，不修改同一文件，不依赖未完成任务 |
| `[Story]`   | 所属用户故事，例如 `[US1]`、`[US2]`、`[US3]` |
| Description | 明确动作和文件路径                           |

比如：

```
- [ ] T016 [US1] 在 AuthService 中实现 resetForgotPassword 方法并按手机号查询 Users in services/auth-service/src/auth/auth.service.ts
```

这条任务包含了：

- 编号：`T016`

- 用户故事：`US1`

- 动作：实现 `resetForgotPassword`

- 文件路径：`services/auth-service/src/auth/auth.service.ts`

这就是一个合格任务。

它不是一句泛泛的：

```
实现忘记密码功能
```

而是能直接指导开发者或 AI 去改哪个文件、做什么事。

## 五、Phase 1：Setup，先读现有代码

Tasks 不是一上来就让 AI 写代码。

在忘记密码案例里，第一阶段是：

```
## Phase 1: Setup (Shared Infrastructure)
```

它的目的不是实现功能，而是先确认现有结构。

例如：

```
- [ ] T001 阅读并确认 auth-service 认证接口现有风格 in services/auth-service/src/auth/auth.controller.ts
- [ ] T002 阅读并确认 auth-service 现有密码哈希、缓存和 Token 处理 in services/auth-service/src/auth/auth.service.ts
- [ ] T003 [P] 阅读并确认前端调用 backend 认证 API 的封装方式 in apps/web/src/api/auth/index.ts
- [ ] T004 [P] 阅读并确认忘记密码页面 store 当前 mock 行为 in apps/web/src/pages/ForgotPassword/useStore.ts
- [ ] T005 [P] 阅读并确认 backend 认证代理控制器风格 in services/backend/src/auth/auth.controller.ts
- [ ] T006 [P] 阅读并确认 backend 调用 auth-service 的 AuthClientService 封装 in services/backend/src/shared/auth-client.service.ts
```

我觉得这个设计非常实用。

因为很多 AI 写错代码，不是不会写，而是没先看现有风格。

Setup 阶段强制先读：

- auth-service 现有 Controller 风格

- auth-service 现有密码和 Token 处理逻辑

- backend 代理 auth-service 的封装方式

- 前端 ForgotPassword 页面当前 mock 行为

这样后续实现更容易复用已有代码，而不是重新造一套。

## 六、Phase 2：Foundational，先建公共基础

第二阶段是：

```
## Phase 2: Foundational (Blocking Prerequisites)
```

这是阻塞性基础任务。

也就是说：

Phase 2 没完成，不应该进入用户故事实现。

忘记密码案例里的基础任务包括：

```
- [ ] T007 创建 auth-service 发送验证码请求 DTO
- [ ] T008 创建 auth-service 重置密码请求 DTO
- [ ] T009 [P] 创建 auth-service 忘记密码通用响应 DTO
- [ ] T010 [P] 创建 backend 发送验证码请求 DTO
- [ ] T011 [P] 创建 backend 重置密码请求 DTO
- [ ] T012 [P] 创建 backend 忘记密码通用响应 DTO
- [ ] T013 在 auth-service 认证服务错误码中补充忘记密码相关错误码和消息
- [ ] T014 在 backend 认证错误码或异常映射中补充忘记密码代理失败相关错误处理
- [ ] T015 在前端认证 API 中定义调用 backend 的忘记密码请求/响应类型
```

这些任务不属于某一个具体用户故事，而是所有故事都要依赖的基础设施。

比如 DTO、响应类型、错误码、前端 API 类型都准备好之后，后面 US1、US2、US3 才能顺利实现。

这也是 Tasks 阶段的价值：

先拆出共享基础，再拆用户故事，避免一边写业务一边补基础，导致任务顺序混乱。

## 七、Phase 3：US1，先做 MVP 主链路

第三阶段对应第一个用户故事：

```
## Phase 3: User Story 1 - 通过手机号重置密码 (Priority: P1) MVP
```

它的目标是：

```
用户可提交手机号、新密码和确认密码完成密码重置，并能使用新密码登录、旧密码失效；前端只调用 backend，backend 调用 auth-service 完成认证处理。
```

这个用户故事是 MVP。

也就是说，只要 US1 完成，忘记密码主链路就基本可用。

它拆出的任务非常具体：

```
- [ ] T016 [US1] 在 AuthService 中实现 resetForgotPassword 方法并按手机号查询 Users
- [ ] T017 [US1] 在 AuthService resetForgotPassword 中校验账号可用状态和新旧密码不能相同
- [ ] T018 [US1] 在 AuthService resetForgotPassword 中使用 Argon2id 更新 password_hash、password_algorithm 和 updated_at
- [ ] T019 [US1] 在 AuthService resetForgotPassword 中清理密码缓存和用户预加载缓存
- [ ] T020 [US1] 在 AuthService resetForgotPassword 中调用 RefreshTokenRedisService 删除用户全部 Refresh Token
- [ ] T021 [US1] 在 auth-service AuthController 中新增 POST /auth/forgot-password/reset 内部认证接口
- [ ] T022 [US1] 在 backend AuthController 中新增 POST /auth/forgot-password/reset 前端入口并调用 AuthClientService
- [ ] T023 [US1] 在前端认证 API 中新增调用 backend 的 resetForgotPassword 请求方法
- [ ] T024 [US1] 将 ForgotPassword store 的 submitResetPassword 改为调用 resetForgotPassword API
- [ ] T025 [US1] 移除 ForgotPassword store 中重置密码时的 localStorage 验证码匹配逻辑
- [ ] T026 [US1] 调整 ForgotPassword 页面提交失败文案，避免把免校验阶段误提示为验证码错误
```

可以看到，这里不是简单地按“前端、后端”分组，而是围绕“用户故事可独立验收”来拆。

US1 完成后，就能验证：

```
已注册手机号可以重置密码
新密码可以登录
旧密码不能登录
前端入口是 backend
backend 调用 auth-service
```

## 八、Phase 4：US2，处理验证码未接入阶段

第二个用户故事是：

```
User Story 2 - 在验证码未接入阶段完成可用恢复流程
```

它来自 Clarify 阶段的一个关键澄清：

```
当前验证码能力未接入，暂不校验验证码；只要手机号和密码字段合法即可重置。
```

所以 tasks 里专门拆了一组任务：

```
- [ ] T027 [US2] 在 AuthService 中实现 sendForgotPasswordCode 模拟成功方法
- [ ] T028 [US2] 在 auth-service AuthController 中新增 POST /auth/forgot-password/send-code 内部认证接口
- [ ] T029 [US2] 在 backend AuthController 中新增 POST /auth/forgot-password/send-code 前端入口并调用 AuthClientService
- [ ] T030 [US2] 在前端认证 API 中新增调用 backend 的 sendForgotPasswordCode 请求方法
- [ ] T031 [US2] 将 ForgotPassword store 的 sendCode 改为调用 sendForgotPasswordCode API 并保留倒计时
- [ ] T032 [US2] 移除 ForgotPassword store 中发送验证码时写入 localStorage 的逻辑
- [ ] T033 [US2] 根据当前阶段免校验策略调整 ForgotPassword schema 中 code 字段规则
```

这组任务解决的是“验证码暂时没接入，但前端页面已经有获取验证码按钮”的问题。

它不会直接删除验证码 UI，而是保留页面交互，用模拟成功或友好提示保证流程不被阻断。

这就是 Tasks 阶段对 Clarify 结果的承接。

## 九、Phase 5：US3，处理安全和账号枚举保护

第三个用户故事是安全相关：

```
User Story 3 - 保护账号存在性和敏感信息
```

它的目标是：

```
忘记密码流程不向用户侧暴露手机号是否注册，不泄露密码、验证码、Token 或内部错误细节。
```

对应任务包括：

```
- [ ] T034 [US3] 在 AuthService 忘记密码流程中统一账号不存在和账号不可用的用户侧错误行为
- [ ] T035 [US3] 在 AuthService 忘记密码流程中增加脱敏安全日志且不记录明文密码、完整验证码或完整 Token
- [ ] T036 [US3] 在 backend AuthController 忘记密码代理中统一外部失败提示并隐藏 auth-service 内部错误细节
- [ ] T037 [US3] 在前端 ForgotPassword 页面统一重置失败提示，避免暴露账号存在性
- [ ] T038 [US3] 确认 logout 相关敏感日志不影响本功能并记录后续治理项
```

这类任务很容易在普通 AI 编码里被忽略。

如果只说“实现忘记密码”，AI 可能只写成功路径。

但 Tasks 阶段会把安全需求拆成明确任务，确保它不是一句口号，而是真正进入执行清单。

## 十、Phase 6：Polish，统一验证和收尾

最后一阶段是：

```
## Phase 6: Polish & Cross-Cutting Concerns
```

它处理跨用户故事的收尾和验证。

比如：

```
- [ ] T039 [P] 对照契约检查 backend 对前端接口路径、请求字段和响应字段
- [ ] T040 [P] 对照契约检查 auth-service 内部接口路径、请求字段和响应字段
- [ ] T041 [P] 对照 quickstart 执行并补充手工验收结果记录
- [ ] T042 在 services/auth-service 执行 npm run lint 并修复发现的问题
- [ ] T043 在 services/auth-service 执行 npm run build 并修复发现的问题
- [ ] T044 在 services/backend 执行 npm run lint 并修复发现的问题
- [ ] T045 在 services/backend 执行 npm run build 并修复发现的问题
- [ ] T046 在 apps/web 执行 npm run lint 并修复发现的问题
- [ ] T047 在 apps/web 执行 npx tsc --noEmit 并修复发现的问题
- [ ] T048 更新 quickstart 中最终验证结果、backend 中间层调用链和当前阶段验证码免校验风险提示
```

这一步不是锦上添花，而是质量闭环。

特别是本 feature 已经明确“不生成任务级单元测试”，那 lint/build/typecheck 和 quickstart 手工验收就更重要。

## 十一、Tasks 如何表达依赖关系？

`tasks.md` 里不仅有任务列表，还有依赖顺序。

忘记密码案例里的 Phase 依赖是：

```
Phase 1 Setup：无依赖，可立即开始
Phase 2 Foundational：依赖 Phase 1，阻塞所有用户故事
Phase 3 US1：依赖 Phase 2，是 MVP 主链路
Phase 4 US2：依赖 Phase 2，可与 US1 部分并行，但要注意同文件冲突
Phase 5 US3：依赖 Phase 2，建议在 US1 后进行
Phase 6 Polish：依赖目标用户故事完成
```

用户故事依赖是：

```
US1：MVP，可在 Phase 2 后独立实现
US2：可在 Phase 2 后独立实现，但与 US1 存在同文件协调
US3：依赖忘记密码服务方法和 backend 代理方法存在，以便统一错误和日志
```

这个依赖说明非常重要。

它能告诉执行者：

- 哪些任务必须先做

- 哪些任务可以并行

- 哪些任务虽然理论上可并行，但会改同一个文件，需要避免冲突

## 十二、[P] 标记：哪些任务可以并行？

在 tasks 中，`[P]` 表示可并行。

例如 Setup 阶段：

```
- [ ] T003 [P] 阅读并确认前端调用 backend 认证 API 的封装方式
- [ ] T004 [P] 阅读并确认忘记密码页面 store 当前 mock 行为
- [ ] T005 [P] 阅读并确认 backend 认证代理控制器风格
- [ ] T006 [P] 阅读并确认 backend 调用 auth-service 的 AuthClientService 封装
```

这些任务读取不同文件，不互相依赖，所以可以并行。

Foundation 阶段也有并行任务：

```
- [ ] T009 [P] 创建 auth-service 忘记密码通用响应 DTO
- [ ] T010 [P] 创建 backend 发送验证码请求 DTO
- [ ] T011 [P] 创建 backend 重置密码请求 DTO
- [ ] T012 [P] 创建 backend 忘记密码通用响应 DTO
```

因为它们创建的是不同文件，可以并行完成。

但像下面这些任务就不能随便并行：

```
修改 services/auth-service/src/auth/auth.service.ts
修改 services/backend/src/auth/auth.controller.ts
修改 apps/web/src/pages/ForgotPassword/useStore.ts
```

这些是热点文件，多个任务都可能修改它们，容易冲突。

Tasks 阶段会在 Parallel Team Strategy 中提醒这一点。

## 十三、Implementation Strategy：先做 MVP，再增量交付

忘记密码的 tasks 里还给出了实现策略。

### MVP First

```
1. 完成 Phase 1 和 Phase 2
2. 完成 Phase 3 的 US1 后暂停
3. 验证：前端调用 backend，backend 调用 auth-service；已注册手机号可重置密码，新密码可登录，旧密码不可登录
4. MVP 验证通过后再进入 US2/US3
```

这是一种很实用的交付方式。

先把最核心的“重置密码主链路”做通，再处理验证码模拟和安全增强。

### Incremental Delivery

```
1. Setup + Foundational：准备 DTO、错误码、前端 API 类型
2. US1：完成真实密码重置主链路
3. US2：完成验证码未接入阶段的模拟发送和免校验一致性
4. US3：完成账号枚举保护和敏感信息保护
5. Polish：执行 lint、build、typecheck 和 quickstart 手工验收
```

这让功能可以分阶段验收，而不是等所有任务堆在一起最后才发现问题。

## 十四、Tasks 阶段最容易踩的坑

### 1. 任务太大，不可执行

不好的任务：

```
- [ ] 实现忘记密码功能
```

好的任务：

```
- [ ] 在 AuthService 中实现 resetForgotPassword 方法并按手机号查询 Users in services/auth-service/src/auth/auth.service.ts
```

差别在于：后者明确到文件和动作，可以直接执行。

### 2. 没有先拆基础任务

如果不先拆 DTO、错误码、响应类型，后面写业务时就会边写边补，任务依赖会变混乱。

所以 Foundation 阶段很重要。

### 3. 没有按用户故事拆分

如果只按“前端任务、后端任务”拆，很容易出现一个故事做不完整。

更好的方式是围绕用户价值拆：

- US1：能重置密码

- US2：验证码未接入也不阻断

- US3：保护账号存在性和敏感信息

这样每个故事都能独立验收。

### 4. 忽略验证任务

实现任务写完不代表功能完成。

忘记密码这种功能，最后必须有：

- 契约检查

- lint

- build

- typecheck

- quickstart 手工验收

- 风险提示更新

## 十五、总结

`/speckit-tasks` 的本质是：

把技术方案拆成有顺序、有依赖、可并行、可验收的执行清单。

它通常会做几件事：

```
读取 spec/plan/research/data-model/contracts/quickstart
 ↓
拆出 Setup 阶段
 ↓
拆出 Foundational 基础任务
 ↓
按 User Story 拆实现任务
 ↓
补充依赖关系和并行机会
 ↓
补充验证与收尾任务
```

在我的忘记密码案例里，`tasks.md` 最终拆出了：

- Setup：先阅读和确认现有结构

- Foundational：创建 DTO、错误码、前端 API 类型

- US1：完成手机号重置密码 MVP 主链路

- US2：完成验证码未接入阶段的模拟发送和免校验一致性

- US3：完成账号枚举保护和敏感信息保护

- Polish：契约核对、lint/build/typecheck、quickstart 手工验收

这一步之后，AI 或开发者就不需要再猜“下一步该做什么”。

下一篇我会继续讲 `/speckit-implement`：当任务清单已经生成后，Spec-Kit 是如何按任务真正落地代码的。
