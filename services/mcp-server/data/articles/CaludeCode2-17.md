---
title: Spec-Kit Specify 是怎么把一句需求变成规格文档的？
slug: spec-kit-specify-requirements-document
date: 2026-06-05
tags: [Claude Code, AI编程, Spec-Kit]
---

# Spec-Kit Specify 是怎么把一句需求变成规格文档的？

上一篇我简单介绍了 Spec-Kit 的整体流程：`specify → clarify → plan → tasks → implement`。

这一篇开始拆第一个命令：`/speckit-specify`。它是整个 Spec-Kit 工作流的起点，负责把一句自然语言需求，转换成结构化的 `spec.md` 规格文档。

## 一、Specify 在整个流程里的位置

Spec-Kit 的完整链路大概是：

```
Specify → Clarify → Plan → Tasks → Implement
```

`Specify` 是第一步。

它的核心职责不是写代码，也不是设计技术方案，而是先回答一个问题：

用户到底想要什么？

所以 `/speckit-specify` 的产物是 `spec.md`，也就是需求规格说明书。

可以简单理解为：

```
一句话需求
 ↓
/speckit-specify
 ↓
spec.md
```

这个 `spec.md` 会成为后续 `plan.md`、`tasks.md` 和代码实现的基础。

如果 `spec.md` 方向错了，后面所有阶段都会跟着错。

## 二、Specify 不关心怎么实现

这是我理解 Specify 时最重要的一点：

`spec.md` 只描述 WHAT 和 WHY，不描述 HOW。

也就是说，它重点关注：

- 要做什么功能？

- 用户为什么需要它？

- 用户怎么使用它？

- 什么情况算完成？

- 有哪些边界情况？

它不应该一上来就写：

- 用哪个 Controller

- 建什么数据库表

- 调哪个接口

- 用什么框架实现

这些属于后面的 `plan` 阶段。

比如我的需求是：

```
我想实现忘记密码功能。
前端页面已经实现，位置：apps/web/src/pages/ForgotPassword/index.tsx。
授权微服务：services/auth-service。
业务微服务：services/backend。
中文描述。
```

`Specify` 不会直接开始改 `auth-service` 或 `backend`，而是先生成一份“忘记密码”规格文档。

## 三、Specify 执行时大概做了什么？

一次 `/speckit-specify` 大概会经历这些步骤：

```
读取用户需求
 ↓
生成特性简称
 ↓
创建规格目录
 ↓
加载 spec 模板
 ↓
填充用户故事、需求、边界、成功标准
 ↓
生成质量检查清单
 ↓
输出 spec.md
```

下面用我的“忘记密码”功能举例说明。

## 四、第一步：读取用户需求

我输入的需求大概是：

```
我想实现忘记密码功能。
前端的页面已经实现，具体位置：apps/web/src/pages/ForgotPassword/index.tsx。
授权微服务：services/auth-service。
业务微服务：services/backend。
中文描述。
```

这里面包含了几类信息：

| 信息         | 内容                                          |
| ------------ | --------------------------------------------- |
| 功能目标     | 实现忘记密码功能                              |
| 已有前端页面 | `apps/web/src/pages/ForgotPassword/index.tsx` |
| 认证服务     | `services/auth-service`                       |
| 业务服务     | `services/backend`                            |
| 文档语言     | 中文描述                                      |

但在 Specify 阶段，这些信息不会马上变成代码，而是先被整理成规格文档。

## 五、第二步：生成特性目录

Spec-Kit 会根据需求生成一个特性目录。

我这个案例生成的是：

```
specs/20260605-104356-forgot-password/
```

目录里后续会逐步出现这些文件：

```
specs/20260605-104356-forgot-password/
├── spec.md
├── checklists/
│ └── requirements.md
├── plan.md
├── tasks.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
 └── forgot-password-api.md
```

其中 Specify 阶段最关键的是：

```
spec.md
checklists/requirements.md
```

`spec.md` 是需求规格本体。

`requirements.md` 是规格质量检查清单。

## 六、第三步：填充 spec.md

`spec.md` 通常会包含几个核心部分：

```
Feature Specification
├── Clarifications
├── User Scenarios & Testing
├── Edge Cases
├── Requirements
├── Key Entities
├── Success Criteria
└── Assumptions
```

以“忘记密码”为例，最终生成的标题是：

```
# Feature Specification: 忘记密码
```

并记录了原始输入：

```
**Input**: User description: "我想实现忘记密码功能..."
```

这一步的意义是：后面所有讨论都能追溯到最初的需求来源。

## 七、Specify 如何生成用户故事？

用户故事是 `spec.md` 里非常关键的一部分。

在我的案例里，`Specify` 把“忘记密码”拆成了 3 个用户故事：

```
User Story 1 - 通过手机号重置密码 P1
User Story 2 - 在验证码未接入阶段完成可用恢复流程 P2
User Story 3 - 保护账号存在性和敏感信息 P3
```

### P1：通过手机号重置密码

这是主流程。

规格里是这样描述的：

```
作为忘记密码的用户，
我希望可以使用已绑定的手机号并设置一个新密码，
以便无需联系客服即可重新登录自己的账号。
```

它还会生成验收场景，比如：

```
Given 用户拥有一个已注册账号，
When 用户提交手机号、有效新密码和一致的确认密码，
Then 系统成功重置密码并引导用户返回登录。
```

这就比一句“做忘记密码功能”清楚很多。

因为它明确了：

- 用户是谁

- 用户想做什么

- 成功后应该发生什么

- 如何验证这个功能是否完成

## 八、Specify 如何补充边界情况？

除了主流程，`Specify` 还会整理 Edge Cases。

例如我的忘记密码规格里，边界情况包括：

```
- 手机号为空、位数不足、超过 11 位或包含非数字字符
- 手机号格式正确但未绑定任何有效账号
- 新密码与确认密码不一致
- 新密码不满足既有密码长度或复杂度规则
- 新密码与当前密码相同
- 密码重置成功后，用户在其他设备仍存在登录态
- 用户刷新页面、关闭页面或网络中断后重新进入忘记密码流程
```

这些内容很重要。

因为真实开发中，很多问题不是主流程没写，而是边界情况没想清楚。

`Specify` 的价值就在于，它会提醒你在写代码前先把这些情况列出来。

## 九、Specify 如何生成 Functional Requirements？

用户故事偏业务表达，Functional Requirements 则是更明确的功能需求。

在我的案例中，生成了类似这样的需求：

```
- FR-001: 用户 MUST 能够通过手机号进入忘记密码流程。
- FR-002: 系统 MUST 在处理重置请求前校验手机号为 11 位数字格式。
- FR-003: 系统 MUST 对忘记密码流程返回通用用户提示，避免直接暴露手机号是否已注册。
- FR-010: 用户 MUST 能够提交手机号、新密码和确认密码完成密码重置。
- FR-011: 系统 MUST 在重置前校验新密码与确认密码一致。
- FR-014: 密码重置成功后，系统 MUST 允许用户使用新密码登录，并拒绝旧密码登录。
- FR-020: 忘记密码前端入口 MUST 只调用 backend 暴露的接口，由 backend 作为中间层调用 auth-service 完成认证领域处理。
```

这些 `FR-xxx` 编号很有用。

后面生成 `plan.md` 和 `tasks.md` 时，就可以围绕这些需求展开。

比如：

- `FR-002` 会影响参数校验

- `FR-011` 会影响前后端表单规则

- `FR-014` 会影响登录验证

- `FR-020` 会影响服务调用边界

这样需求就不再是散乱的一段话，而是可以被追踪的需求项。

## 十、Specify 如何定义成功标准？

`Success Criteria` 用来回答：

这个功能怎样才算真的做好？

在忘记密码案例里，生成了这些可衡量标准：

```
- SC-001: 至少 95% 拥有已绑定手机号的合法用户，可以在 3 分钟内完成密码重置。
- SC-002: 在测试账号中，100% 的成功重置场景都能使用新密码登录，且旧密码登录失败。
- SC-003: 当前阶段 100% 的成功重置场景不依赖真实验证码发送或验证码校验。
- SC-004: 100% 的未注册手机号找回请求不会在用户侧直接暴露手机号是否已注册。
```

这里有一个细节：

成功标准应该尽量可衡量，而不是写成“体验好”“性能不错”“安全可靠”。

比如：

```
不好：用户可以很快完成密码重置
更好：用户可以在 3 分钟内完成密码重置
```

这就是 `Specify` 阶段希望达到的效果：让需求变得可验证。

## 十一、Specify 也会生成质量检查清单

除了 `spec.md`，`Specify` 还会生成：

```
checklists/requirements.md
```

它用来检查这份规格是否合格。

我的案例里检查项包括：

```
- [x] No implementation details
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
```

这一步相当于给 `spec.md` 加了一道质量门禁。

如果需求还有明显不清楚的地方，就不应该急着进入 `plan`。

## 十二、Specify 和 Clarify 的关系

很多人容易把 `specify` 和 `clarify` 混在一起。

我的理解是：

```
specify：先生成一版结构化规格
clarify：再补充澄清不明确的地方
```

比如我的忘记密码案例里，后面通过 Clarify 补充了几个关键问题：

```
Q: 目前验证码能力未接入时，重置密码流程应如何处理验证码？
A: 暂不校验验证码；只要手机号和密码字段合法即可重置。

Q: 忘记密码流程中前端应直接调用哪个后端服务？
A: 前端只调用 backend；backend 作为中间层调用 auth-service 完成认证能力。

Q: 忘记密码任务清单是否需要生成单元测试任务？
A: 不需要任务单元测试；以 lint/build/typecheck 和 quickstart 手工验收为主。
```

这些问题如果不澄清，后面的技术方案就会出现分歧。

比如“验证码未接入时怎么办”，会直接影响：

- API 行为

- 前端交互

- 验收方式

- 后续接入真实验证码的边界

所以 Specify 负责先搭骨架，Clarify 负责把不确定的地方补上。

## 十三、Specify 阶段最容易踩的坑

### 1. 把实现细节写进 spec

比如在 `spec.md` 里直接写：

```
使用 NestJS Controller 实现 POST /forgot-password/reset
```

这就有点提前进入实现层了。

更适合放在 `spec.md` 里的表达是：

```
用户必须能够提交手机号、新密码和确认密码完成密码重置。
```

至于接口怎么设计，应该留给 `plan` 阶段。

### 2. 只写主流程，不写边界

很多需求看起来简单，是因为只看了正常路径。

忘记密码这个功能如果只写“输入手机号和新密码完成重置”，就会漏掉很多问题：

- 手机号不存在怎么办？

- 新旧密码相同怎么办？

- 验证码能力没接入怎么办？

- 重置成功后旧会话怎么办？

- 错误提示会不会暴露账号存在性？

这些都应该在 Specify 阶段先暴露出来。

### 3. 成功标准不可衡量

不要只写：

```
用户可以顺利找回密码。
```

更好的方式是：

```
至少 95% 拥有已绑定手机号的合法用户，可以在 3 分钟内完成密码重置。
```

可衡量，后面才好验收。

## 十四、总结

`/speckit-specify` 的本质，是把一句模糊需求变成结构化规格。

它不会直接写代码，而是先生成：

```
spec.md
requirements.md
```

其中：

| 文件              | 作用                                       |
| ----------------- | ------------------------------------------ |
| `spec.md`         | 描述用户故事、功能需求、边界情况、成功标准 |
| `requirements.md` | 检查规格是否完整、清晰、可验证             |

在我的忘记密码案例里，Specify 把一句“我想实现忘记密码功能”，整理成了：

- 3 个用户故事

- 12 条边界情况

- 21 条功能需求

- 4 个关键实体

- 6 条成功标准

- 一份质量检查清单

这就是 Specify 的价值：

先把需求说明白，再进入技术设计和编码。

下一篇我会继续讲 `/speckit-clarify`：当 `spec.md` 里还有不确定问题时，Spec-Kit 是如何通过提问把需求补齐的。
