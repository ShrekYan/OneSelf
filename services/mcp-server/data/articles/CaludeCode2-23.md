---
title: Spec-Kit 和 Claude Code 配置到底怎么分工？
slug: spec-kit-claude-code-configuration-division
date: 2026-06-05
tags: [Claude Code, AI编程, Spec-Kit]
---

# Spec-Kit 和 Claude Code 配置到底怎么分工？

使用 Spec-Kit 一段时间后，很容易产生一个疑问：

既然 Spec-Kit 已经能生成 `spec.md`、`plan.md`、`tasks.md`，那项目里的 `CLAUDE.md`、`.claude/rules`、`.claude/agents`、`.claude/skills` 还有必要吗？

答案是：**有必要，而且二者不是替代关系。**

更准确地说：

**Spec-Kit 管当前 feature 怎么推进，constitution 管 Spec-Kit 的硬规则，`.claude` 管 Claude 在项目里长期怎么干活。**

这篇文章就把三者的关系讲清楚。

## 先给结论

可以先用一句话理解：

**Spec-Kit 是每个功能的施工图，`.claude` 是整个项目的施工规范。**

再拆开一点：

| 对象                              | 主要职责                                             | 生命周期          |
| --------------------------------- | ---------------------------------------------------- | ----------------- |
| `spec.md / plan.md / tasks.md`    | 描述当前 feature 的需求、技术方案、任务拆分          | 单个 feature 周期 |
| `.specify/memory/constitution.md` | 约束 Spec-Kit 规划阶段是否合规                       | 项目长期有效      |
| `CLAUDE.md / .claude/*`           | 约束 Claude Code 实际写代码、用工具、调 Agent 的行为 | 项目长期有效      |

也就是说：

- Spec-Kit 解决的是：**这次功能要做什么、怎么拆、怎么验收**。

- Constitution 解决的是：**这次功能的规格和计划是否符合项目原则**。

- `.claude` 解决的是：**Claude 真正执行时应该怎么写代码、怎么操作项目**。

## 为什么它们容易被混淆？

因为它们看起来都在“约束 Claude”。

比如一个忘记密码功能，Spec-Kit 里可能会出现：

```
specs/20260605-104356-forgot-password/
├── spec.md
├── plan.md
├── tasks.md
├── research.md
├── data-model.md
├── contracts/
└── quickstart.md
```

同时，项目里又有：

```
CLAUDE.md
.claude/rules/
.claude/agents/
.claude/skills/
.specify/memory/constitution.md
```

表面上看，它们都在告诉 Claude：

- 不能把 Token 存到 localStorage。

- 后端要遵守 NestJS 分层。

- TypeScript 要避免 `any`。

- 要执行 lint 和类型检查。

- 当前 feature 不要写单元测试。

但这些规则的层级不同。

有些是**当前功能的临时约束**，有些是**项目长期规范**，还有些是**Spec-Kit 规划阶段的门禁**。

如果不区分，很容易把一次 feature 的特殊要求写成全局规则，或者把项目级安全红线只写在某个 `plan.md` 里。

## Spec-Kit 管什么？

Spec-Kit 管的是**当前 feature 的开发流程**。

典型流程是：

```
/speckit-specify
 ↓
spec.md
 ↓
/speckit-clarify
 ↓
补充澄清需求
 ↓
/speckit-plan
 ↓
plan.md / research.md / data-model.md / contracts / quickstart.md
 ↓
/speckit-tasks
 ↓
tasks.md
 ↓
/speckit-implement
 ↓
按任务落地代码
```

它主要回答这些问题：

- 这个 feature 的用户价值是什么？

- 用户故事有哪些？

- 功能边界是什么？

- 哪些事情不做？

- 技术方案怎么设计？

- 任务怎么拆？

- 如何验收？

以当前项目的忘记密码功能为例，Spec-Kit 明确了这些当前 feature 的信息：

- 前端页面已存在：`apps/web/src/pages/ForgotPassword/index.tsx`。

- 前端只调用 `services/backend`。

- `services/backend` 作为中间层调用 `services/auth-service`。

- 当前阶段验证码能力未接入，重置密码暂不校验验证码。

- 本次任务不生成单元测试任务。

- 验证方式以 lint、build、typecheck 和 quickstart 手工验收为主。

这些内容都是**这一次功能的上下文**，不应该直接上升为全项目永久规则。

比如：

“当前忘记密码功能不写单元测试”只对这个 feature 有效，不能变成“整个项目以后都不用写测试”。

## `.specify/memory/constitution.md` 管什么？

`.specify/memory/constitution.md` 是 Spec-Kit 的项目宪法。

它不是具体 feature 的需求文档，而是 Spec-Kit 在规划阶段的治理规则。

可以理解为：

```
Spec-Kit 宪法 = 规划前置门禁
```

它主要关心：

- 一个 feature 在开工前是否有清晰需求？

- 是否有验收标准？

- 是否明确了边界和 Non-Goals？

- 涉及接口时是否有契约？

- 涉及数据结构时是否有数据模型？

- 计划是否符合项目安全、类型、架构边界？

- 如果违反原则，是否记录了例外原因？

在这个项目里，constitution 定义了 7 条核心原则：

1. 类型安全优先

2. 默认安全

3. 清晰架构边界

4. 最小变更与优先复用

5. 规格与契约驱动

6. 验证门禁

7. 一致性与格式规范

所以在 `/speckit-plan` 阶段，`plan.md` 里会有 Constitution Check，用来确认当前方案是否违反项目宪法。

比如忘记密码功能里，plan 需要考虑：

- 密码哈希是否使用 Argon2id。

- 是否避免泄露手机号是否已注册。

- 是否不返回明文密码、Token、内部错误细节。

- 前端是否只调用 backend，不越过服务边界直连 auth-service。

- 不写单元测试是否已经在当前 feature plan 中说明。

这些不是某个实现文件里的代码细节，而是 feature 在进入实现前必须过的规划门禁。

## `.claude` 管什么？

`.claude` 管的是 Claude Code 的实际执行行为。

可以理解为：

```
Claude Code 规则 = AI 工程师的工作手册
```

常见内容包括：

```
CLAUDE.md
.claude/rules/*.md
.claude/agents/*.md
.claude/skills/*.md
.claude/DECISIONS.md
.claude/FRONTEND-DECISIONS.md
.claude/BACKEND-BUSINESS-DECISIONS.md
```

它主要回答这些问题：

- Claude 修改文件前应该怎么读文件？

- 写 TypeScript 时有哪些强制规范？

- 前端页面应该如何拆分？

- MobX 应该用 `useObserver` 还是 `observer()`？

- API 请求是否必须走项目封装？

- Token 能不能放 localStorage？

- 后端 Controller、Service、DTO 如何组织？

- 什么时候应该调用前端 Agent、后端 Agent、安全审查 Agent？

- 提交、验证、运行命令时有哪些约束？

例如本项目的 `.claude` 规则会约束：

- 前端使用 React 19 + Vite + TypeScript + MobX。

- 状态管理遵守 MobX 双轨架构和 `useObserver` 约定。

- 页面遵守 `index/useStore/handle/constant/types` 拆分模式。

- 样式使用 SCSS Modules。

- API 认证使用 HttpOnly Cookie。

- 禁止 Token 存入 `localStorage` 或 `sessionStorage`。

- 后端遵守 NestJS Controller / Service / Module 分层。

- DTO 需要明确校验。

- Prisma 模型使用 PascalCase。

- 日志中不能输出完整 Token、密码、验证码等敏感信息。

这些规则会在 Claude 真正写代码时发挥作用。

## 不同阶段，谁的影响更强？

Spec-Kit 和 `.claude` 并不是每个阶段影响都一样。

可以按阶段理解。

| 阶段                  | 主要产物             | `.claude` 影响 | constitution 影响 | 说明                                            |
| --------------------- | -------------------- | -------------- | ----------------- | ----------------------------------------------- |
| `/speckit-specify`    | `spec.md`            | 较弱           | 较弱              | 主要描述 WHAT / WHY，不展开实现方案             |
| `/speckit-clarify`    | 更新 `spec.md`       | 较弱           | 较弱              | 主要澄清需求模糊点                              |
| `/speckit-plan`       | `plan.md` 等设计文档 | 中等           | 强                | 显式做 Constitution Check，同时受项目上下文影响 |
| `/speckit-tasks`      | `tasks.md`           | 中等           | 中等              | 根据 plan/spec/design docs 拆任务               |
| `/speckit-implement`  | 源码变更             | 强             | 中等              | 真正写代码时必须遵守 `.claude` 规则             |
| 普通 Claude Code 开发 | 源码变更             | 强             | 视情况            | 主要按 `CLAUDE.md` 和 `.claude/rules` 执行      |

这里有一个关键点：

`/speckit-plan` 会受 `.claude` 项目规则影响，但不能简单理解为它会自动逐个读取所有 `.claude` 文件。

更准确的说法是：

- `/speckit-plan` 显式依赖的是 `spec.md`、`.specify/memory/constitution.md`、plan template 和代码上下文。

- `.claude` 规则会通过当前 Claude Code 会话的项目上下文产生影响。

- 如果某条规则必须稳定影响每一次 plan，最好同步到 constitution。

比如：

- “认证必须使用 HttpOnly Cookie”是项目安全硬规则，适合写入 constitution。

- “前端组件根容器 class 命名为 `xxxContainer`”是具体实现规范，适合放在 `.claude/rules`。

- “本次忘记密码不写单元测试”是当前 feature 约束，适合写在当前 `plan.md` 或 `tasks.md`。

## 一个实际例子：忘记密码功能

假设我们要实现“忘记密码”。

### Spec-Kit 会关心什么？

在 `spec.md` 中，它关心的是用户需求：

- 用户能通过手机号进入忘记密码流程。

- 用户能提交手机号、新密码和确认密码完成重置。

- 当前阶段验证码未接入时，不校验验证码。

- 重置成功后，新密码可以登录，旧密码不能登录。

- 未注册手机号不能在用户侧直接暴露是否存在。

在 `plan.md` 中，它进一步设计技术方案：

- 前端只调用 backend。

- backend 调用 auth-service。

- auth-service 更新密码哈希。

- 重置后使已有 Refresh Token 失效。

- 验证方式使用 lint、build、typecheck 和 quickstart。

在 `tasks.md` 中，它拆成可执行任务：

- 新增 DTO。

- 新增 backend 转发接口。

- 新增 auth-service 重置密码接口。

- 修改前端 store，接入真实 API。

- 执行 quickstart 验证。

这些都是当前 feature 的推进路径。

### Constitution 会关心什么？

Constitution 会检查这个方案是否符合项目原则：

- 类型是否明确？

- 是否避免 `any`？

- 是否使用 Argon2id？

- 是否避免账户枚举？

- 是否保持 auth-service / backend 的服务边界？

- 是否没有把“本次不写测试”变成全项目规则？

- 如果跳过验证码校验，是否明确这是当前阶段临时范围？

它关注的是：**开工前方向是否正确**。

### `.claude` 会关心什么？

真正实现时，`.claude` 会继续约束代码写法：

- 前端 API 是否走统一封装。

- 前端是否没有把 Token 存到 localStorage。

- TypeScript 函数参数和返回值是否显式声明。

- 后端 DTO 是否使用 class-validator 校验。

- Service 是否不直接暴露数据库原始错误。

- 日志是否没有输出完整验证码、密码、Token。

- 修改完成后是否在对应子项目执行 lint/build/typecheck。

它关注的是：**开工后执行是否正确**。

## 规则冲突时听谁的？

可以粗略按下面顺序理解：

```
用户当前明确指令
 ↓
当前 feature 的 spec / plan / tasks / contracts
 ↓
.specify/memory/constitution.md
 ↓
CLAUDE.md / .claude 项目规则
 ↓
Claude 默认习惯
```

但实际还要看冲突类型。

### 1. 当前 feature 范围问题

如果用户明确说：

```
本次不需要任务级单元测试
```

并且这个要求已经写进当前 feature 的 `plan.md` 和 `tasks.md`，那本次就不要生成单元测试任务。

即使 `.claude` 里有测试规范，也只是说明“需要写测试时应该怎么写”，不代表每个 feature 都必须写测试。

### 2. 安全底线问题

如果某个需求暗示：

```
把 accessToken 存到 localStorage
```

即使当前 spec 没有写清楚，Claude Code 也应该依据安全规则阻止这种实现。

因为这是项目级安全红线。

### 3. 长期治理问题

如果团队要求：

```
所有非平凡 feature 必须先有 spec、plan、tasks，再进入实现
```

这种规则适合放在 constitution 中，作为 Spec-Kit 工作流的长期门禁。

## 规则应该放哪里？

可以用三个问题判断。

### 1. 是否只对当前 feature 有效？

如果是，放在当前 Spec-Kit 产物里：

```
spec.md
plan.md
tasks.md
contracts/
quickstart.md
```

例如：

- 本次忘记密码暂不校验验证码。

- 本次不新增验证码存储表。

- 本次不写任务级单元测试。

- 本次前端页面已存在，只接入 API。

### 2. 是否是所有 feature 在规划阶段都要遵守？

如果是，放在：

```
.specify/memory/constitution.md
```

例如：

- 非平凡功能必须先 spec、plan、tasks。

- API 或跨系统数据结构必须有 contracts。

- 计划阶段必须做 Constitution Check。

- 安全相关功能必须说明风险和防护策略。

- 例外必须写入 Complexity Tracking。

### 3. 是否是 Claude 写代码和执行操作时必须遵守？

如果是，放在：

```
CLAUDE.md
.claude/rules/
.claude/agents/
.claude/skills/
```

例如：

- TypeScript 禁止不必要的 `any`。

- 前端使用 `@/` 别名。

- 页面遵守固定拆分模式。

- MobX 使用 `useObserver`。

- 后端 DTO 必须校验。

- 禁止 Token 存 localStorage。

- 修改文件前先读取文件。

- 前端开发任务自动调用 `frontend-developer` Agent。

## 最佳实践

### 1. 不要把一次 feature 的临时规则写进 `.claude`

比如：

```
当前阶段验证码不校验
```

这是忘记密码 feature 的临时约束，不应该写成项目长期规则。

应该写在当前 `spec.md`、`plan.md` 或 `tasks.md` 中。

### 2. 不要把具体编码细节塞进 constitution

比如：

```
组件根容器 class 必须叫 xxxContainer
```

这是很具体的前端实现规范，更适合放在 `.claude/rules/frontend-components.md`。

constitution 应该保持高层、稳定、流程化。

### 3. 关键安全和架构硬规则可以同步到 constitution

比如：

- Token 使用 HttpOnly Cookie。

- 密码哈希使用 Argon2id。

- 后端服务之间通过 API 通信，不直接共享数据库。

- 共享包不能承载业务流程。

这些规则会影响 feature 的 plan 是否合规，适合进入 constitution。

### 4. `.claude` 保持具体、可执行

`.claude` 适合沉淀更详细的执行规范：

- 技术栈细节。

- 目录结构约定。

- 编码规范。

- Agent 自动触发规则。

- 验证命令。

- 踩坑经验。

它的价值不是替代 Spec-Kit，而是保证每个 feature 真正落地时都符合项目长期规范。

## 最后总结

Spec-Kit、constitution 和 `.claude` 的关系可以这样记：

```
spec.md / plan.md / tasks.md
= 当前 feature 的需求、方案和任务

.specify/memory/constitution.md
= Spec-Kit 规划阶段的项目宪法

CLAUDE.md / .claude/*
= Claude Code 实现阶段的项目工作手册
```

再压缩成一句话：

**Spec-Kit 保证当前 feature 推进清楚，constitution 保证开工前方向正确，`.claude` 保证开工后执行正确。**

所以它们不是三选一，而是分层协作：

- 当前 feature 的特殊要求，写进 Spec-Kit 产物。

- 全项目规划门禁，写进 constitution。

- 具体编码、工具、Agent、执行规范，写进 `.claude`。

这样 Claude 不仅知道“这次要做什么”，也知道“在这个项目里应该怎么正确地做”。
