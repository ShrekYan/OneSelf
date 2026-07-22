---
title: Spec-Kit Implement 是怎么按任务清单真正落地代码的？
slug: spec-kit-implement-code-execution
date: 2026-06-05
tags: [Claude Code, AI编程, Spec-Kit]
---

# Spec-Kit Implement 是怎么按任务清单真正落地代码的？

前面几篇已经讲完了 Spec-Kit 的前四个阶段：

- `/speckit-specify`：把需求变成规格

- `/speckit-clarify`：把模糊点问清楚

- `/speckit-plan`：把规格变成技术方案

- `/speckit-tasks`：把技术方案拆成任务清单

这一篇讲最后一步：`/speckit-implement`。

这是整个流程里唯一真正开始修改源代码的阶段。

## 一、Implement 在整个流程里的位置

Spec-Kit 的完整链路是：

```
Specify → Clarify → Plan → Tasks → Implement
```

前四步本质上都在生成文档：

```
spec.md
plan.md
research.md
data-model.md
contracts/
quickstart.md
tasks.md
```

到了 `Implement`，才开始真正写代码。

可以简单理解为：

```
tasks.md
 ↓
/speckit-implement
 ↓
实际代码修改
```

如果前面几个阶段是“画图纸”，那 Implement 就是“按图纸施工”。

## 二、Implement 不是让 AI 自由发挥

这是我觉得最重要的一点。

`/speckit-implement` 并不是让 AI 重新理解需求，然后自由写代码。

它应该严格参考前面生成的文档：

| 文件            | 在 Implement 阶段的作用                |
| --------------- | -------------------------------------- |
| `tasks.md`      | 告诉 AI 先做什么、后做什么、改哪些文件 |
| `plan.md`       | 告诉 AI 技术方案、架构边界和项目结构   |
| `data-model.md` | 告诉 AI 数据结构、请求字段、状态变化   |
| `contracts/`    | 告诉 AI 接口路径、请求响应和错误行为   |
| `quickstart.md` | 告诉 AI 最终怎么验收                   |
| `research.md`   | 告诉 AI 为什么选择这个方案             |
| `spec.md`       | 作为需求兜底，解决歧义时回查           |

也就是说，Implement 是“文档驱动编码”。

如果最终代码跑偏，通常不是 Implement 本身的问题，而是上游文档没有写清楚。

## 三、执行前会先做哪些检查？

在真正开始写代码前，Implement 会先做一些前置检查。

常见包括：

```
读取 tasks.md
读取 plan.md
读取 spec.md
检查 checklists 是否完成
检查 before_implement hooks
加载 data-model / contracts / quickstart / research
```

如果缺少 `tasks.md`，就说明还没拆任务，不应该直接实现。

如果 `plan.md` 缺失，就说明技术方案还没生成，也不应该实现。

如果 `checklists` 里还有未完成项，通常会提示用户确认是否继续。

这个设计可以避免 AI 在文档不完整的情况下贸然改代码。

## 四、Implement 会按什么顺序执行？

核心执行顺序来自 `tasks.md`。

在我的忘记密码案例里，`tasks.md` 被拆成了 6 个阶段：

```
Phase 1: Setup
Phase 2: Foundational
Phase 3: US1 - 通过手机号重置密码
Phase 4: US2 - 验证码未接入阶段可用恢复流程
Phase 5: US3 - 保护账号存在性和敏感信息
Phase 6: Polish & Cross-Cutting Concerns
```

Implement 会按 Phase 顺序推进。

大致是：

```
先读现有代码
 ↓
再准备 DTO、类型、错误码等基础设施
 ↓
实现 US1 主链路
 ↓
实现 US2 验证码免校验流程
 ↓
实现 US3 安全保护
 ↓
最后做契约核对和验证
```

这就是任务清单的价值：让 AI 不再“想到哪写到哪”。

## 五、案例：忘记密码功能的 Implement 执行思路

这个案例的目标是实现忘记密码功能。

前面文档已经明确：

```
前端只调用 services/backend
backend 作为中间层调用 services/auth-service
auth-service 是认证事实源
当前阶段验证码未接入，重置密码不校验验证码
新密码使用 Argon2id
重置成功后 Refresh Token 失效
不生成任务级单元测试，以 lint/build/typecheck 和 quickstart 手工验收为主
```

所以 Implement 阶段不需要再重新发明方案。

它只需要按 `tasks.md` 执行。

## 六、Phase 1：先读现有代码，而不是马上写

忘记密码任务的 Phase 1 是 Setup。

它包含这些任务：

```
- [ ] T001 阅读并确认 auth-service 认证接口现有风格
- [ ] T002 阅读并确认 auth-service 现有密码哈希、缓存和 Token 处理
- [ ] T003 [P] 阅读并确认前端调用 backend 认证 API 的封装方式
- [ ] T004 [P] 阅读并确认忘记密码页面 store 当前 mock 行为
- [ ] T005 [P] 阅读并确认 backend 认证代理控制器风格
- [ ] T006 [P] 阅读并确认 backend 调用 auth-service 的 AuthClientService 封装
```

这一步不写代码，只读代码。

为什么重要？

因为 AI 如果不先看现有实现，很容易：

- 新建一套和项目风格不一致的接口

- 绕过已有 AuthClientService

- 重复实现密码校验逻辑

- 破坏现有前端页面拆分结构

- 忽略已有缓存和 Token 处理能力

所以 Implement 第一阶段应该是“理解现有代码”。

## 七、Phase 2：先补基础设施

第二阶段是 Foundational。

它会先创建所有用户故事共享的基础能力：

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

这一步相当于先铺路。

DTO、错误码、响应类型、前端 API 类型都准备好后，后面的业务逻辑才有稳定基础。

这也符合一个基本原则：

先搭结构，再写流程。

## 八、Phase 3：先实现 US1 主链路

US1 是 MVP：通过手机号重置密码。

核心任务包括：

```
- [ ] T016 在 AuthService 中实现 resetForgotPassword 方法并按手机号查询 Users
- [ ] T017 校验账号可用状态和新旧密码不能相同
- [ ] T018 使用 Argon2id 更新 password_hash、password_algorithm 和 updated_at
- [ ] T019 清理密码缓存和用户预加载缓存
- [ ] T020 删除用户全部 Refresh Token
- [ ] T021 在 auth-service AuthController 中新增 reset 内部认证接口
- [ ] T022 在 backend AuthController 中新增 reset 前端入口并调用 AuthClientService
- [ ] T023 在前端认证 API 中新增 resetForgotPassword 请求方法
- [ ] T024 将 ForgotPassword store 的 submitResetPassword 改为调用真实 API
- [ ] T025 移除 localStorage 验证码匹配逻辑
- [ ] T026 调整提交失败文案，避免误提示为验证码错误
```

这里可以看到 Implement 的执行顺序非常清楚：

```
auth-service 事实源逻辑
 ↓
auth-service Controller
 ↓
backend 代理入口
 ↓
前端 API
 ↓
前端 store/page 接入
```

这不是随机顺序。

它来自 `tasks.md` 的依赖规则：

```
DTO 和类型先于 Controller/Service 使用
auth-service 认证事实源逻辑先于 backend 代理入口
backend 代理入口先于前端 store 接入
```

这样执行可以避免前端先接了一个还不存在的接口，也避免 backend 调用一个还没实现的 auth-service 能力。

## 九、Phase 4：实现验证码未接入阶段的兼容流程

US2 来自前面 Clarify 的澄清：

```
当前阶段验证码能力未接入，重置密码时暂不校验验证码。
```

对应任务包括：

```
- [ ] T027 在 AuthService 中实现 sendForgotPasswordCode 模拟成功方法
- [ ] T028 在 auth-service AuthController 中新增 send-code 内部认证接口
- [ ] T029 在 backend AuthController 中新增 send-code 前端入口并调用 AuthClientService
- [ ] T030 在前端认证 API 中新增 sendForgotPasswordCode 请求方法
- [ ] T031 将 ForgotPassword store 的 sendCode 改为调用真实 API 并保留倒计时
- [ ] T032 移除发送验证码时写入 localStorage 的逻辑
- [ ] T033 根据免校验策略调整 schema 中 code 字段规则
```

这个阶段的重点是：

- 不接入真实短信服务

- 不校验验证码正确性

- 保留前端获取验证码交互

- 不再用 localStorage 当验证码事实源

- 为后续真实验证码接入保留接口形态

这就是前面 Clarify 和 Plan 的结果在代码阶段的落地。

## 十、Phase 5：实现账号枚举和敏感信息保护

US3 是安全保护相关。

对应任务：

```
- [ ] T034 统一账号不存在和账号不可用的用户侧错误行为
- [ ] T035 增加脱敏安全日志且不记录明文密码、完整验证码或完整 Token
- [ ] T036 backend 代理中统一外部失败提示并隐藏 auth-service 内部错误细节
- [ ] T037 前端统一重置失败提示，避免暴露账号存在性
- [ ] T038 确认 logout 相关敏感日志不影响本功能并记录后续治理项
```

这类任务很重要。

因为忘记密码是安全敏感功能，不能只看“能不能重置成功”。

还要确保：

- 未注册手机号不会被明确提示

- 内部错误不会透传给前端

- 日志不记录明文密码

- 日志不记录完整验证码

- 日志不记录完整 Token

Implement 阶段会把这些安全要求变成具体代码改动，而不是停留在文档口号。

## 十一、Phase 6：验证和收尾

最后是 Polish 阶段。

任务包括：

```
- [ ] T039 对照契约检查 backend 对前端接口路径、请求字段和响应字段
- [ ] T040 对照契约检查 auth-service 内部接口路径、请求字段和响应字段
- [ ] T041 对照 quickstart 执行并补充手工验收结果记录
- [ ] T042 在 services/auth-service 执行 npm run lint
- [ ] T043 在 services/auth-service 执行 npm run build
- [ ] T044 在 services/backend 执行 npm run lint
- [ ] T045 在 services/backend 执行 npm run build
- [ ] T046 在 apps/web 执行 npm run lint
- [ ] T047 在 apps/web 执行 npx tsc --noEmit
- [ ] T048 更新 quickstart 中最终验证结果和风险提示
```

这一步是质量闭环。

尤其当前 feature 明确“不生成任务级单元测试”，那这些验证就更不能省。

根据 quickstart，最终要验证：

```
成功重置密码
验证码未接入不阻断主流程
密码确认失败
手机号格式失败
账号存在性保护
```

还要执行：

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

## 十二、Implement 如何处理并行任务？

`tasks.md` 中有 `[P]` 标记。

例如：

```
- [ ] T010 [P] 创建 backend 发送验证码请求 DTO
- [ ] T011 [P] 创建 backend 重置密码请求 DTO
- [ ] T012 [P] 创建 backend 忘记密码通用响应 DTO
```

这些任务创建不同文件，理论上可以并行。

但如果多个任务修改同一个文件，就不能并行。

比如下面这些都是热点文件：

```
apps/web/src/pages/ForgotPassword/useStore.ts
services/backend/src/auth/auth.controller.ts
services/auth-service/src/auth/auth.service.ts
```

同一个文件上的任务必须串行执行，否则容易互相覆盖。

所以 Implement 并不是看到 `[P]` 就盲目并行，而是要结合文件路径判断是否真的安全。

## 十三、Implement 会如何标记进度？

每完成一个任务，`tasks.md` 中的复选框应该从：

```
- [ ] T016 [US1] 在 AuthService 中实现 resetForgotPassword 方法
```

变成：

```
- [x] T016 [US1] 在 AuthService 中实现 resetForgotPassword 方法
```

这样任务进度就能持续追踪。

这也是 Spec-Kit 比普通 AI 编码更可控的地方。

你可以清楚知道：

- 哪些任务完成了

- 哪些任务还没做

- 卡在哪个 Phase

- 哪个用户故事已经可以验收

## 十四、Implement 出错时怎么办？

Implement 阶段不是保证一次跑完所有任务。

如果中途遇到问题，应该停下来处理，而不是硬往下写。

常见情况：

| 场景                 | 处理方式                                         |
| -------------------- | ------------------------------------------------ |
| 文件不存在或结构不符 | 先读取实际项目结构，调整任务实现方式             |
| 类型检查失败         | 修复类型错误后继续                               |
| lint 失败            | 按项目规范修复，而不是跳过检查                   |
| 任务描述不清楚       | 回查 spec/plan/contracts，仍不清楚就重新 clarify |
| 同文件冲突           | 串行处理，避免覆盖已有修改                       |

一个重要原则是：

不要为了完成任务而绕过验证。

比如不要因为 lint 失败就跳过 lint，也不要因为 build 失败就忽略 build。

## 十五、Implement 和普通 AI 写代码有什么区别？

普通 AI 写代码通常是：

```
用户说需求
 ↓
AI 直接改代码
```

Implement 的方式是：

```
spec.md 明确需求
 ↓
plan.md 明确技术方案
 ↓
contracts/data-model 明确接口和数据
 ↓
tasks.md 明确执行顺序
 ↓
AI 按任务改代码
```

最大的差别是：

- 普通方式更快，但容易跑偏

- Spec-Kit 更慢一点，但可追踪、可回溯、可验证

对于忘记密码这种涉及认证安全的功能，我更愿意选择后者。

因为它能保证：

- 不绕过服务边界

- 不忽略密码安全

- 不泄露账号存在性

- 不把验证码临时免校验当最终能力

- 不遗漏最终验证

## 十六、Implement 阶段最容易踩的坑

### 1. 没读现有代码就直接写

这会导致风格不一致、重复造轮子、破坏已有架构。

所以 Setup 阶段一定要执行。

### 2. 只完成主流程，忽略安全任务

忘记密码主流程能跑，不代表功能完成。

账号枚举保护、日志脱敏、Refresh Token 失效都必须做。

### 3. 手动跳过失败的验证

如果 lint/build/typecheck 失败，应该修复问题，而不是绕过。

### 4. tasks.md 和代码不同步

完成任务后要标记 `[x]`，否则后续很难知道进度。

### 5. 发现需求不清楚时继续猜

如果实现时发现需求不清楚，应该回到 Clarify，而不是让 AI 自己决定。

## 十七、总结

`/speckit-implement` 的核心价值是：

按任务清单，把前面确定好的需求、方案、契约和验收标准真正落到代码里。

它不是自由发挥，而是严格执行：

```
tasks.md：执行顺序
plan.md：技术方案
contracts：接口契约
data-model：数据结构
quickstart：验收方式
research：决策依据
spec.md：需求兜底
```

在忘记密码案例中，Implement 会按阶段完成：

1. 阅读现有 auth-service/backend/frontend 代码

2. 创建 DTO、错误码、响应类型和前端 API 类型

3. 实现手机号重置密码 MVP 主链路

4. 实现验证码未接入阶段的模拟发送和免校验流程

5. 实现账号存在性保护和敏感信息保护

6. 执行契约核对、lint/build/typecheck 和 quickstart 手工验收

到这里，Spec-Kit 的完整主流程就闭环了：

```
需求 → 规格 → 澄清 → 计划 → 任务 → 代码
```

这也是我觉得 Spec-Kit 最有价值的地方：

它不是让 AI 更“自由”地写代码，而是让 AI 更“受控”地写代码。
