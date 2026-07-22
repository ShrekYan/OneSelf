---
title: Claude加载机制：从启动到执行的完整拆解
slug: claude-code-loading-mechanism
date: 2024-06-01
tags: [Claude Code, 加载机制, 配置, 启动流程]
---

# Claude Code 加载机制：从启动到执行的完整拆解

你在项目目录敲下 `claude`，到 AI 开始输出代码，中间发生了什么？配置文件按什么顺序加载？Agent 怎么被触发？`@path` 怎么导入文件？Agent 的 `skills:` 怎么预加载？CLAUDE.md 和 Auto Memory 谁先生效？

这些问题不只是好奇心——**理解加载顺序，才能理解你写的配置到底有没有生效、在哪一步生效、会不会被覆盖。**

## 一、启动阶段：五步自动加载

每次启动 Claude Code，它会按固定顺序读取配置，不需要你手动触发：

```
settings.json → settings.local.json → CLAUDE.md → rules/（全量注入） → Auto Memory
```

前三步是系统层配置，第四步是项目规范全量注入，第五步是历史经验。

### 第 1 步：settings.json — 系统层配置

路径：`.claude/settings.json`

这是 Claude Code 启动后最先读取的文件，管的是"系统能力"：

| 配置项        | 管什么       | 示例                                |
| ------------- | ------------ | ----------------------------------- |
| `permissions` | 工具权限控制 | `deny: ["Bash(rm -rf:*)"]`          |
| `hooks`       | 操作拦截器   | `PreToolUse`、`PostToolUse`、`Stop` |
| `env`         | 环境变量     | API 地址、模型名称                  |
| `plugins`     | 启用的插件   | MCP Server 等                       |

这一步决定了 Claude Code **能做什么、不能做什么**。权限和 Hooks 在这一步就绑定了，后续所有操作都在这个框架内运行。

### 第 2 步：settings.local.json — 本地覆盖

路径：`.claude/settings.local.json`（可选）

如果你有个人特殊的配置需求（比如更严格的权限限制、本地调试用的环境变量），写在这里。**它的优先级高于 settings.json**——同样的配置项，local 覆盖公共。

```
settings.json → 团队共享，提交到 Git
settings.local.json → 个人专属，不提交到 Git
```

### 第 3 步：CLAUDE.md — 项目入口

路径：项目根目录 `CLAUDE.md`

这是 Claude Code 的"项目说明书"，告诉 AI 这个项目是什么、怎么干活：

- 项目描述和技术栈

- Agent 自动触发规则（用户输入匹配到哪个 Agent）

- 规范索引（指向 rules/ 和 skills/ 的入口）

- 项目记忆规则

**CLAUDE.md 是每次启动必加载的**，所以它应该精简——只放索引和触发规则，不放具体规范。具体规范放到 `rules/` 里（启动时全量注入），或 `skills/` 里（按需匹配加载）。

为什么不全塞进 CLAUDE.md？两个原因：一是上下文会臃肿，日常对话用不到所有规则；二是规则太多 AI 反而遵守不好，不如分层组织。

### 第 4 步：rules/ — 全量注入

路径：`.claude/rules/`

**rules/ 目录下的所有文件在启动时全量注入到上下文中**——不需要在 Agent 里重复引用，也不需要手动匹配，全部加载。

```yaml
# rules/typescript-common.md 示例
---
description: TypeScript 代码规范，包括类型安全、命名规范、导入规则
---
- 禁止使用 any 类型
- 导入路径统一使用 @/ 别名
- 组件必须包含 Props 类型定义
...
```

这意味着：

- **所有规则每次启动都生效**，不存在"某个 rule 没被匹配到所以没加载"的情况

- `description` 字段是给人看的说明，不是匹配条件

- rules/ 不依赖 Agent 引用，属于 Claude Code 自动发现和加载的项目规则

- rules/ 也没有 `when_to_use` 字段（那是 Skill 的机制）

**rules vs CLAUDE.md**：两者都是每次启动必加载，区别是组织方式——CLAUDE.md 是单一入口文件，放项目概述和触发规则；rules/ 是拆分后的详细规范，按主题分文件管理。拆开的好处是维护更清晰，坏处是如果规则文件太多，上下文一样会臃肿。

### 第 5 步：Auto Memory — 自动记忆

路径：`~/.claude/projects/[项目路径哈希]/memory/MEMORY.md`

这是 Claude Code 自己维护的"错题本"——每次对话中它学到的高频踩坑教训、项目特定注意事项。**每次启动自动加载**，不需要手动读取。

| 维度   | Auto Memory                   | CLAUDE.md / rules/                 |
| ------ | ----------------------------- | ---------------------------------- |
| 谁维护 | Claude Code 自动              | 人工编写                           |
| 位置   | 全局目录，不在项目里          | 项目目录内                         |
| 内容   | 高频踩坑、快速检查点          | 项目规范、触发规则                 |
| 权重   | 较低——AI 自己总结的，可能过时 | 较高——人工显式编写，刻意设计的约束 |

当 Auto Memory 和 CLAUDE.md / rules/ 中的规则冲突时，**以 CLAUDE.md / rules/ 为准**——它们是你刻意设计的约束，Auto Memory 是 AI 自己总结的经验，可能过时或不够准确。

五步加载完成后，Claude Code 有了：**系统能力边界**（step 1-2）+ **项目上下文**（step 3）+ **完整规范**（step 4）+ **历史经验**（step 5）。

## 二、Agent 触发阶段：从输入到匹配

加载完成后，Claude Code 等待你的输入。当你输入一条需求时，它要决定：**用哪个 Agent 来处理？**

### 触发流程

```
你输入: "帮我开发一个登录页面"
         ↓
Claude Code 根据输入特征匹配 Agent
         ↓
匹配到: frontend-developer Agent
         ↓
加载 .claude/agents/frontend-developer.md
```

### 匹配机制：两层保障

Claude Code 匹配 Agent 不是只靠一条路，而是有两层：

**第一层：Agent 自身描述匹配**

每个 Agent 文件都有 `name` 和 `description` 字段，Claude Code 启动时就知道有哪些 Agent 可用、各自擅长什么。当你的输入和某个 Agent 的描述匹配时，它就会自动选择该 Agent。

```yaml
# .claude/agents/frontend-developer.md
---
name: frontend-developer
description: 构建React移动端H5组件，包括页面开发、组件封装、Bug修复
---
```

**第二层：CLAUDE.md 触发规则（显式指引）**

CLAUDE.md 里可以写明确的触发规则，作为额外的映射指引：

```
## Agent 自动触发规则
- 开发前端页面/组件 → 使用 frontend-developer Agent
- 审查代码质量 → 使用 frontend-code-reviewer Agent
- 安全审计 → 使用 frontend-security-auditor Agent
```

**区别在于**：没有 CLAUDE.md 触发规则，Claude Code 仍然能通过 Agent 的 description 匹配到合适的 Agent；有了触发规则，匹配更准确、更可靠——尤其是当多个 Agent 的 description 有重叠时，显式规则能消除歧义。

可以类比为：Agent 的 description 是"简历"（AI 自己判断适不适合），CLAUDE.md 的触发规则是"岗位分配表"（你明确指定谁干什么）。两者都能让人找到对应的角色，但分配表更精确。

### 如果没匹配到任何 Agent？

Claude Code 直接用基础模型 + CLAUDE.md + rules/ 的通用规范来处理。相当于"没有专业角色，用通用能力干活"——能做，但没有专项规范约束，质量取决于通用规则够不够细。

## 三、Agent 加载阶段：官方引用与预加载

这是加载机制中最关键的一步：Agent 文件本身负责定义角色、工具权限和工作流程；公共规则、专项 Skill、模板文件则通过 Claude Code 官方支持的机制加载。

### Agent 文件不直接展开规则全文

在 Claude Code 中，Agent 文件通过 frontmatter 声明自身能力。以当前项目的 `.claude/agents/frontend-developer.md` 为例：

```yaml
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

这里的重点不是在 Agent 文件里手动拼接所有规范，而是分层加载：

- 公共规则放在 `.claude/rules/`，由 Claude Code 自动发现并加载。

- 专项能力放在 `.claude/skills/`，由 Agent frontmatter 的 `skills:` 预加载。

- 模板文件作为 Skill supporting files 保留在对应 Skill 目录下，任务需要时再读取。

### `skills:` 负责 Agent 专属能力预加载

`skills:` 是 Claude Code Subagent frontmatter 支持的字段。Agent 启动时，列表中的 Skill 会被预加载到上下文中，适合放页面创建、组件创建、增量 lint 等与该 Agent 强相关的能力。

```
Agent 文件
  ↓
读取 frontmatter
  ↓
根据 skills: 预加载指定 Skill
  ↓
Agent 按角色说明 + 公共规则 + 专项 Skill 执行任务
```

这种方式比把所有内容写进 Agent 主体更清晰：Agent 保持角色和流程定义，Skill 承载可复用能力，模板作为 supporting files 按需读取。

### `@path` 负责 CLAUDE.md / CLAUDE.local.md 文档导入

如果需要在 `CLAUDE.md` 或 `CLAUDE.local.md` 中导入其他说明文件，应使用 Claude Code 官方支持的 `@path` 语法。例如当前项目的 `CLAUDE.local.md`：

```
### 技术决策方案（FADR）

@.claude/FADR.md

### 业务架构决策（BADR）

@.claude/BADR.md
```

`@path` 的作用边界很清楚：它用于 Memory 文档导入，支持相对路径、绝对路径和递归导入；相对路径以包含 `@path` 的文件为基准解析。它适合导入项目说明、决策文档、团队工作流等长期上下文。

### 当前项目推荐分层

| 内容类型                 | 推荐位置               | 加载方式                           |
| ------------------------ | ---------------------- | ---------------------------------- |
| 项目入口、Agent 调度规则 | `CLAUDE.md`            | 启动时加载                         |
| 本地决策文档入口         | `CLAUDE.local.md`      | 通过 `@path` 导入                  |
| 通用强约束规则           | `.claude/rules/`       | 自动发现并加载                     |
| Agent 专属能力           | `.claude/skills/`      | Agent frontmatter `skills:` 预加载 |
| 页面/组件模板            | Skill supporting files | 按任务需要读取                     |

这套分层能避免 Agent 文件过重，也能保证通用规则、专项能力和长期决策文档各自放在正确位置。

## 四、Skill 触发阶段：命令与自动

Skill 有两种触发方式：**命令触发** 和**自动触发**。

### 方式一：命令触发

```
你输入: /frontend-code-review
         ↓
Claude Code 查找 .claude/commands/frontend-code-review.md
         ↓
Command 文件里指向 Skill: #use: frontend-code-reviewer
         ↓
加载 .claude/skills/frontend-code-reviewer/SKILL.md
         ↓
执行技能定义的操作
```

Command 是用户可见的入口，Skill 是实际的能力实现：

```
commands/ → 用户入口（/xxx 命令）
              ↓ 引用
skills/ → 实际技能（可复用的能力模块）
```

### 方式二：自动触发

Claude Code 执行任务时，会读取所有 Skill 的头部描述（`description` 和 `when_to_use`）。当任务内容和某个 Skill 的描述匹配时，Claude Code 会主动加载该 Skill——不需要你手动输入命令。

```yaml
# SKILL.md 示例
---
name: frontend-code-reviewer
description: 审查前端代码的架构合规性、代码质量和兼容性
when_to_use: 当用户要求审查、检查、review 前端代码时使用
---
```

Claude Code 读取 `description` 和 `when_to_use` 后，判断当前任务是否匹配。匹配则自动加载，不匹配则跳过。

**这意味着**：写好 Skill 的 `description` 和 `when_to_use` 很重要——它直接决定了 Skill 能不能被自动触发。描述不清晰，Claude Code 就匹配不到。

### Agent vs Skill vs Rules 的区别

| 维度         | Agent                                  | Skill                                   | Rules                    |
| ------------ | -------------------------------------- | --------------------------------------- | ------------------------ |
| 触发方式     | 自动匹配（CLAUDE.md 触发规则）         | 命令触发 + 自动触发（description 匹配） | 无需触发，启动时全量注入 |
| 定位         | 完整的角色定义                         | 可复用的能力模块                        | 项目规范约束             |
| 加载机制     | frontmatter `skills:` 预加载专项 Skill | 按需匹配加载，也可被 Agent 预加载       | 启动时全量加载           |
| 支持引用方式 | 通过 `skills:` 引用 Skill              | supporting files 按需读取               | 不依赖 Agent 引用        |

## 五、完整加载流程：一图看全

```
你启动 claude
      │
      ▼
┌──────────────────────────────────────────┐
│ 启动阶段（自动，无需干预）                 │
│                                          │
│ 1. settings.json → 系统能力边界           │
│ 2. settings.local.json → 本地覆盖         │
│ 3. CLAUDE.md → 项目规范 + 索引            │
│ 4. rules/ → 全量注入项目规范              │
│ 5. Auto Memory → 历史经验                 │
└──────────────────┬───────────────────────┘
                   │
                   ▼
              等待你的输入
                   │
         ┌─────────┴─────────┐
         │                   │
    自然语言输入          /命令输入
         │                   │
         ▼                   ▼
    Agent 自动匹配      Command 查找
    （description +    （description + CLAUDE.md 触发规则）
    CLAUDE.md 触发规则）
         │                   │
         ▼                   ▼
    加载 Agent 文件    #use 指向 Skill
    skills: 预加载     （加载 SKILL.md）
    （专项 Skill 注入）        │
         │                   │
         ▼                   ▼
┌──────────────────────────────────────────┐
│ 执行阶段                                 │
│                                          │
│ Skill description 匹配                   │ ← 任务匹配时自动加载
│                                          │
│ 模型拿到完整上下文后输出                  │
│ Hooks 在操作前后拦截/检查                 │
│ 权限系统控制能做什么                      │
└──────────────────────────────────────────┘
```

注意：rules/ 在启动阶段就已经全量注入了，执行阶段不需要再加载。

## 六、加载顺序的实战意义

理解加载顺序不只是理论——它直接影响你的配置策略。

### 优先级规则

```
settings.local.json > settings.json > CLAUDE.md / rules/ > Auto Memory
```

同一条规则，优先级高的覆盖优先级低的。所以：

- **权限 deny** → 写在 settings.json 里（团队强制），settings.local.json 只能加更多限制，不能放宽

- **项目规范** → 写在 CLAUDE.md 里（每次加载，但要精简）或 rules/ 里（每次加载，详细规范拆分管理）

- **踩坑经验** → 放在 Auto Memory 里（自动维护，自动加载，但优先级最低）

### 配置层级的选择原则

| 你要加的规则                  | 放哪里                    | 为什么                             |
| ----------------------------- | ------------------------- | ---------------------------------- |
| 所有开发者必须遵守的安全红线  | settings.json permissions | 系统级强制，不可绕过               |
| 你个人的本地调试配置          | settings.local.json       | 不影响团队，优先级更高             |
| 项目整体描述和 Agent 触发规则 | CLAUDE.md                 | 每次必加载，但要精简               |
| 特定主题的详细规范            | rules/                    | 启动时全量注入，按主题拆分文件管理 |
| 可复用的能力模块              | skills/                   | 按需匹配加载，不浪费上下文         |
| 反复踩坑的教训                | Auto Memory               | 自动维护，下次自动生效             |

### 两个常见错误

**错误一：把所有规则都塞进 CLAUDE.md。** 它确实每次都加载，但上下文会被大量规则淹没，AI 在长对话后期对早期规则的遵守度明显下降。正确做法：CLAUDE.md 只放索引和触发规则，详细规范拆到 rules/。

**错误二：rules/ 文件太多。** rules/ 是全量注入的，10 个规则文件和 1 个规则文件都一样全部加载。如果 rules/ 里有大量只在特定场景才用到的规范，同样会浪费上下文。正确做法：rules/ 放通用规范，场景特定的规范放到 skills/ 里按需加载；某个 Agent 必备的专项能力，通过 Agent frontmatter 的 `skills:` 预加载。

## 七、FAQ

### Q: 怎么确认我的配置到底有没有被加载？

在 Claude Code 里直接问它："你加载了哪些配置文件？当前的 CLAUDE.md 内容是什么？"它会如实回答。如果某个规则没生效，先检查文件路径和加载顺序。

### Q: Agent 里的专项规范应该怎么加载？

优先把专项规范整理成 Skill，并在 Agent frontmatter 的 `skills:` 中声明。公共规则放 `.claude/rules/` 自动加载，长期项目说明或决策文档放 `CLAUDE.md` / `CLAUDE.local.md`，通过 `@path` 导入。

### Q: Agent 没被自动触发怎么办？

检查 CLAUDE.md 的触发规则是否写清楚了输入特征。也可以用 `/` 命令手动指定。最简单的验证方式：问 Claude Code "你应该用哪个 Agent 处理这个请求？"

### Q: Auto Memory 和 CLAUDE.md / rules/ 里的规则冲突了怎么办？

**以 CLAUDE.md / rules/ 为准。** 它们是你显式编写的约束，Auto Memory 是 AI 自己总结的经验，可能过时或不够准确。如果 Auto Memory 里的某条经验和你的规范冲突，可以在对话中让 Claude Code 更新 Auto Memory。

### Q: rules/ 和 skills/ 都能放规范，怎么选？

**rules/**：启动时全量加载，放所有场景都用到的通用规范。如果只在特定场景才用，放 rules/ 会浪费上下文。

**skills/**：按需匹配加载，放特定场景的能力模块。只有任务匹配到 Skill 的 description / when_to_use 时才加载，不浪费上下文。

简单判断：**这条规范每次对话都可能用到吗？** 是 → rules/；否 → skills/。
