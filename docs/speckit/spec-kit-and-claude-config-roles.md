# Spec Kit 与 .claude 配置的职责边界

## 背景问题

在使用 Spec Kit 完成 `spec.md`、`plan.md`、`tasks.md` 等文档生成后，会产生一个疑问：

> 既然 Spec Kit 在 plan 阶段已经把当前功能的实现计划做完了，那么 `.claude` 目录下的规则、配置和项目说明是否还需要？

结论是：**仍然需要**。

Spec Kit 和 `.claude` 并不是互相替代的关系，而是分别解决不同层级的问题。

---

## 一句话理解

> **Spec Kit 是每个功能的施工图，`.claude` 是整个项目的建筑规范。**

Spec Kit 告诉 Claude：这一次 feature 要做什么、边界是什么、任务怎么拆。

`.claude` 告诉 Claude：整个项目长期应该怎么写代码、怎么遵守架构、怎么避免踩坑。

---

## Spec Kit 的职责：管“这一次要做什么”

Spec Kit 更像是一次 feature 的需求、计划和任务流水线。

常见产物包括：

```text
spec.md      当前功能需求说明
plan.md      当前功能实现计划
tasks.md     当前功能任务拆分
contracts/   当前功能接口或行为契约
quickstart.md 当前功能验证方式
```

它主要回答以下问题：

- 这次功能的目标是什么？
- 这次功能的范围边界是什么？
- 这次要实现哪些用户故事？
- 哪些任务需要完成？
- 当前 feature 不做什么？
- 当前 feature 如何验收？

例如数组工具函数这个 feature 中，Spec Kit 明确了：

- 只实现 `unique`、`sort`、`filter` 三个数组工具函数。
- 目标文件是 `apps/web/src/utils/array.ts`。
- 不新增单元测试。
- 验证方式是契约核对、lint 和 TypeScript 类型检查。
- `unique` 要保留首次出现顺序。
- `sort` 要返回新数组，数字升序，字符串默认字典顺序。
- `filter` 要按同步布尔条件过滤并保持原始顺序。

这些都是**当前 feature 的局部上下文**。

---

## .claude 的职责：管“整个项目长期怎么做”

`.claude` 目录下的文件不是为了替代某一次 feature 的计划，而是为了沉淀整个项目的长期规则、架构约束和协作习惯。

它主要回答以下问题：

- 项目整体技术栈是什么？
- 前端、后端、共享包分别如何组织？
- 代码风格和命名规范是什么？
- 有哪些安全红线不能违反？
- 哪些 Agent 或 Skill 应该自动触发？
- Claude 写代码时必须遵守哪些项目级约定？
- 项目中有哪些高频踩坑经验需要长期记住？

例如 `.claude` 中可能包含：

- React 19 + TypeScript + Vite + MobX 技术栈约束。
- 前端页面拆分规则。
- MobX 使用 `useObserver`，禁止使用 `observer()` HOC。
- API 认证使用 HttpOnly Cookie，不允许把 Token 存入 localStorage。
- TypeScript 尽量零 `any`。
- SCSS Modules 样式约定。
- Prisma 模型命名约定。
- 导入路径、目录结构、提交规范等长期规则。

这些内容不是某一个 feature 独有的，而是**所有 feature 都应该遵守的项目级规范**。

---

## 二者的关系

推荐理解为以下优先级和分层：

```text
用户当前明确指令
  ↓
Spec Kit 当前 feature 文档
  ↓
.claude 项目长期规则
  ↓
Claude 默认能力与通用习惯
```

如果用户当前明确说“不添加单元测试”，那么本次 feature 就不能添加单元测试。

如果 Spec Kit 的 `tasks.md` 指定目标文件是 `apps/web/src/utils/array.ts`，那么实现就应该落在这个文件中。

如果 `.claude` 中规定 TypeScript 要显式声明参数和返回值，那么实现函数时仍然要遵守。

---

## 示例 1：Spec Kit 指定当前 feature 不加测试

当前数组工具函数 feature 中，用户明确要求：

```text
不要添加单元测试
```

因此 Spec Kit 在 `spec.md`、`plan.md`、`tasks.md` 中都围绕这个要求展开：

- 不创建测试任务。
- 不新增测试文件。
- 使用 lint 和 TypeScript 类型检查验证。

这时即使 `.claude` 中有“前端测试使用 Vitest”的规范，也不会强行触发测试生成。

因为 `.claude` 的测试规范只是在“需要写测试”时约束测试怎么写，并不代表每个 feature 都必须写测试。

---

## 示例 2：Spec Kit 指定实现一个前端页面

如果某个 feature 是“新增一个前端页面”，Spec Kit 会描述：

- 页面目标是什么。
- 用户如何使用。
- 需要哪些状态和交互。
- 需要哪些任务。

但 `.claude` 会继续约束实现方式，例如：

- 页面是否需要按项目规定拆分文件。
- 是否使用 MobX。
- 是否使用 `useObserver`。
- 样式是否使用 CSS Modules。
- API 请求是否走项目封装。
- 是否禁止使用 localStorage 保存 Token。
- 导入是否使用 `@/` 别名。

也就是说，Spec Kit 规划“做什么”，`.claude` 约束“在这个项目里应该怎么做”。

---

## 示例 3：Spec Kit 指定新增后端接口

如果某个 feature 是“新增一个后端接口”，Spec Kit 会规划：

- 接口目标。
- 输入输出。
- 用户故事。
- 实现任务。

但 `.claude` 会继续约束：

- NestJS Controller、Service、Module 的组织方式。
- DTO 是否需要校验。
- Prisma 模型如何命名。
- 错误响应是否统一。
- 是否允许泄露敏感信息。
- 日志中是否禁止输出 Token、密码等敏感数据。

这些项目级规范通常不会在每个 feature 的 `plan.md` 中重复写完整，但 Claude 在实现时仍然应该遵守。

---

## 为什么会感觉 .claude 没用了？

这通常发生在当前 feature 很简单的时候。

比如这次数组工具函数只涉及：

```text
unique
sort
filter
```

它不涉及：

- 页面开发
- MobX 状态管理
- API 请求
- 后端服务
- 数据库
- 权限认证
- 样式系统
- 路由
- 组件封装

因此 `.claude` 中很多规则在这次任务中没有明显发挥作用。

但它仍然发挥了基础约束作用，例如：

- 函数参数和返回值需要显式类型。
- 不使用 `any`。
- 保持工具函数风格一致。
- 不随意修改无关文件。
- 不引入不必要依赖。
- 开发完成后执行 lint 和 TypeScript 类型检查。

这些约束比较基础，所以不容易被明显感知。

---

## Spec Kit 不能完全替代 .claude 的原因

如果只依赖 Spec Kit，而没有 `.claude` 项目规则，Claude 可能会出现以下问题：

- 每次新增页面都需要重新说明页面拆分规则。
- 前端可能错误使用 `observer()`，而不是项目约定的 `useObserver`。
- API 请求可能绕过项目封装。
- 认证信息可能错误存入 localStorage。
- 后端 Prisma 模型命名可能不符合项目约定。
- 公共组件可能不用 CSS Modules。
- 导入路径可能出现大量 `../../`。
- 代码风格和目录结构在不同 feature 中不一致。
- 项目级踩坑经验无法长期复用。

`.claude` 的价值在于把这些长期规则固化下来，让 Claude 不需要每次都从零理解项目规范。

---

## 最佳实践

### 适合放在 Spec Kit 中的内容

Spec Kit 适合承载当前 feature 的局部信息：

- 当前功能需求。
- 当前功能边界。
- 当前用户故事。
- 当前实现计划。
- 当前任务拆分。
- 当前验收标准。
- 当前是否需要测试。
- 当前不做哪些事情。

### 适合放在 .claude 中的内容

`.claude` 适合承载项目长期稳定规则：

- 技术栈说明。
- 架构决策。
- 目录结构规范。
- 代码风格规范。
- 安全红线。
- 前端、后端、共享包开发约定。
- Agent 自动触发规则。
- 常见踩坑经验。
- 通用验证流程。

---

## 推荐协作方式

在实际开发中，可以这样配合：

1. 使用 Spec Kit 生成当前 feature 的 `spec.md`、`plan.md`、`tasks.md`。
2. 让 Claude 按 `tasks.md` 执行当前 feature。
3. 在实现过程中，Claude 同时遵守 `.claude` 中的长期项目规范。
4. 如果某次 feature 有特殊要求，以用户当前明确指令和 Spec Kit 文档为准。
5. 如果遇到可长期复用的踩坑经验，再沉淀回 `.claude` 或项目记忆文件。

---

## 最终结论

`.claude` 配置仍然有用，而且很重要。

Spec Kit 和 `.claude` 的分工是：

| 工具      | 核心职责                                 | 生命周期          |
| --------- | ---------------------------------------- | ----------------- |
| Spec Kit  | 管当前 feature 的需求、计划、任务和验收  | 单个 feature 周期 |
| `.claude` | 管整个项目的长期规则、架构约束和开发习惯 | 长期持续有效      |

最准确的理解是：

> **Spec Kit 决定当前 feature 怎么推进，`.claude` 保证所有 feature 都符合项目长期规范。**

二者不是二选一，而是互补关系。
