---
title: Spec-Kit 项目宪法：让 AI 开发有规则可循
slug: spec-kit-constitution-rules-governance
date: 2026-06-05
tags: [Claude Code, AI编程, Spec-Kit]
---

# Spec-Kit 项目宪法：让 AI 开发有规则可循

前面我已经写了 Spec-Kit 的主流程：`specify → clarify → plan → tasks → implement`。

但只靠流程还不够。因为 AI 即使按流程走，也可能在技术方案、目录边界、安全规则、验证方式上做出不符合项目长期规范的选择。

所以 Spec-Kit 里还有一个很重要的东西：项目宪法，也就是 `.specify/memory/constitution.md`。

## 一、项目宪法是什么？

在我的理解里，项目宪法不是普通说明文档。

它更像是这个仓库的“最高开发原则”。

也就是说，当 AI 做技术方案、拆任务、写代码时，它不能只看当前需求，还要遵守这份宪法里的规则。

我的项目里，这份文件位于：

```
.specify/memory/constitution.md
```

它的标题是：

```
# Claude Monorepo Constitution
```

因为我的项目是一个 Monorepo 全栈博客系统，里面包含：

```
apps/web # H5 前端应用
services/auth-service # 认证服务
services/backend # 博客主业务服务
services/log-service # 日志服务
packages/shared-logging # 共享日志包
```

这种项目如果没有统一规则，AI 很容易写错地方、破坏边界、绕过安全规范。

项目宪法就是用来解决这个问题的。

## 二、为什么需要项目宪法？

举个例子。

我让 AI 实现“忘记密码”功能时，如果没有宪法约束，AI 可能会这样设计：

```
前端直接调用 auth-service
backend 直接修改用户密码
密码用普通 hash 处理
错误提示直接返回“手机号不存在”
验证阶段只跑一下前端页面
```

这些做法看起来可能能跑，但都不符合项目长期规范。

我的项目要求是：

- 前端不能直接接触认证服务细节

- 认证事实源归属 `auth-service`

- 密码必须使用 Argon2id

- Token 必须走 HttpOnly Cookie

- 错误提示不能暴露账号存在性

- 代码变更必须有匹配的验证方式

这些规则不能每次都靠人反复提醒。

所以它们应该沉淀到项目宪法里。

这样每次进入 `plan` 阶段时，Spec-Kit 都能做 Constitution Check。

## 三、这份宪法包含哪些核心原则？

我的项目宪法目前是 `1.0.0` 版本，定义了 7 条核心原则：

```
I. 类型安全优先
II. 默认安全
III. 清晰架构边界
IV. 最小变更与优先复用
V. 规格与契约驱动
VI. 验证门禁
VII. 一致性与格式规范
```

下面逐条展开。

## 四、原则一：类型安全优先

宪法第一条是：

```
类型安全优先
```

核心要求是：

- 函数参数必须有明确类型

- 函数返回值必须有明确类型

- 异步函数必须声明 `Promise<T>`

- 公共组件 Props 必须明确类型

- API 数据结构、DTO、共享包导出都要有明确类型

- 禁止无理由使用 `any`

- 类型导入导出使用 `import type` / `export type`

为什么这条排第一？

因为这是一个前后端加共享包的 Monorepo 项目。

只要类型松了，问题很容易跨系统扩散。

比如 backend 返回字段变了，前端没感知；auth-service DTO 改了，backend 调用还按旧字段传；共享包导出结构变了，多个服务一起报错。

类型安全就是第一道防线。

## 五、原则二：默认安全

第二条是：

```
默认安全
```

这条主要约束认证、密码、Token、日志和输入校验。

核心规则包括：

- Access Token 和 Refresh Token 必须通过 HttpOnly Cookie 传输

- 前端禁止把 Token 存进 `localStorage` 或 `sessionStorage`

- 前端禁止手动拼接携带 Token 的 Authorization 请求头

- 新密码哈希必须使用 Argon2id

- 日志和错误响应不得暴露完整 Token、密钥、SQL、堆栈、内部路径

- 所有系统边界处的外部输入必须做白名单、类型、范围、格式校验

这条对“忘记密码”功能特别关键。

因为忘记密码涉及：

- 密码重置

- 账号存在性保护

- Token 会话失效

- 验证码能力

- 安全审计日志

如果没有默认安全原则，AI 很容易只实现“能重置密码”，但忽略“是否安全地重置密码”。

## 六、原则三：清晰架构边界

第三条是：

```
清晰架构边界
```

这条对 Monorepo 项目非常重要。

宪法里明确规定：

```
apps/ 存放面向用户的应用
services/ 存放独立职责的后端服务
packages/ 存放跨系统技术库
specs/ 存放 Spec-Kit 功能产物
.claude/ 存放 Claude Code 规则和项目指导
```

同时明确了后端服务职责：

```
services/auth-service 负责认证策略
services/backend 负责博客核心业务
services/log-service 负责日志与审计
```

共享包也有边界：

```
packages/shared-logging 只能提供纯技术能力，不能依赖业务服务，也不能承载业务流程。
```

还是以忘记密码为例。

正确边界是：

```
web → backend → auth-service
```

其中：

- 前端只调用 backend

- backend 作为中间层

- auth-service 负责真实密码重置

- backend 不直接修改认证凭据

这就是宪法对架构边界的约束。

## 七、原则四：最小变更与优先复用

第四条是：

```
最小变更与优先复用
```

核心要求是：

- 只做满足已批准需求的最小改动

- 新增实现前，先搜索并复用已有组件、Hook、工具函数、DTO、服务和共享包

- 公共接口、导出函数、路由契约、数据库结构、共享包 API 不能随意重命名或修改

- 不为了假设中的未来需求提前抽象

- 不做和当前需求无关的大范围格式调整

这条其实是在限制 AI 的“过度热情”。

AI 很容易在实现一个小需求时顺手：

- 重构一堆文件

- 新建一套抽象

- 改一堆命名

- 顺便优化周边代码

但真实项目里，这些“顺手优化”往往会增加 review 成本和回归风险。

所以宪法要求：

当前需求是什么，就只做当前需求需要的事。

## 八、原则五：规格与契约驱动

第五条是：

```
规格与契约驱动
```

它要求非平凡功能必须走 Spec-Kit 产物链路：

```
spec.md → plan.md → tasks.md → implement
```

如果功能涉及：

- API

- 工具函数入口

- 服务接口

- 跨系统数据结构

就必须在 `contracts/` 中描述可观察行为。

也就是说，不能只写代码，不写契约。

以忘记密码为例，Plan 阶段生成了：

```
contracts/forgot-password-api.md
```

里面明确了：

- `POST /auth/forgot-password/send-code`

- `POST /auth/forgot-password/reset`

- 请求字段

- 响应字段

- 错误行为

- 安全要求

- backend 和 auth-service 的职责边界

这保证了前端、backend、auth-service 对同一个功能有统一理解。

## 九、原则六：验证门禁

第六条是：

```
验证门禁
```

它要求每个变更都必须定义与影响范围匹配的验证方式。

比如：

- 前端变更影响 `apps/web` 时，要执行 `npm run lint` 和 `npx tsc --noEmit`

- 后端变更要执行对应服务的 lint、build、test，或记录等价验证方式

- 契约变更必须和生成或记录的契约核对

- 高风险行为、跨系统行为、回归风险高的行为，应该新增或更新测试

宪法里还有一句很关键：

```
如果某个 feature 明确不写测试，只能在该 feature 的 plan 中说明，不能变成全项目免测规则。
```

这点非常重要。

比如忘记密码这个 feature 里，用户明确说不生成任务级单元测试。

但这不代表以后所有功能都不用测试。

所以它只是在当前 `plan.md` 里作为 feature 级例外说明，并且仍然要保留：

```
lint / build / typecheck / quickstart 手工验收
```

这就是验证门禁的意义。

## 十、原则七：一致性与格式规范

第七条是：

```
一致性与格式规范
```

它要求代码遵守统一格式基线：

- 2 空格缩进

- 单引号

- 分号

- 多行对象和数组使用 trailing comma

- 导入分组排序

- 逻辑块之间保留空行

同时还要求各系统遵守自己的结构规范：

- 前端页面使用已确认的页面拆分模式

- 公共组件保持 Props 驱动并使用 CSS Modules

- Prisma 模型使用 PascalCase

- 数据库表名通过映射保持 snake_case

- 共享包暴露稳定且有类型的 API

这类规则看起来像“小事”，但在多人和多 Agent 协作时非常重要。

格式一致，代码才容易 review。

结构一致，AI 才不容易乱写。

## 十一、系统边界与技术约束

除了 7 条原则，宪法还单独定义了系统边界。

比如：

```
apps/web 使用 React 19、Vite、TypeScript、MobX、Ant Design Mobile、SCSS、CSS Modules、React Router 和既有前端 API 分层。

services/auth-service 负责登录、注册、Token 签发、Token 刷新、Token 校验和会话认证策略。

services/backend 负责文章、评论、用户管理等博客核心业务，并必须把认证校验委托给认证服务边界。

services/log-service 负责操作日志、审计追踪和行为分析。

packages/shared-logging 是纯 TypeScript 共享日志包。
```

这些约束会直接影响 Plan 阶段。

比如一个功能如果涉及认证，就应该优先判断是否属于 `auth-service`。

如果涉及博客文章，就应该归属 `backend`。

如果只是日志格式复用，才可能进入 `shared-logging`。

## 十二、Constitution Check 是怎么用的？

宪法不是写完放在那里看的。

它会进入 Spec-Kit 的 `plan.md`。

每个 feature 的 `plan.md` 都必须包含：

```
Constitution Check
```

而且有两次检查：

```
Phase 0 research 前：检查初始方案是否违反宪法
Phase 1 design 后：检查 research/data-model/contracts/quickstart 是否引入新的违规项
```

比如忘记密码功能的 `plan.md` 里，就有类似检查：

| 原则               | 状态 | 说明                                                       |
| ------------------ | ---- | ---------------------------------------------------------- |
| 类型安全优先       | PASS | DTO、响应类型、前端 API 类型都使用显式类型                 |
| 默认安全           | PASS | 新密码使用 Argon2id，不记录明文密码和完整 Token            |
| 清晰架构边界       | PASS | 前端只调用 backend，backend 调用 auth-service              |
| 最小变更与优先复用 | PASS | 复用现有页面、AuthClientService、AuthService 等能力        |
| 规格与契约驱动     | PASS | 生成 forgot-password-api 契约                              |
| 验证门禁           | PASS | 用 lint/build/typecheck 和 quickstart 手工验收覆盖核心风险 |
| 一致性与格式规范   | PASS | 保持 NestJS 和前端页面拆分规范                             |

这就是宪法真正发挥作用的地方。

## 十三、如果必须违反宪法怎么办？

宪法不是说永远不能例外。

但如果某个 feature 无法遵守某条原则，必须在 `plan.md` 的 `Complexity Tracking` 里说明：

```
违反了哪条原则
为什么必须例外
考虑过哪些更简单合规方案
为什么拒绝这些方案
例外适用范围是什么
```

而且例外只对当前 feature 有效。

不能因为一次 feature 例外，就变成后续所有功能都可以这么做。

比如某个 feature 说“不写单元测试”，它只能影响当前 feature，不能变成全项目“不写测试”的新规则。

## 十四、项目宪法和其他规则文件的关系

我的项目里不只有 Constitution，还有：

```
.claude/DECISIONS.md
.claude/FRONTEND-DECISIONS.md
.claude/rules/*.md
CLAUDE.md
```

这些文件也都很重要。

但 Constitution 是顶层治理文件。

如果详细规则和 Constitution 冲突，以 Constitution 为准。

然后需要同步更新详细规则，或者提出明确的宪法修订。

可以理解为：

```
Constitution：最高原则
DECISIONS / FRONTEND-DECISIONS：稳定架构决策
rules/*.md：具体执行规范
CLAUDE.md：项目上下文入口
```

## 十五、什么时候应该修改项目宪法？

宪法不应该频繁改。

只有那些稳定、全项目适用、会反复影响计划、评审、安全或跨系统边界的决策，才应该提升到 Constitution。

比如适合进入宪法的规则：

- Token 必须使用 HttpOnly Cookie

- 密码必须使用 Argon2id

- 前端不能直接调用 auth-service

- 共享包不能承载业务流程

- 非平凡功能必须走 Spec-Kit 产物链路

不适合进入宪法的规则：

- 某个页面的按钮文案

- 某个接口的临时字段

- 某个 feature 的一次性例外

- 还没验证稳定的个人偏好

宪法修订还要遵守版本规则：

```
删除原则或不兼容重定义原则：提升 MAJOR
新增原则或显著扩展治理内容：提升 MINOR
措辞澄清、错别字修复：提升 PATCH
```

当前这份宪法版本是：

```
Version: 1.0.0
Ratified: 2026-05-24
Last Amended: 2026-05-24
```

## 十六、项目宪法对 AI 协作最大的价值

我觉得它最大的价值是：

把那些“每次都要提醒 AI 的规则”，变成 AI 每次计划时必须检查的规则。

以前我可能要反复告诉 AI：

```
不要用 any
不要把 token 存 localStorage
不要让前端直接调 auth-service
不要直接改认证数据库
不要跳过 lint/typecheck
不要乱建抽象
```

现在这些规则都写进 Constitution。

以后每个 feature 的 `plan.md` 都要经过 Constitution Check。

这样 AI 不是只听当前一句需求，而是必须同时遵守项目长期规则。

## 十七、总结

`.specify/memory/constitution.md` 是 Spec-Kit 工作流里的项目治理核心。

它定义了这个项目里所有 feature 都必须遵守的最高原则：

```
类型安全优先
默认安全
清晰架构边界
最小变更与优先复用
规格与契约驱动
验证门禁
一致性与格式规范
```

它解决的是一个很现实的问题：

AI 可以帮我们写代码，但项目质量不能只靠 AI 临场发挥。

对于一个 Monorepo 全栈项目来说，真正重要的是让 AI 在写代码前就知道：

- 哪些边界不能碰

- 哪些安全规则不能破

- 哪些验证不能省

- 哪些设计必须有契约

- 哪些例外必须被记录

所以我觉得项目宪法不是“文档洁癖”，而是 AI 协作开发里的治理底座。

有了它，Spec-Kit 的流程才更完整：

```
需求 → 规格 → 澄清 → 计划（宪法检查）→ 任务 → 实现 → 验证
```

这也是我后面继续使用 Spec-Kit 时，最想持续维护好的文件之一。
