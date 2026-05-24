# Spec Kit 与 Claude 配置调用机制说明

## 核心结论

Spec Kit 和 `.claude` 配置不是替代关系，而是分工关系：

- **Spec Kit**：管理当前 feature 的需求、计划、任务和验收。
- **`.claude`** **配置**：管理整个项目长期稳定的技术规范、架构决策、Agent/Skill 触发规则和踩坑经验。

更准确地说：

1. `/speckit-plan` **会受本地 Claude Code 项目配置影响**，因为当前 Claude Code 会话已经加载了 `CLAUDE.md`、项目规则和技术决策。
2. 但 `/speckit-plan` 作为 Spec Kit 流程，**显式读取的治理入口主要是** `.specify/memory/constitution.md`，不是自动逐个读取 `.claude/DECISIONS.md`、`.claude/rules/`、`.claude/skills/`。
3. `/speckit-specify` 主要负责生成 `spec.md`，只描述 **WHAT** 和 **WHY**，一般不会主动套用前端、后端、安全、架构等实现规则。
4. `.claude` 规则、技术决策和 skills 在真正实现代码、调用 Agent、执行普通 Claude Code 开发任务时影响最强。

---

## 一句话理解

> **Spec Kit 管这次 feature 要做什么，`.claude`** **管这个项目长期应该怎么写。**

也可以这样记：

```text
spec.md      管要什么
plan.md      管怎么做
tasks.md     管执行顺序
constitution 管 Spec Kit 的显式规矩
.claude      管项目长期写法
```

---

## 两个容易混淆的层次

### 层次一：Claude Code 当前会话已加载的项目规则

当你在这个项目里使用 Claude Code 时，当前会话会加载项目级上下文，例如：

- `CLAUDE.md`
- `.claude/DECISIONS.md`
- `.claude/FRONTEND-DECISIONS.md`
- `.claude/rules/`
- 自动触发 Agent/Skill 的规则
- 项目记忆和高频踩坑经验

这些内容会影响 Claude 的判断、回答和代码实现。

所以当你执行 `/speckit-plan` 时，Claude 并不是“完全空白”地做计划，它仍然知道项目技术栈、目录结构、前后端边界、安全红线、TypeScript 规范等背景。

这属于**会话层面的隐式影响**。

### 层次二：Spec Kit 自身显式读取的治理文件

Spec Kit 流程自身更明确依赖的是 `.specify` 体系里的文件，例如：

- `.specify/memory/constitution.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/plan-template.md`
- `spec.md`
- `plan.md`
- `tasks.md`
- `research.md`
- `data-model.md`
- `contracts/`
- `quickstart.md`

其中，`.specify/memory/constitution.md` 是 Spec Kit 的显式治理入口。

因此，不能简单说：

> `/speckit-plan` 会自动读取所有 `.claude` 规则。

更准确的说法是：

> `/speckit-plan` 显式读取 Spec Kit 的 constitution，同时受当前 Claude Code 会话已加载的 `.claude` 项目规范影响。

---

## 分阶段调用关系

| 阶段                          | `.claude` rules / 技术决策影响                 | Spec Kit 显式输入                                                                 | 说明                                                         |
| ----------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `/speckit-specify`            | 很弱，主要是会话背景约束                       | 用户需求、`.specify/extensions.yml`、`spec-template.md`                           | 只生成 WHAT/WHY，不设计 HOW                                  |
| `/speckit-clarify`            | 很弱，主要帮助判断需求是否清晰                 | `spec.md`                                                                         | 补需求缺口，不做实现方案                                     |
| `/speckit-plan`               | 中等，会受当前会话项目规则和现有代码上下文影响 | `spec.md`、`.specify/memory/constitution.md`、plan template                       | 显式治理入口是 constitution；`.claude` 属于隐式影响          |
| `/speckit-tasks`              | 中等，任务拆分会受 plan 和项目规范影响         | `plan.md`、`spec.md`、相关设计文档                                                | 通常不直接调用所有 skills，除非命令定义、hook 或用户明确要求 |
| `/speckit-implement`          | 强，真正写代码时必须遵守 `.claude` 长期规则    | `tasks.md`、`plan.md`、`research.md`、`data-model.md`、`contracts/`、constitution | 最容易触发前端/后端 Agent、代码规范、安全规范等              |
| 普通 Claude Code / Agent 开发 | 强                                             | 不依赖 Spec Kit                                                                   | 直接按照 `CLAUDE.md`、rules、自动触发 Agent/Skill 规则工作   |

---

## 问题 1：`/speckit-plan` 会调用本地 Claude 配置做计划吗？

答案：**会受影响，但不能理解成 Spec Kit 显式调用所有** **`.claude`** **文件。**

### 会受影响的原因

Claude Code 当前会话已经加载了项目配置，所以在做 plan 时会自然参考：

- 项目技术栈
- Monorepo 结构
- 前端 React + MobX 规范
- 后端 NestJS + Prisma 规范
- TypeScript 显式类型要求
- 安全规则
- 目录结构和导入规范
- 现有代码风格

例如本项目中，`.claude` 规则会让 Claude 知道：

- 前端使用 React 19 + TypeScript + Vite + MobX。
- API 认证首选 HttpOnly Cookie。
- TypeScript 尽量避免 `any`。
- 前端页面按项目标准拆分。
- 后端遵守 NestJS Controller / Service / Module 分层。

这些内容会影响 Claude 生成 plan 的判断。

### 但 Spec Kit 显式读取的是 constitution

从 Spec Kit 流程看，`/speckit-plan` 明确读取的是：

- 当前 feature 的 `spec.md`
- `.specify/memory/constitution.md`（如果存在）
- plan 模板
- 项目现有代码和上下文

所以如果某条技术决策非常关键，并且你希望 `/speckit-plan` 稳定、明确、可重复地遵守它，最好把它同步到：

```text
.specify/memory/constitution.md
```

而不是只放在 `.claude/DECISIONS.md` 里。

---

## 问题 2：`/speckit-specify` 会调用 Claude 规则吗？

答案：**一般不会主动调用实现类规则。**

`/speckit-specify` 的目标是把用户自然语言需求转成 `spec.md`。

它只应该回答：

- 用户要什么？
- 为什么要做？
- 用户故事是什么？
- 验收标准是什么？
- 当前 feature 的边界是什么？
- 哪些地方还不清楚？

它不应该回答：

- 用 React 还是 Vue？
- 用 REST 还是 GraphQL？
- Controller 怎么拆？
- MobX store 怎么设计？
- 数据库表怎么建？

这些属于 **HOW**，应该留到 `/speckit-plan` 或后续实现阶段。

因此，`/speckit-specify` 通常不会主动套用 `.claude/rules` 里的前端、后端、安全、样式、测试等实现规则。

但当前 Claude Code 会话的基础行为规则仍然存在，例如：

- 不编造不存在的信息。
- 不越过用户明确指令。
- 保持需求表达清晰。
- 发现需求不明确时标记或提问。

---

## 什么时候会调用 rules、skills、技术决策？

### 1. rules 和技术决策什么时候最强？

影响最强的场景是：

- 普通 Claude Code 开发任务
- `/speckit-implement`
- 前端页面、组件、Hook 开发
- 后端 Controller、Service、Module 开发
- 代码审查、安全审查、性能审查
- 修复 bug 或重构代码

因为这些场景会真正影响代码实现，必须遵守项目长期规范。

例如：

- 写前端页面时，要遵守前端页面拆分规范。
- 写公共组件时，要遵守 CSS Modules、Props、可访问性规范。
- 写后端接口时，要遵守 NestJS 分层、DTO 校验、安全错误信息规范。
- 写认证相关逻辑时，要遵守 HttpOnly Cookie 和 Token 安全要求。

### 2. skills 什么时候会调用？

skills 不会因为进入 Spec Kit 阶段就自动全部调用。

通常只有以下情况才会调用：

1. **用户显式调用 slash command**

   例如：

   ```text
   /speckit-plan
   /speckit-implement
   /frontend-code-review
   /nestjs-security-audit
   ```

2. **某个命令内部配置了 hook**

   例如 `.specify/extensions.yml` 中配置了 before/after hook。

3. **用户任务触发 Agent/Skill 自动规则**

   例如用户说“开发一个前端页面”，项目规则要求触发 `frontend-developer` Agent。

4. **当前任务本身就是某个 skill 的职责**

   例如用户要求“生成提交信息”，就可能触发 Git 相关 skill。

### 3. 技术决策什么时候会进入 Spec Kit？

技术决策进入 Spec Kit 通常有三种方式：

1. **写入** **`.specify/memory/constitution.md`**

   这是最稳定的方式。

2. **写进当前 feature 的** **`spec.md`** **或** **`/speckit-plan`** **指令中**

   例如：

   ```text
   /speckit-plan 本功能必须遵守 HttpOnly Cookie 认证方案，不允许 localStorage 存 Token。
   ```

3. **通过 Claude Code 当前会话已加载的** **`.claude`** **规则间接影响**

   这种方式有效，但不如 constitution 明确。

---

## 优先级关系

推荐按下面顺序理解：

```text
用户当前明确指令
  ↓
Spec Kit 当前 feature 文档
  ↓
.claude 项目长期规则
  ↓
Claude 默认能力与通用习惯
```

举例：

- 用户明确说“不添加单元测试”，那么这次 feature 就不要添加单元测试。
- `tasks.md` 指定目标文件是 `apps/web/src/utils/array.ts`，实现就应该落在这个文件。
- `.claude` 规定 TypeScript 要显式声明参数和返回值，那么实现函数时仍要遵守。

---

## 推荐实践

### 1. 关键技术决策同步到 constitution

如果希望 `/speckit-plan` 稳定遵守某些规则，建议同步到：

```text
.specify/memory/constitution.md
```

适合放入 constitution 的内容：

- 技术栈硬约束
- 安全红线
- 架构边界
- 数据库命名约定
- API 认证方式
- 不允许违反的项目原则

### 2. `.claude/*` 继续作为长期项目规范

`.claude` 适合保存更完整的长期规则，例如：

- 详细编码规范
- Agent 自动触发规则
- 前端/后端开发约定
- 代码审查规则
- 高频踩坑经验
- 项目记忆

### 3. 当前 feature 的特殊要求写入 spec 或 plan 指令

如果只是某个 feature 的特殊约束，不建议写入长期规则。

应该写在：

- 当前 `spec.md`
- 当前 `/speckit-plan` 指令
- 当前 `plan.md`
- 当前 `tasks.md`

例如：

```text
本 feature 不新增单元测试，只通过 lint 和 TypeScript 类型检查验证。
```

### 4. 不要让 constitution 和 `.claude` 冲突

如果两套规则冲突，Claude 会很容易摇摆。

建议保持：

```text
.specify/memory/constitution.md：写关键硬规则摘要
.claude/*：写完整项目开发规范
```

---

## 学习口诀

```text
specify 阶段：问清楚要什么，不急着想怎么写。
plan 阶段：把需求转成技术方案，显式看 constitution，隐式受 .claude 影响。
tasks 阶段：把技术方案拆成可执行任务。
implement 阶段：真正写代码，.claude 项目规范影响最强。
```

再简化成一句：

> **Spec Kit 负责 feature 流程，constitution 负责 Spec Kit 硬规则，`.claude`** **负责 Claude 在项目里长期怎么干活。**

---

## 对照依据

- `docs/speckit/spec-kit-and-claude-config-roles.md:15-22`：Spec Kit 是 feature 施工图，`.claude` 是项目建筑规范。
- `docs/speckit/spec-kit-and-claude-config-roles.md:91-110`：用户明确指令、Spec Kit feature 文档、`.claude` 项目规则之间存在优先级。
- `docs/speckit/spec-kit-and-claude-config-roles.md:133-174`：Spec Kit 规划做什么，`.claude` 约束在项目里怎么做。
- `docs/speckit/spec-kit-and-claude-config-roles.md:204-211`：简单 feature 也仍受基础项目约束影响。
- `docs/speckit/speckit-specify-execution-flow.md:21-25`：`/speckit-specify` 只描述 WHAT/WHY，不描述 HOW。
- `docs/speckit/speckit-specify-execution-flow.md:33-49`：specify 前置检查主要是 `.specify/extensions.yml` 的 `before_specify` hooks。
- `docs/speckit/speckit-specify-execution-flow.md:136-139`：specify 加载 `.specify/templates/spec-template.md`。
- `docs/speckit/speckit-plan-execution-flow.md:56-85`：`/speckit-plan` 定位当前 feature，读取 `spec.md` 和 `.specify/memory/constitution.md`。
- `docs/speckit/speckit-plan-execution-flow.md:93-112`：plan 阶段生成配套设计文档，并更新 Agent 上下文。
- `docs/speckit/speckit-implement-execution-flow.md:84-105`：implement 阶段读取 tasks、plan、research、data-model、contracts、quickstart 和 constitution。
