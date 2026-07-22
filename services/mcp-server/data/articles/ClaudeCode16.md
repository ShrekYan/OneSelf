---
title: 文件引用与加载机制完整实践：从CLAUDE.md到Skills与Subagents
slug: claude-code-file-reference-loading-mechanism
date: 2024-06-01
tags: [Claude Code, 文件引用, 加载机制, Skills, Subagents]
---

# Claude Code 文件引用与加载机制完整实践：从 CLAUDE.md 到 Skills 与 Subagents

在使用 Claude Code 做项目级开发时，很多团队会遇到一个问题：规范、模板、示例、命令、Agent 配置越来越多，应该如何组织，才能既让 Claude Code 正确加载，又不把上下文塞爆？

本文系统整理 Claude Code 官方支持的文件引用与加载方式，包括 `CLAUDE.md` 文件导入、`.claude/rules/` 自动规则、Skills supporting files、动态命令注入、Subagent 预加载 Skill、Skill 参数替换，以及旧版 `.claude/commands` 的兼容行为。

## 一、为什么需要理解 Claude Code 的文件加载机制？

在真实项目中，Claude Code 往往不只是"聊天式写代码"，而是会承担更多工程化角色，例如：

- 遵循项目技术栈规范；

- 根据团队代码风格生成代码；

- 使用固定模板创建页面或组件；

- 根据接口文档生成 service；

- 在提交前读取 git diff 并生成 commit message；

- 通过 Subagent 拆分开发、审查、性能、安全等职责。

这些能力背后都依赖一个核心问题：**Claude Code 如何发现、加载、引用和注入上下文？**

如果加载方式用错，常见问题包括：

- 规则没有生效；

- Skill 文件过大，调用时上下文臃肿；

- 模板文件明明存在，但 Claude 没读到；

- Agent 启动后没有获得预期规范；

- slash command 参数无法正确替换；

- 动态命令输出没有注入到上下文。

下面按使用场景逐一说明。

## 二、在 CLAUDE.md / CLAUDE.local.md 中使用 @path 导入文件

### 适用场景

`CLAUDE.md` 和 `CLAUDE.local.md` 适合存放项目级或个人级长期规则。

如果规则内容较多，可以通过 `@path` 导入其他文件，避免主配置文件过长。

常见用途：

- 导入项目 README；

- 导入 `package.json`；

- 导入团队工作流文档；

- 导入个人偏好配置；

- 复用已有 `AGENTS.md`；

- 导入架构决策文档。

### 基础案例

```
# CLAUDE.md

# 项目说明

See @README.md for project overview.

# 项目命令

@package.json

# Git 工作流

@docs/git-instructions.md
```

这表示 Claude Code 在加载 `CLAUDE.md` 时，会把这些被引用的文件展开进上下文。

### 本地私有配置案例

```
# CLAUDE.local.md

# 我的个人项目偏好

@~/.claude/my-project-instructions.md
```

`CLAUDE.local.md` 通常不提交到仓库，适合放个人偏好、私有路径、个人工作流。

### 递归导入案例

```
# CLAUDE.md

@.claude/project-index.md
```

```
# .claude/project-index.md

@rules/000-forbidden.md
@rules/100-tech-stack.md
```

这样可以把项目规则拆成多个文件，再由一个索引文件统一导入。

### 官方规则要点

- 支持相对路径和绝对路径；

- 相对路径相对于包含 `@path` 的文件解析；

- 导入文件会展开并加载进上下文；

- 支持递归导入；

- 最大递归深度为 4 层；

- 第一次遇到外部导入时，Claude Code 会弹出审批；

- 如果拒绝审批，导入会保持禁用，并且不会再次弹窗。

### 实践建议

建议把 `CLAUDE.md` 控制在"入口文件"定位，不要堆大量细则。可以采用：

```
CLAUDE.md
├── @.claude/rules/000-forbidden.md
├── @.claude/rules/100-tech-stack.md
└── @.claude/project-workflow.md
```

如果是个人本地决策文档，可以放在：

```
CLAUDE.local.md
└── @.claude/FADR.md
```

## 三、使用 .claude/rules 自动加载项目规则

### 适用场景

`.claude/rules/` 用于把较大的项目规范拆分成多个规则文件，让 Claude Code 自动发现并加载。

常见用途：

- 代码风格规范；

- 测试规范；

- 安全规范；

- 前端规范；

- 后端规范；

- API 规范。

### 目录案例

```
your-project/
├── CLAUDE.md
└── .claude/
    └── rules/
        ├── code-style.md
        ├── testing.md
        └── security.md
```

### 规则文件案例

```
# Code Style Rules

- Use 4 spaces for indentation.
- Prefer functional components.
- Do not introduce unnecessary dependencies.
```

### 官方规则要点

- `.claude/rules/` 下的 `.md` 文件会被 Claude Code 发现并加载；

- 支持递归子目录；

- 没有 `paths` frontmatter 的规则会无条件加载；

- 适合放通用、长期有效的项目规则。

### 实践建议

可以按优先级编号组织规则：

```
.claude/rules/
├── 000-forbidden.md
├── 100-tech-stack.md
├── 150-commenting-standard.md
├── 200-checklist.md
└── 300-naming.md
```

这种结构的好处是：

- 一眼能看出规则优先级；

- 禁止项集中管理；

- 技术栈、注释、检查清单、命名规范分层清晰。

## 四、使用 paths frontmatter 做路径匹配规则

### 适用场景

有些规则不应该全局生效，而应该只在处理特定文件时生效。

例如：

- 只对 API 文件生效的规则；

- 只对 React 组件生效的规则；

- 只对测试文件生效的规则；

- 只对 Markdown 文档生效的规则。

### 单路径案例

```yaml
---
paths:
  - 'src/api/**/*.ts'
---
# API Development Rules

- All API endpoints must include input validation.
- Use the standard error response format.
- Include OpenAPI documentation comments.
```

含义是：当 Claude Code 处理匹配 `src/api/**/*.ts` 的文件时，这个规则才会生效。

### 多路径案例

```yaml
---
paths:
  - 'src/**/*.{js,jsx}'
  - 'tests/**/*.test.js'
---
# JavaScript Rules

- Use existing project utilities.
- Keep test cases focused.
```

### 官方规则要点

- 使用 YAML frontmatter 中的 `paths` 字段声明匹配路径；

- 支持 glob pattern；

- 路径匹配规则在 Claude 读取匹配文件时触发；

- 适合降低上下文噪音，只在相关文件场景加载规则。

### 实践建议

如果你的项目中既有前端、后端、测试、文档，建议使用路径匹配规则减少无关上下文。

例如：

```
.claude/rules/
├── frontend.md # paths: src/**/*.{js,jsx,scss}
├── backend.md # paths: server/**/*.js
├── testing.md # paths: **/*.test.js
└── docs.md # paths: docs/**/*.md
```

这样 Claude Code 在处理前端文件时，不会被后端规则干扰。

## 五、Skill 中引用 supporting files

### 适用场景

Skill 可以理解为 Claude Code 的可复用能力包。一个 Skill 不一定只有一个文件，除了入口 `SKILL.md`，还可以包含模板、示例、脚本、参考资料等 supporting files。

常见用途：

- 模板文件；

- 示例文件；

- 详细 API 文档；

- 长篇规范文档；

- 辅助脚本。

### 目录案例

```
.claude/skills/page-templates/
├── SKILL.md
├── 750-design-vw-guide.md
├── index-jsx.md
├── use-store-js.md
├── constant-js.md
├── index-scss.md
├── handle-js.md
├── sub-component-jsx.md
├── component-hooks-guide.md
├── component-http-request.md
└── component-split-guide.md
```

### SKILL.md 案例

```yaml
---
name: page-templates
description: 页面与组件开发模板 supporting files 集合，按需读取具体模板文件
---

# 页面与组件模板集合

本 Skill 作为模板集合入口，具体模板文件作为 supporting files 按需读取。

## Supporting files

- [750-design-vw-guide.md](./750-design-vw-guide.md)
- [index-jsx.md](./index-jsx.md)
- [use-store-js.md](./use-store-js.md)
- [constant-js.md](./constant-js.md)
- [index-scss.md](./index-scss.md)
- [handle-js.md](./handle-js.md)
- [sub-component-jsx.md](./sub-component-jsx.md)
- [component-hooks-guide.md](./component-hooks-guide.md)
- [component-http-request.md](./component-http-request.md)
- [component-split-guide.md](./component-split-guide.md)
```

### 官方规则要点

- Skill 可以包含多个辅助文件；

- `SKILL.md` 是入口文件；

- 其他文件是 supporting files；

- 可以在 `SKILL.md` 中通过 Markdown 链接引用辅助文件；

- Markdown 链接不会自动展开文件内容；

- Claude 会知道这些文件存在，并在需要时读取；

- 官方建议 `SKILL.md` 保持简洁，把长篇资料放到 supporting files 中。

## 六、Skill 中使用 !`command` 动态注入命令输出

### 适用场景

有些上下文是动态的，例如当前 git diff、当前分支、PR 评论、环境信息。这类内容不适合写死在文档中，可以通过动态命令注入。

常见用途：

- 注入当前 `git diff`；

- 注入 PR 信息；

- 注入当前分支状态；

- 注入某个文件的实时内容；

- 注入环境信息。

### 注入 git diff 案例

```yaml
---
name: summarize-changes
description: Summarize uncommitted changes
---

## Current changes

!`git diff HEAD`

## Instructions

Summarize the changes above.
```

运行 Skill 时，Claude Code 会先执行：

```bash
git diff HEAD
```

然后把命令输出替换到 `!` 语句所在位置。

### 注入 PR 信息案例

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
---

## Pull request context

- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task

Summarize this pull request.
```

### 官方规则要点

- ``!`command` `` 是动态上下文注入；

- 命令在 Claude 看到 Skill 内容之前执行；

- Claude 看到的是命令输出，不是命令本身；

- 命令输出作为普通文本插入；

- 命令输出不会再次扫描其中的动态注入语法；

- 可以通过设置禁用 Skill shell execution。

### 实践建议

适合放到 commit、review、PR summary 等 Skill 中。

例如 commit Skill 可以注入：

```
## Git status

!`git status --short`

## Git diff

!`git diff HEAD`
```

这样每次调用 Skill，都能基于最新变更生成结果。

## 七、Skill 中使用 fenced code block 动态注入多行命令

### 适用场景

如果需要执行多条命令，使用多个 `!` 行会比较乱，可以使用以 \`\`\`! 开头的 fenced code block。

### 案例

````yaml
---
name: environment-check
description: Check local environment
---

## Environment

```!
node --version
npm --version
git status --short
````

## Instructions

Summarize the environment information.

```

### 官方规则要点

- 多行命令使用以 \`\`\`! 开头的 fenced code block；

- 命令输出会替换整个 fenced code block；

- 适合需要连续执行多条命令的场景。

### 实践建议

多行命令适合环境检查类 Skill，例如：

- 检查 Node 版本；

- 检查包管理器版本；

- 检查当前 git 状态；

- 检查测试命令输出。

但要注意，动态命令会在 Skill 展开前执行，因此不建议执行高风险命令，例如删除文件、重置分支、全局修复等。

## 八、Skill 中使用 ${CLAUDE_SKILL_DIR} 引用当前 Skill 目录

### 适用场景

如果 Skill 需要读取同目录模板或执行同目录脚本，不能依赖当前工作目录，因为调用 Skill 时工作目录可能不同。

这时应该使用 `${CLAUDE_SKILL_DIR}`。

### 目录案例

```

.claude/skills/use-template/
├── SKILL.md
└── template.md

````

### SKILL.md 案例

```yaml
---
name: use-template
description: Use a local template file
---

## Template

!`cat "${CLAUDE_SKILL_DIR}/template.md"`

## Instructions

Generate code based on the template above.
````

### 官方规则要点

- `${CLAUDE_SKILL_DIR}` 表示当前 Skill 的目录；

- 对项目 Skill、个人 Skill、插件 Skill 都适用；

- 适合在 Skill 中引用自带脚本或模板文件。

### 实践建议

如果 Skill 自带脚本，建议这样调用：

```bash
!`bash "${CLAUDE_SKILL_DIR}/scripts/validate.sh"`
```

如果 Skill 自带模板，建议这样读取：

```bash
!`cat "${CLAUDE_SKILL_DIR}/template.md"`
```

这样 Skill 无论从哪个项目目录调用，都能稳定找到自己的 supporting files。

## 九、Subagent 中使用 skills 预加载 Skill

### 适用场景

Subagent 是 Claude Code 中用于拆分任务职责的机制。比如可以有：

- 前端开发 Agent；

- 代码审查 Agent；

- 性能分析 Agent；

- 安全审计 Agent；

- API 解析 Agent。

如果某个 Agent 启动时必须掌握特定规范，可以在 Agent frontmatter 中使用 `skills:` 预加载 Skill。

### Agent 案例

```yaml
---
name: frontend-developer
description: Frontend development agent
tools: Read, Write, Edit, Glob, Grep, Bash
model: inherit
skills:
  - create-page
  - lint-check
---
You are a frontend development agent.

Follow the preloaded skills.
```

### 对应目录案例

```
.claude/
├── agents/
│   └── frontend-developer.md
└── skills/
    ├── create-page/
    │   └── SKILL.md
    └── lint-check/
        └── SKILL.md
```

### 官方规则要点

- `skills:` 是 Subagent frontmatter 支持字段；

- 预加载的是 Skill 的完整内容，不只是 description；

- Subagent 启动时，指定 Skill 内容会注入到上下文；

- 未列在 `skills:` 中的 Skill，Subagent 仍然可以通过 Skill 工具调用，前提是工具权限允许；

- 设置了 `disable-model-invocation: true` 的 Skill 不能被预加载。

### 实践建议

如果一个 Agent 每次都需要某些规范，就预加载：

```yaml
skills:
  - frontend-developer-create-page
  - frontend-developer-create-component
  - frontend-developer-lint
```

如果只是偶尔使用的模板，不建议预加载，可以让 Agent 需要时再读取 supporting files。

## 十、Skill 参数替换：$ARGUMENTS

### 适用场景

有些 Skill 需要接收用户传入的参数。例如：

```
/fix-issue 123
```

这时可以使用 `$ARGUMENTS` 接收完整参数字符串。

### 案例

```yaml
---
name: fix-issue
description: Fix a GitHub issue
---
Fix GitHub issue $ARGUMENTS following our coding standards.
```

调用：

```
/fix-issue 123
```

实际效果：

```
Fix GitHub issue 123 following our coding standards.
```

### 官方规则要点

- `$ARGUMENTS` 表示用户调用 Skill 时传入的完整参数字符串；

- 如果 Skill 内容中没有 `$ARGUMENTS`，Claude Code 会把参数追加到 Skill 内容末尾。

### 实践建议

适合以下场景：

```
/review-pr 123
/fix-issue 456
/create-page UserProfile
/module-doc Account
```

如果参数整体作为一段文本处理，用 `$ARGUMENTS` 最简单。

## 十一、Skill 参数替换：$ARGUMENTS[N] 与 $0

### 适用场景

如果 Skill 需要多个位置参数，可以使用 `$ARGUMENTS[N]` 或简写 `$0`、`$1`、`$2`。

### $ARGUMENTS[N] 案例

```yaml
---
name: migrate-component
description: Migrate a component
---
Migrate the $ARGUMENTS[0] component from $ARGUMENTS[1] to $ARGUMENTS[2].
```

调用：

```
/migrate-component SearchBar React Vue
```

实际效果：

```
Migrate the SearchBar component from React to Vue.
```

### $0 简写案例

```yaml
---
name: migrate-component
description: Migrate a component
---
Migrate the $0 component from $1 to $2.
```

调用：

```
/migrate-component SearchBar React Vue
```

实际效果相同：

```
Migrate the SearchBar component from React to Vue.
```

### 官方规则要点

- `$ARGUMENTS[0]` 表示第一个参数；

- `$0` 是 `$ARGUMENTS[0]` 的简写；

- `$1` 是 `$ARGUMENTS[1]` 的简写；

- 多词参数需要用引号包裹。

### 实践建议

如果参数位置固定，例如组件名、目录名、模块名，可以用位置参数。

例如：

```
Create page $0 under module $1.
```

调用：

```
/create-page UserCenter Account
```

## 十二、Skill 命名参数：$name

### 适用场景

如果位置参数太多，直接写 `$0`、`$1` 可读性会变差。可以在 frontmatter 中使用 `arguments` 声明命名参数。

### 案例

```yaml
---
name: create-component
description: Create a component
arguments:
  - componentName
  - category
---
Create the $componentName component under the $category category.
```

调用：

```
/create-component UserCard Account
```

实际效果：

```
Create the UserCard component under the Account category.
```

### 官方规则要点

- 在 frontmatter 中使用 `arguments` 声明参数名；

- 参数名按位置映射；

- `$componentName` 对应第一个参数；

- `$category` 对应第二个参数。

### 实践建议

如果 Skill 面向团队长期使用，建议优先使用命名参数。

可读性更好：

```
Create the $componentName component under the $category category.
```

比下面这种更容易维护：

```
Create the $0 component under the $1 category.
```

## 十三、.claude/commands/\*.md 兼容 Skill 行为

### 适用场景

Claude Code 旧版 custom commands 仍然可用。官方说明 custom commands 已合并到 Skills，但 `.claude/commands/` 文件继续兼容。

### 目录案例

```
.claude/commands/review-changes.md
```

### 命令文件案例

```yaml
---
description: Review current changes
---

## Current diff

!`git diff HEAD`

## Instructions

Review the diff above.
```

调用：

```
/review-changes
```

### 官方规则要点

- `.claude/commands/*.md` 仍然可以创建 slash command；

- 支持与 Skill 相同的 frontmatter；

- 如果同名 command 和 skill 同时存在，Skill 优先；

- 新项目更推荐使用 `.claude/skills/<skill-name>/SKILL.md`。

### 实践建议

如果是新项目，建议直接使用 Skills：

```
.claude/skills/review-changes/SKILL.md
```

如果是老项目，可以逐步从：

```
.claude/commands/review-changes.md
```

迁移到：

```
.claude/skills/review-changes/SKILL.md
```

## 十四、几种机制应该如何选择？

下面这张表可以作为选型参考。

| 场景                 | 推荐机制                     | 是否自动展开 / 注入  |
| -------------------- | ---------------------------- | -------------------- |
| 项目长期规则         | `CLAUDE.md`                  | 是，启动时展开       |
| 个人本地偏好         | `CLAUDE.local.md`            | 是，启动时展开       |
| 拆分规则文件         | `.claude/rules/*.md`         | 是，规则自动加载     |
| 只对特定路径生效     | rules 的 `paths` frontmatter | 是，匹配文件时生效   |
| Skill 模板和示例     | supporting files             | 否，需要时读取       |
| 注入当前 git diff    | ``!`git diff HEAD` ``        | 是，运行时注入       |
| 注入多行命令输出     | ` ```! ... ``` `             | 是，运行时注入       |
| Skill 内引用自身目录 | `${CLAUDE_SKILL_DIR}`        | 用于命令中的路径引用 |
| Agent 启动即获得规范 | Subagent `skills:`           | 是，启动时预加载     |
