# 从项目情况和技术决策提炼 Spec Kit Constitution 教程

> **目标读者**：已经了解 Spec Kit 基本流程，但不清楚如何从项目现状、Claude Code 规则和技术决策中提炼 Constitution 的新手。
>
> **前置阅读**：
>
> - `docs/speckit/speckit-constitution-newbie-guide.md`
> - `docs/speckit/speckit-constitution-execution-mechanism.md`
> - `docs/speckit/spec-kit-constitution-vs-claude-code-rules.md`
>
> **相关来源**：
>
> - `CLAUDE.md`
> - `.claude/DECISIONS.md`
> - `.claude/FRONTEND-DECISIONS.md`
> - `.claude/rules/*.md`
> - `specs/xiaobei/`

---

## 1. 先回答一个核心问题

新手最容易迷茫的问题是：

> 每个 feature 都有一个 Constitution，还是所有 feature 统一引用一个全局 Constitution？

结论：

> **通常只有一份全局 Constitution，所有 feature 都统一引用它。**

在本项目中，这份全局 Constitution 位于：

```text
.specify/memory/constitution.md
```

每个 feature 目录中的 `plan.md` 会有 `Constitution Check`，但它不是给这个 feature 单独创建一份宪法，而是：

> 当前 feature 的计划要拿全局 Constitution 检查一遍，确认没有违反项目级原则。

关系如下：

```text
.specify/memory/constitution.md
        │
        ├── specs/xiaobei/xiaobei-01-string-utils/plan.md 做 Constitution Check
        ├── specs/xiaobei/xiaobei-02-number-utils/plan.md 做 Constitution Check
        └── specs/xiaobei/xiaobei-03-array-utils/plan.md 做 Constitution Check
```

不要理解成：

```text
xiaobei-01 有自己的 Constitution
xiaobei-02 有自己的 Constitution
xiaobei-03 有自己的 Constitution
```

---

## 2. 当前项目整体情况

本项目是一个 Monorepo 全栈博客项目，包含前端 H5 应用、后端多个服务和共享包。

整体结构可以简化理解为：

```text
claude/
├── apps/
│   └── web/                    # 前端 H5 移动端应用
├── services/
│   ├── auth-service/            # 认证授权服务
│   ├── backend/                 # 主业务服务
│   └── log-service/             # 日志服务
├── packages/
│   └── shared-logging/          # 共享日志 SDK
├── specs/
│   └── xiaobei/                 # Spec Kit 小贝案例项目
├── .claude/                     # Claude Code 规则、Agent、技术决策
└── .specify/                    # Spec Kit 配置、模板、Constitution
```

可以按职责分成三层：

| 层级   | 目录                    | 作用                            |
| ------ | ----------------------- | ------------------------------- |
| 应用层 | `apps/web/`             | React H5 前端应用               |
| 服务层 | `services/*`            | NestJS 后端微服务               |
| 共享层 | `packages/*`            | 跨系统共享能力                  |
| 规格层 | `specs/*`               | Spec Kit feature 文档           |
| 治理层 | `.claude/`、`.specify/` | AI 规则、技术决策、Constitution |

---

## 3. 当前小贝 Spec Kit 项目情况

当前已经有一个 `xiaobei` 分组：

```text
specs/xiaobei/
├── xiaobei-01-string-utils
├── xiaobei-02-number-utils
└── xiaobei-03-array-utils
```

每个 feature 一般包含：

```text
spec.md          # 需求规格：用户要什么
plan.md          # 实施计划：技术上怎么做
research.md      # 调研结论
contracts/       # 函数/API 契约
quickstart.md    # 验证和使用说明
tasks.md         # 任务拆分
```

小贝项目体现出的稳定实践包括：

- 工具函数放在 `apps/web/src/utils/`。
- 字符串、数字、数组能力按 feature 独立推进。
- 工具函数保持简单、纯函数、无副作用。
- TypeScript 类型声明明确。
- 验证以 lint、TypeScript 类型检查、契约核对为主。
- 用户明确“不加测试”时，不擅自扩展测试任务。

这些实践非常适合反向提炼为 Constitution 原则。

---

## 4. 项目中的关键技术决策

### 4.1 后端架构决策

后端决策主要记录在：

```text
.claude/DECISIONS.md
```

关键内容如下：

| 决策                         | 含义                                       | 可提炼方向     |
| ---------------------------- | ------------------------------------------ | -------------- |
| Monorepo 多微服务架构        | `apps/`、`services/`、`packages/` 分层管理 | 架构边界清晰   |
| auth-service 与 backend 分离 | 认证由 auth-service 统一负责               | 服务职责单一   |
| HttpOnly Cookie 存 Token     | 禁止前端存储 Token                         | 安全默认       |
| Argon2id 密码加密            | 新密码使用 Argon2id                        | 安全默认       |
| Prisma 模型 PascalCase       | 避免 `as any`，保持类型安全                | 类型安全优先   |
| BigInt 毫秒时间戳            | 避免时区问题                               | 数据一致性     |
| Refresh Token 存 Redis       | 短生命周期会话数据用 Redis TTL             | 安全与性能平衡 |
| 数据库连接指数退避重试       | 避免瞬时故障放大                           | 韧性设计       |
| HTTP 响应压缩                | 提升 API 传输性能                          | 性能基线       |
| 三层异常过滤器               | 业务、HTTP、未知异常分层处理               | 错误治理       |

这些决策不需要全部原样复制到 Constitution，但其中的高层原则可以提炼进去。

例如：

```markdown
涉及认证和敏感数据的 feature 必须遵守安全默认原则：Token 使用 HttpOnly Cookie，密码使用 Argon2id，禁止在前端持久化 Token。
```

---

### 4.2 前端架构决策

前端决策主要记录在：

```text
.claude/FRONTEND-DECISIONS.md
```

关键内容如下：

| 决策                         | 含义                                                  | 可提炼方向   |
| ---------------------------- | ----------------------------------------------------- | ------------ |
| React 19 + Vite + TypeScript | 前端基础技术栈                                        | 技术栈稳定性 |
| Ant Design Mobile            | 移动端组件库                                          | 复用优先     |
| MobX 双轨状态管理            | RootStore + useLocalObservable                        | 状态边界清晰 |
| 页面四文件拆分               | `index.tsx`、`useStore.ts`、`constant.ts`、`types.ts` | 页面结构一致 |
| Hooks 业务分层               | 复杂业务逻辑放 `hooks/useXxx.ts`                      | 职责分离     |
| 设计令牌体系                 | 使用 SCSS 变量，避免魔法值                            | 设计一致性   |
| React Router v6 模块化路由   | 路由按模块拆分                                        | 路由治理     |
| Axios 分层封装               | API 必须走统一封装                                    | API 契约一致 |
| HttpOnly Cookie 认证         | withCredentials + 禁止手动 Authorization              | 安全默认     |

这些同样适合提炼到 Constitution 的“架构边界”和“安全默认”部分。

例如：

```markdown
前端 feature 必须遵守既有架构边界：状态管理使用 MobX 双轨架构，API 调用走统一 Axios 封装，页面按标准文件结构组织。
```

---

## 5. Claude Code 规则和 Constitution 的区别

本项目里有很多 Claude Code 规则，例如：

```text
CLAUDE.md
.claude/rules/typescript-common.md
.claude/rules/security-common.md
.claude/rules/code-format-common.md
.claude/rules/frontend-components.md
```

这些规则很重要，但不应该全部复制到 Constitution。

二者分工如下：

| 类型             | 负责什么                     | 例子                                        |
| ---------------- | ---------------------------- | ------------------------------------------- |
| Constitution     | feature 规划阶段的项目级原则 | 所有 feature 必须类型安全、最小变更、可验证 |
| Claude Code 规则 | Claude 实际执行时怎么操作    | 读文件用 Read，不用 cat；改文件前先阅读     |
| 技术决策 ADR     | 为什么选这个架构或技术       | 为什么使用 HttpOnly Cookie、为什么使用 MobX |
| 编码规范         | 代码具体怎么写               | import 排序、SCSS 命名、Props 类型          |

判断规则：

> 如果它是“所有 feature 都应该遵守的长期原则”，可以提炼进 Constitution。
> 如果它是“Claude 工具怎么用”或“某个文件怎么格式化”，保留在 Claude Code 规则里。

---

## 6. 哪些内容适合放进 Constitution？

适合放入 Constitution 的内容，应满足三个条件：

```text
长期稳定 + 所有 feature 通用 + 可以在 plan 阶段检查
```

### 6.1 适合放入的内容

| 内容                | 是否适合 | 原因                           |
| ------------------- | -------- | ------------------------------ |
| TypeScript 类型安全 | 适合     | 所有 feature 都应遵守          |
| 安全默认原则        | 适合     | 涉及认证、输入、日志时必须遵守 |
| 架构边界清晰        | 适合     | 防止 feature 随意跨层修改      |
| 最小可行变更        | 适合     | 防止过度设计和范围膨胀         |
| Spec Kit 流程       | 适合     | 所有重要 feature 应遵守        |
| lint/tsc 门禁       | 适合     | 可验证                         |
| 服务职责边界        | 适合     | 防止认证逻辑混入 backend       |

### 6.2 不适合放入的内容

| 内容                                | 是否适合         | 应该放哪里                |
| ----------------------------------- | ---------------- | ------------------------- |
| `Read` 工具优先，不用 `cat`         | 不适合           | Claude Code 工具规则      |
| 某个按钮颜色                        | 不适合           | 组件/设计文档             |
| 本次实现 `unique`、`sort`、`filter` | 不适合           | feature 的 `spec.md`      |
| 某个函数内部第几行怎么写            | 不适合           | `plan.md` 或实现代码      |
| 某次临时不加测试                    | 不适合直接全局化 | 当前 feature 的 `plan.md` |

---

## 7. 从项目决策提炼 Constitution 的方法

可以按 4 步做：

### 第 1 步：收集来源

先看这些文件：

```text
CLAUDE.md
.claude/DECISIONS.md
.claude/FRONTEND-DECISIONS.md
.claude/rules/*.md
specs/xiaobei/*/plan.md
```

### 第 2 步：找重复出现的稳定规则

例如：

- 多处强调类型安全。
- 多处强调 HttpOnly Cookie。
- 多处强调不要过度设计。
- 小贝工具函数都要求纯函数和不修改输入。
- plan 阶段都需要 Constitution Check。

### 第 3 步：把具体规则上升成原则

不要写太细。

从：

```text
前端不得 localStorage.getItem('token')。
```

提炼成：

```text
安全默认：认证凭据必须使用 HttpOnly Cookie，前端不得持久化 Token。
```

从：

```text
Prisma 模型必须 PascalCase，不能用 as any。
```

提炼成：

```text
类型安全优先：数据库访问和生成类型不得通过 any 绕过类型系统。
```

### 第 4 步：保留可检查性

每条 Constitution 原则最好能回答：

```text
plan.md 里怎么检查它是否通过？
```

例如：

```markdown
Constitution Check:

- 类型安全：通过，新增函数显式声明输入输出类型，未使用 any。
- 安全默认：通过，本 feature 不处理 Token、密码或外部认证输入。
- 最小变更：通过，仅修改 apps/web/src/utils/array.ts。
```

---

## 8. 推荐的新手版 Constitution 结构

基于当前项目，建议不要一开始写得太复杂，可以采用以下结构：

```markdown
# 项目 Constitution

## Core Principles

### I. 类型安全优先

所有 TypeScript 代码必须保持严格类型约束，禁止不必要的 any。

### II. 安全默认

涉及认证、密码、Token、外部输入和日志的 feature 必须优先遵守安全规则。

### III. 架构边界清晰

前端、后端、认证服务、日志服务、共享包必须保持职责边界，不能随意跨层耦合。

### IV. 最小可行变更

每个 feature 必须范围清晰，优先复用现有结构，避免过度设计。

### V. 规格驱动交付

重要 feature 必须遵循 spec -> plan -> tasks -> implement 流程。

## Technical Constraints

- 前端遵守 React 19 + TypeScript + Vite + MobX + Ant Design Mobile 架构。
- 后端遵守 NestJS + Prisma 架构。
- 认证使用 HttpOnly Cookie，不允许前端持久化 Token。
- 密码使用 Argon2id，不新增 bcrypt 密码哈希逻辑。
- API 调用、状态管理、页面结构必须遵守既有分层。

## Quality Gates

- 必须通过 `npm run lint`。
- TypeScript 项目必须通过 `npx tsc --noEmit`。
- 每个 plan 必须包含 Constitution Check。
- 任务必须能追溯到 spec/plan。
- 明确不在范围内的内容不得擅自扩展。

## Governance

- Constitution 是所有 feature 的全局规划门禁。
- 每个 feature 通过自己的 `plan.md` 检查是否符合全局 Constitution。
- 修改 Constitution 必须说明原因、影响范围和版本变化。
- Constitution 变更后需要检查 `.specify/templates/*.md` 是否同步。
```

---

## 9. 用 xiaobei-03-array-utils 举例

假设全局 Constitution 已经定义了：

```text
类型安全优先、纯函数优先、最小可行变更、规格驱动交付。
```

那么 `xiaobei-03-array-utils/plan.md` 的 Constitution Check 可以这样理解：

```markdown
## Constitution Check

- 类型安全：通过。`unique`、`sort`、`filter` 均需要显式参数和返回值类型，不使用 any。
- 纯函数优先：通过。所有数组工具函数返回新数组，不修改输入数组。
- 最小可行变更：通过。实现范围限定在 `apps/web/src/utils/array.ts`。
- 架构边界：通过。不新增页面、组件、API、状态管理或后端服务。
- 可验证门禁：通过。使用 lint、TypeScript 类型检查和契约核对验证。
```

这就是全局 Constitution 和单个 feature 的关系：

```text
Constitution 规定检查标准
plan.md 记录本 feature 如何满足标准
```

---

## 10. 学习路线

建议按这个顺序学习：

```text
第 1 步：先理解项目结构
        apps/web、services/*、packages/*、specs/*、.claude、.specify

第 2 步：读技术决策
        .claude/DECISIONS.md
        .claude/FRONTEND-DECISIONS.md

第 3 步：读 Claude Code 规则
        CLAUDE.md
        .claude/rules/*.md

第 4 步：把重复出现的稳定原则提炼出来
        类型安全、安全默认、架构边界、最小变更、规格驱动

第 5 步：写入 .specify/memory/constitution.md
        通过 /speckit-constitution 执行

第 6 步：后续 feature 用 plan.md 做 Constitution Check
```

---

## 11. 新手判断口诀

遇到一条规则，不知道该放哪里时，可以用下面的问题判断。

### 11.1 是否放 Constitution？

问：

```text
这条规则是不是所有 feature 长期都要遵守？
```

如果是，考虑放 Constitution。

### 11.2 是否放 spec.md？

问：

```text
这是不是当前功能具体要做什么？
```

如果是，放 `spec.md`。

### 11.3 是否放 plan.md？

问：

```text
这是不是当前功能技术上怎么实现？
```

如果是，放 `plan.md`。

### 11.4 是否放 Claude Code 规则？

问：

```text
这是不是在约束 Claude 怎么读文件、改文件、运行工具？
```

如果是，放 `CLAUDE.md` 或 `.claude/rules/`。

### 11.5 是否放 ADR？

问：

```text
这是不是解释为什么选择某个技术或架构？
```

如果是，放 `.claude/DECISIONS.md` 或 `.claude/FRONTEND-DECISIONS.md`。

---

## 12. 推荐你当前的落地方式

对当前项目来说，不建议一上来把所有 `.claude` 规则都复制进 Constitution。

更推荐：

```text
先写 5 条核心原则
再写 1 个技术约束章节
再写 1 个质量门禁章节
最后写 Governance
```

也就是：

1. 类型安全优先
2. 安全默认
3. 架构边界清晰
4. 最小可行变更
5. 规格驱动交付

这样既不会太空泛，也不会把 Constitution 写成另一个超长的 `CLAUDE.md`。

---

## 13. 一句话总结

> 本项目的 Constitution 应该从 `CLAUDE.md`、`.claude/DECISIONS.md`、`.claude/FRONTEND-DECISIONS.md`、`.claude/rules/` 和 `specs/xiaobei/` 中提炼，但不是复制。

最终目标是形成一份全局规则：

```text
所有 feature 都引用同一份 Constitution；
每个 feature 在自己的 plan.md 中检查是否符合它。
```

这样你以后做任何新功能时，都不会重新纠结“这个项目到底应该怎么做”，因为全局 Constitution 已经给出了稳定答案。
