---
title: Skills实战指南：让AI精准执行你的工程规范
slug: claude-code-skills-guide
date: 2024-06-01
tags: [Claude Code, Skills, 工程规范]
---

# Claude Code Skills 实战指南：让 AI 精准执行你的工程规范

## 前言

在前面的文章里，我们聊了 Claude Code 的目录结构、记忆系统、MCP、权限、子代理（Agent）。今天这篇聚焦 `.claude/skills/` — 一个经常被忽视但实际价值极高的配置目录。

CLAUDE.md 可以约束 AI 的行为，但它只能声明"不要做什么"。而 Skills 不同，它是一个主动的任务蓝图：把"做什么""怎么做""用什么模板""怎么验证结果"打包成一个可复用单元。

换句话说，**CLAUDE.md 是护栏，Skills 是导航仪**。

## 一、基础介绍

### 什么是 Skill

Skill 是 Claude Code 中的结构化可复用任务包。一个完整的 Skill 包含：

- **触发条件**：什么时候该用这个 Skill

- **执行流程**：按什么步骤完成任务

- **资源文件**：模板、脚本、参考文档

- **权限控制**：允许使用哪些工具

- **校验规则**：怎么判断结果是否符合预期

它不是一个简单的 prompt 模板，而是一个从"识别任务"到"交付结果"的完整工作流定义。

### Skill 在配置体系中的位置

先回顾一下 `.claude/` 下各配置角色的分工：

| 配置项    | 本质         | 加载方式                | 典型用途                 |
| --------- | ------------ | ----------------------- | ------------------------ |
| CLAUDE.md | 全局规则     | 每次对话必加载          | 项目背景、核心约束       |
| skills/   | 可复用任务包 | 按触发条件加载          | 创建页面、代码审查       |
| commands/ | 快捷命令     | 用户主动调用            | /dev、/review            |
| agents/   | 专家角色     | 被 Skill 调度或用户指定 | 前端开发专家、安全审计员 |

Skill 的独特价值在于：**它是唯一把"规范 + 模板 + 脚本 + 参考"打包成可复用单元的机制**。

CLAUDE.md 只能声明约束，commands 只是快捷入口，agents 定义角色但不自带模板和流程。只有 Skill 把这些都串起来——触发时加载规范，执行时使用模板，完成时校验结果。

### Skill 解决的三个痛点

**痛点一：重复任务的一致性**

团队里每个人创建页面、组件的方式不同，代码风格分裂。Skill 把"怎么创建一个标准页面"固化成模板+流程，谁调用都是同一套标准。

**痛点二：上下文精确控制**

CLAUDE.md 里塞太多规则，每次对话都要消耗 token，而且 AI 容易在大量规则中"迷失"。Skill 只在需要时加载，不相关的时候零开销。

**痛点三：经验沉淀**

踩过的坑，写进 Skill 的禁止项和检查清单，AI 就不会再犯。这比口口相传或者写 Wiki 文档有效得多——因为 Wiki 人会忘看，Skill 是 AI 必须遵守的。

## 二、核心属性

### 最小配置：两个必需字段

```
---
name: my-skill
description: "一句话说清这个 skill 做什么、什么时候用"
---
```

`name` 和 `description` 是创建 Skill 的最低门槛。但真实项目中，只靠这两个字段远远不够。

### 按功能分组理解属性

把属性按功能分组理解，比逐个罗列更有价值：

#### 触发控制：决定 Skill 何时被激活

| 属性             | 作用                                    | 实战建议                                 |
| ---------------- | --------------------------------------- | ---------------------------------------- |
| `name`           | 全局唯一标识，kebab-case 命名           | 见名知意，如 `page-creator` 而非 `pc`    |
| `description`    | 语义匹配的核心，AI 据此判断是否触发     | 写清楚"做什么 + 什么时候用"              |
| `when_to_use`    | 补充触发上下文，与 description 拼接匹配 | 列出关键词和典型场景，250 字符内         |
| `paths`          | 条件加载，仅处理匹配文件时激活          | 精确控制，避免无关场景误触发             |
| `user-invocable` | 是否允许用户通过斜杠命令主动调用        | 基础工具设 true，内部辅助 Skill 设 false |

**description 是最重要的属性**，因为它直接决定 AI 能否在正确的时机选中你的 Skill。写法建议：

```
当 [核心场景] 时使用此技能。触发词包括 [关键词/场景]。也适用于 [相邻场景]。不适用于 [排除场景]。
```

举一个实际对比：

```
# 好的 description
description: "按照项目规范创建 React 页面，包含 MobX 状态管理、常量定义和样式文件。当用户要求创建页面、添加新路由、搭建页面模块时使用。不适用于创建独立组件。"

# 差的 description
description: "页面创建技能"
```

前者给了 AI 足够的语义信息来判断"该不该用"，后者太模糊，容易误触发或漏触发。

#### 执行控制：决定 Skill 怎么运行

| 属性                       | 作用                                      | 实战建议                                 |
| -------------------------- | ----------------------------------------- | ---------------------------------------- |
| `context`                  | fork（独立上下文）或 inline（共享主对话） | 一次性任务用 fork，连续交互用 inline     |
| `allowed-tools`            | 工具权限白名单                            | 最小权限原则，只给必要权限               |
| `model`                    | 指定执行模型                              | 复杂推理用高能力模型，简单任务用轻量模型 |
| `effort`                   | 思考深度                                  | 模板填充用 low，架构决策用 high          |
| `disable-model-invocation` | 纯脚本模式，不调用模型                    | 确定性脚本任务设 true                    |

`context: fork` 和 `allowed-tools` 的组合特别重要——fork 创建隔离环境，allowed-tools 在这个环境里划出权限边界。两者配合，确保 Skill 不会越权操作。

#### 参数与高级配置

- `arguments` + `argument-hint`：定义 Skill 的位置参数，在正文中通过 `$1`、`$2` 引用

- `agent`：指定关联的 Agent，Skill 执行时自动实例化该 Agent

- `hooks`：在特定时机自动执行命令（如 PreToolUse 时运行 linter）

### 一个贴近实战的配置示例

```
---
name: page-creator
description: "按照项目规范创建 React 页面，包含 MobX store、常量定义和 SCSS 样式文件。当用户要求创建页面或搭建页面模块时使用。"
when_to_use: "触发词包括'创建页面'、'新建页面'、'添加路由'、'搭建页面'。"
user-invocable: true
context: fork
allowed-tools: [Read, Write, Edit, Bash]
model: claude-sonnet-4-6
effort: high
paths: ["src/pages/**/*"]
arguments: ["page-name"]
argument-hint: "要创建的页面名称（如 user-profile）"
---
```

这个配置的含义：当用户提到"创建页面"或正在操作 `src/pages/` 下的文件时，AI 会自动识别并激活这个 Skill；在隔离环境中以高思考深度执行，只允许读写和运行命令。

## 三、Skills 使用方式

### 三种触发模式

**1. 斜杠命令主动触发**

用户在对话中输入 `/page-creator user-profile`，直接调用对应 Skill，`user-profile` 作为 `$1` 传入正文。

适合：明确的、用户知道自己要做什么的场景。

**2. 语义匹配自动触发**

AI 根据 `description` 和 `when_to_use` 的语义，自动判断当前任务是否匹配某个 Skill。

适合：用户可能不知道 Skill 存在，但描述的任务恰好对应某个 Skill 的场景。

**3. 路径匹配条件触发**

当 AI 处理的文件路径匹配 `paths` 中的 glob 模式时，自动激活对应 Skill。

适合：特定文件类型的操作规范，如只在 `.scss` 文件上激活样式规范 Skill。

三种模式可以叠加——一个 Skill 可以同时支持斜杠命令、语义触发和路径触发。

### 执行流程

```
触发 → 解析 frontmatter → 应用权限 → 创建执行环境 → 执行正文 → 返回结果
```

关键环节说明：

1. **解析 frontmatter**：读取 Skill 的配置属性，确定执行参数

2. **应用权限**：`allowed-tools` 覆盖默认权限，构建安全沙箱

3. **创建执行环境**：`context: fork` 时创建隔离环境，`inline` 时在当前对话中继续

4. **执行正文**：按 SKILL.md 中定义的工作流运行

5. **返回结果**：fork 模式下结果回到主对话，inline 模式下直接在当前对话输出

### fork vs inline：关键选择

| 维度       | fork                   | inline                   |
| ---------- | ---------------------- | ------------------------ |
| 上下文     | 独立隔离，不污染主对话 | 共享主对话历史           |
| Token 消耗 | 只加载 Skill 相关内容  | 包含主对话全部历史       |
| 适用场景   | 一次性、可闭环的任务   | 需要对话上下文的连续任务 |
| 结果返回   | 任务完成后回到主对话   | 直接在当前对话输出       |

**实战建议**：大多数 Skill 应该用 fork。只有当 Skill 的执行严重依赖主对话的上下文（比如根据之前的讨论做后续处理）时才用 inline。

### Skill 与 Agent 的协作

当 Skill 配置了 `agent` 字段且 `context: fork` 时，执行流程会多一步：

```
触发 → 解析配置 → 实例化 Agent → 在 fork 环境中运行 Agent → 返回结果
```

Skill 是任务蓝图，Agent 是执行专家。Skill 定义"做什么"，Agent 决定"以什么角色和专业能力来做"。

例如，一个代码审查 Skill 可以指定 `agent: code-reviewer`，让代码审查专家在隔离环境中执行审查流程，而不是由通用 AI 凭常识审查。

这种协作关系是单向的：Skill → Agent 可以触发，但 Agent 不会反向调用特定 Skill。

## 四、怎么使用 AI 辅助生成 Skills 规则

这一节是整篇文章最"元"的部分：**用 AI 来写给 AI 看的规则**。

很多人写 Skill 的方式是：打开 SKILL.md → 凭想象写一堆规则 → 发现 AI 根本不按预期执行 → 怀疑 Skill 没用 → 放弃。

问题不在 Skill 机制，而在生成方式。正确做法是：**让 AI 参与规则的生成和迭代**。

### 核心循环：描述 → 生成 → 试用 → 修正

```
自然语言描述意图 → AI 生成初稿 → 实际场景试用 → 观察偏差 → 修正规则 → 再试用 → 稳定
```

这不是一次性的，而是一个迭代过程。每次试用中发现的偏差，都是规则不完善的信号。

### 第一步：用自然语言描述意图

不要一上来就写 YAML frontmatter。先像跟同事说话一样，描述你想要的行为：

我想让 AI 在创建 React 页面时，自动生成 index.jsx、useStore.js、constant.js、index.scss 四个文件，每个文件都要遵循我们项目的规范。useStore 里要用 createShareStore + useLocalStore 的组合，constant.js 里不能放 UI 文案，SCSS 必须按 DOM 层级嵌套。

这种描述虽然不够结构化，但信息量足够让 AI 理解你的意图。结构化是后面迭代的事，不是起点。

### 第二步：让 AI 生成初稿

把上面的自然语言描述交给 Claude，让它生成 SKILL.md 的初版。

这一步的关键是：**接受初版一定不完美**。初版的作用是给出一个可执行的起点，而不是最终版本。它可能有遗漏、可能有过度约束，但它给了你一个可以试用的东西。

### 第三步：实际试用，观察偏差

在实际场景中使用这个 Skill，仔细观察 AI 的输出与你的预期之间的差距。

常见偏差类型：

| 偏差类型 | 表现              | 修正方式                        |
| -------- | ----------------- | ------------------------------- |
| 遗漏     | AI 跳过了某个步骤 | 在 Workflow 中补充该步骤        |
| 越界     | AI 做了不该做的事 | 在 Constraints 中添加禁止项     |
| 偏离     | AI 的输出格式不对 | 在 Output format 中给出明确模板 |
| 不稳定   | 有时对有时不对    | 添加检查清单或校验步骤          |

### 第四步：把纠正转化为规则

这是最关键的一步。**每次你发现 AI 做错了，不要只是手动改结果，而是把纠正写回 Skill 规则。**

举几个实际例子：

- AI 把页面标题放进了 constant.js → 在 constant-js 模板的 Constraints 里加上"禁止放置页面标题、按钮文案等 UI 展示内容"

- AI 在 SCSS 里手写了 vw 单位 → 在样式模板里加上"禁止手写 vw，直接写设计稿 px 值"

- AI 在子组件里直接 import 了父页面的 store → 在子组件模板里加上"不建议直接引用父级 useStore，优先通过 props 传递"

- AI 在 SCSS 里把父子 DOM 的 class 拍平成同级选择器 → 加上"SCSS 嵌套层级必须与 JSX DOM 层级一致，禁止父子 class 拍平"

**最有价值的规则来自失败案例，而不是理想描述。** 你能写出的最好的 Constraints，都是 AI 实际犯过的错。

### 实用技巧

**1. 从简开始，逐步加规则**

初版 Skill 只写最核心的流程和最关键的禁止项。不要试图一次覆盖所有边界情况——你无法预见所有边界，但可以在使用中逐步发现。

一个判断标准：如果某个规则你还没见过 AI 违反，就不需要提前写。等它违反了再补，比预判所有可能性更高效。

**2. 禁止项比建议项更有价值**

"应该做什么"是方向性指导，AI 有时会理解偏差。"不能做什么"是硬边界，AI 更容易遵守。

写法对比：

```
# 弱约束——AI 可能理解为"尽量"
- 建议 SCSS 选择器与 DOM 层级保持一致

# 强约束——AI 知道这是红线
- SCSS 选择器嵌套层级必须与 JSX DOM 层级一致，禁止父子 DOM class 拍平成同级选择器
```

后者比前者有效得多。原因很简单：AI 的"创造力"在约束不清晰时会把事情带偏，明确的禁止项直接收窄了发挥空间。

**3. 给判断条件，不给模糊建议**

```
# 模糊——AI 凭感觉决定
- 页面复杂时考虑拆分组件

# 明确——AI 有量化依据
- 当 index.jsx 超过 300 行、JSX 嵌套超过 4 层、或页面有 3 个以上独立业务区块时，必须拆分子组件
```

明确的阈值让 AI 有判断依据，而不是凭感觉决定。你给的阈值越具体，AI 的执行越稳定。

**4. 模板 + 规则 + 检查清单 = 完整闭环**

- **模板** 告诉 AI "正确长什么样"

- **规则** 告诉 AI "必须怎么做、不能怎么做"

- **检查清单** 让 AI 在完成后自检

三者缺一，都会导致执行偏差。有模板没规则，AI 可能照猫画虎但细节不对；有规则没模板，AI 知道方向但不知道起点；有模板和规则没检查清单，AI 可能遗漏关键步骤而不自知。

**5. 大段规则拆到 reference/，SKILL.md 只引用**

当某个方面的规则超过 10 行，就应该拆到独立的 reference 文件中。SKILL.md 只写"按 `reference/naming-convention.md` 执行命名规范"，需要时才加载，不需要时零开销。

这个原则的本质是**按需加载**——CLAUDE.md 的规则每次对话都占上下文，Skill 的 reference 只在触发时才读。把低频但重要的规则放在 reference/ 里，既保证需要时能找到，又不会在不需要时浪费 token。

### 常见误区

**误区一：试图一次写完美 Skill**

Skill 是活文档，随项目迭代。正确的做法是先跑起来，再逐步完善。写了不用等于没写。

**误区二：规则越细越好**

过细的规则会导致上下文爆炸，AI 反而更容易迷失。只在 AI 反复出错的点加规则，不出错的地方不用管。一个只有 5 条硬约束的 Skill，往往比一个 50 条细则的 Skill 更有效。

**误区三：只写"应该做"，不写"不能做"**

AI 的"创造力"有时是灾难——它可能用一种你没见过但完全不符合项目规范的方式完成任务。明确的禁止项是最高效的约束。

**误区四：忽略校验环节**

执行完不检查，等于把质量把关完全交给 AI。在 Workflow 最后加一步"对照检查清单验证"，能显著提高输出质量。

## 五、Skills 实战

### 实战案例一：前端页面开发模板体系

这个案例展示一个真实项目中完整的 Skill 体系——不是一个孤立的 SKILL.md，而是一组相互配合的模板 Skill，加上一个调度它们的 Agent。

#### 体系架构

```
.claude/
├── rules/ # 公共规则，Claude Code 自动发现并加载
│   ├── 000-forbidden.md
│   ├── 100-tech-stack.md
│   ├── 150-commenting-standard.md
│   ├── 200-checklist.md
│   └── 300-naming.md
├── skills/
│   ├── frontend-developer-create-page/
│   │   └── SKILL.md # 创建页面规范
│   ├── frontend-developer-create-component/
│   │   └── SKILL.md # 创建组件规范
│   ├── frontend-developer-lint/
│   │   └── SKILL.md # 增量 lint 规范
│   └── page-templates/ # 页面开发模板 Skill
│       ├── SKILL.md # 模板 Skill 入口
│       ├── index-jsx.md # 页面入口组件模板
│       ├── use-store-js.md # MobX 状态管理模板
│       ├── constant-js.md # 常量定义模板
│       ├── index-scss.md # 页面样式模板
│       ├── 750-design-vw-guide.md # vw 适配规范
│       ├── sub-component-jsx.md # 子组件模板
│       ├── component-split-guide.md # 拆分判断指南
│       ├── component-hooks-guide.md # Hooks 抽离指南
│       ├── component-http-request.md # 组件请求规则
│       └── handle-js.md # 业务工具函数模板
└── agents/
    └── frontend-developer.md # 通过 skills: 预加载相关 Skill
```

#### Agent 如何调度 Skills

这里之前容易理解错的一点是：**Claude Code 官方支持的方式不是在 Agent 文件里写 `#include:`。**

当前正确方案是：

1. 公共规则放在 `.claude/rules/` 下，由 Claude Code 自动加载；

2. Agent 通过 frontmatter 的 `skills:` 字段预加载需要的 Skill；

3. 复杂模板作为 Skill 的 supporting files 存放，`SKILL.md` 中用 Markdown 链接说明，Claude 在需要时读取；

4. Agent 正文只保留角色定位、工作流程、禁止项和输出格式，不手动展开所有模板。

实际的 `frontend-developer.md` 结构长这样：

```
---
name: frontend-developer
description: 项目专属前端开发 Agent，React 18 + MobX 移动端 H5 开发专家
tools: Read, Write, Edit, Glob, Grep, Bash, mcp__ide__getDiagnostics
model: inherit
skills:
  - frontend-developer-create-component
  - frontend-developer-create-page
  - frontend-developer-lint
  - page-templates
---
```

正文部分则说明加载关系和执行流程：

```
## 官方加载说明
- 公共规则由 `.claude/rules/` 自动加载。
- 本 Agent 专属 Skill 由 frontmatter `skills:` 预加载。
- 页面模板作为 Skill supporting files，按任务需要读取。

# frontend-developer Agent

## Purpose
你是项目的唯一前端开发专家。上面嵌入的所有规范和模板是你必须遵守的底线，禁止按通用经验自由发挥。

## Mandatory Workflow
1. 匹配规范（根据任务类型选择对应 Skill 和模板）
2. 理解项目现有代码风格（读取 1-2 个相关文件）
3. 按规范编写代码
4. 增量 lint 检查（只针对变更文件）
```

几个关键设计点：

**1. `skills:` 是 Subagent 官方支持的预加载机制。** Agent 启动时，frontmatter 中列出的 Skill 会被注入到该 Agent 的上下文里。相比手写 `#include:`，这更符合 Claude Code 的官方加载模型，也更容易维护。

**2. supporting files 不是自动全文展开。** `page-templates` 这类模板文件属于 Skill 的辅助文件，适合放长篇模板、示例和细则。`SKILL.md` 可以通过 Markdown 链接说明这些文件的用途，Claude 会知道它们存在，并在需要时读取。

**3. 公共规则和任务 Skill 分层。** `.claude/rules/` 承担全局底线，例如技术栈、注释、命名和禁止项；`skills:` 承担具体任务流程，例如创建页面、创建组件、增量 lint；`page-templates/` 承担模板细节。这样既避免 Agent 文件无限膨胀，也避免每次任务都加载无关细节。

#### 执行时的完整流程

当用户说"创建一个用户详情页"：

1. 主 Claude 根据项目规则把前端开发任务交给 `frontend-developer` Agent

2. `frontend-developer` Agent 启动，并通过 `skills:` 预加载所有相关 Skill
