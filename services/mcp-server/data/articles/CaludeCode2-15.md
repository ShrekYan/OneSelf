---
title: 从 0 到 1 安装 Spec-Kit：Claude Code 项目接入指南
slug: install-spec-kit-claude-code-guide
date: 2026-06-05
tags: [Claude Code, AI编程, Spec-Kit]
---

# 从 0 到 1 安装 Spec-Kit：Claude Code 项目接入指南

上一篇已经聊过 Spec-Kit 的定位、价值和整体工作流，这篇就不再重复介绍概念了。本文只聚焦安装和接入：如何安装 Spec-Kit CLI、如何初始化项目、已有 Claude Code 项目如何增量接入，以及初始化完成后如何验证安装结果。

## 一、安装前准备

在安装 Spec-Kit 之前，需要先准备好以下环境：

| 依赖        | 要求                       |
| ----------- | -------------------------- |
| Python      | 3.11 或更高版本            |
| Git         | 任意可用版本               |
| uv          | 推荐使用的 Python 包管理器 |
| Claude Code | 已安装 Claude Code CLI     |

如果你已经能在终端里正常运行 `claude`，说明 Claude Code 这部分已经准备好了。

## 二、安装 uv

Spec-Kit 推荐通过 `uv` 安装。不同系统安装方式略有不同。

### macOS / Linux

```
brew install uv
```

### Windows PowerShell

```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

安装完成后，可以通过下面命令确认是否可用：

```
uv --version
```

## 三、安装 Spec-Kit CLI

安装好 `uv` 后，就可以安装 Spec-Kit 的命令行工具了。

推荐使用全局安装：

```
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

如果你不想全局安装，也可以使用 `uvx` 直接运行：

```
uvx --from git+https://github.com/github/spec-kit.git specify init
```

全局安装完成后，可以验证一下：

```
specify --version
specify check
```

其中：

- `specify --version` 用来查看版本；

- `specify check` 用来检查本地系统工具是否齐全。

## 四、初始化项目

Spec-Kit 支持两种常见使用方式：创建新项目，或者集成到已有项目。

### 1. 创建新项目

```
specify init my-project --ai claude
```

这个命令会创建一个名为 `my-project` 的项目，并指定 AI 工具为 Claude Code。

### 2. 集成到已有项目

如果你已经有项目，可以在项目根目录执行：

```
specify init . --ai claude
```

也可以使用：

```
specify init --here --ai claude
```

初始化过程中，Spec-Kit 会让你选择脚本类型：

- macOS / Linux：选择 `sh`；

- Windows：选择 `ps`。

选择完成后，项目中会生成 Spec-Kit 相关目录和命令模板。

## 五、已有 Claude Code 项目如何接入

如果你的项目本来就已经在使用 Claude Code，通常已经存在 `.claude/` 目录，里面可能有：

- 项目级 `CLAUDE.md`；

- 自定义 commands；

- 自定义 agents；

- 团队沉淀的 rules、skills 或 memory。

这种情况下，不建议直接把项目当成全新项目处理，而是按“增量接入”的方式来做。

### 1. 先确认当前项目状态

进入项目根目录后，建议先看一下 Git 状态：

```
git status
```

如果当前有很多未提交改动，建议先提交或暂存。因为 `specify init` 会新增或修改 `.claude/commands/`、`.specify/`、`specs/` 等内容，提前确认状态可以避免后面分不清哪些是业务改动、哪些是 Spec-Kit 初始化改动。

### 2. 在项目根目录执行初始化

已有 Claude Code 项目一般直接在根目录执行：

```
specify init . --ai claude
```

或者：

```
specify init --here --ai claude
```

这一步的目标不是重建项目，而是给现有项目补充 Spec-Kit 的命令、模板和规格目录。

### 3. 检查 `.claude/commands/` 是否合并正常

初始化完成后，重点检查：

```
.claude/commands/
```

这里会新增 Spec-Kit 相关斜杠命令。如果你原来已经有自定义命令，需要确认没有被覆盖或冲突。

一般来说，Spec-Kit 命令会以独立命名存在，例如：

```
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks
/speckit.implement
```

如果你的项目已经有类似命名的命令，建议先人工比对内容，再决定保留哪一份。

### 4. 让项目原有规范进入 constitution

已有 Claude Code 项目通常已经在 `CLAUDE.md` 或 `.claude/rules/` 中写了不少规范，例如：

- 技术栈；

- 目录结构；

- 代码风格；

- 安全要求；

- 测试命令；

- Agent 使用规则。

接入 Spec-Kit 后，建议先运行：

```
/speckit.constitution
```

把这些已有规范整理进项目宪法。这样后续 `/speckit.specify`、`/speckit.plan`、`/speckit.tasks` 生成内容时，就能更稳定地遵守项目原有约束。

这里要注意：不要把 constitution 写成又长又散的备忘录。它更适合放“长期稳定、不能轻易违反”的规则；临时需求和单个功能细节，应该放到对应功能的 `spec.md` 里。

### 5. 检查新增文件是否符合预期

接入完成后，建议再次查看 Git 状态：

```
git status
```

正常情况下，你会看到和 Spec-Kit 初始化相关的新增或修改文件，例如：

```
.claude/commands/
.specify/
specs/
```

这一步主要是为了确认初始化结果是否清晰，避免把初始化文件和业务改动混在一起提交。

## 六、初始化后的项目结构

初始化完成后，项目目录中通常会多出这些内容：

```
my-project/
├── .claude/commands/ # Spec-Kit 斜杠命令
├── .specify/
│ ├── memory/ # 项目原则和规范
│ ├── scripts/ # 调用脚本
│ └── templates/ # 模板文件
└── specs/ # 需求文档存放处
```

简单解释一下：

- `.claude/commands/`：提供 Claude Code 中可以调用的 Spec-Kit 命令；

- `.specify/memory/`：保存项目长期约束、原则、上下文；

- `.specify/scripts/`：Spec-Kit 内部使用的脚本；

- `.specify/templates/`：生成 spec、plan、tasks 时使用的模板；

- `specs/`：具体功能的规格、计划、任务文档都会放在这里。

## 七、启动 Claude Code

进入项目目录后，启动 Claude Code：

```
cd my-project
claude
```

启动后，如果安装成功，Claude Code 中应该可以使用 Spec-Kit 相关斜杠命令。

常用命令包括：

| 命令                    | 作用               |
| ----------------------- | ------------------ |
| `/speckit.constitution` | 建立或更新项目宪法 |
| `/speckit.specify`      | 创建功能规格文档   |
| `/speckit.plan`         | 生成技术实现方案   |
| `/speckit.tasks`        | 拆解任务清单       |
| `/speckit.implement`    | 按任务执行代码实现 |

## 八、安装后验证

安装和初始化完成后，可以从三个方面确认 Spec-Kit 是否已经接入成功。

### 1. 检查命令是否可用

在 Claude Code 中输入 `/`，查看是否能看到 Spec-Kit 相关命令：

```
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks
/speckit.implement
```

如果这些命令能正常出现，说明 Claude Code 侧的命令注册已经成功。

### 2. 检查目录是否生成

确认项目根目录下是否出现：

```
.claude/commands/
.specify/
specs/
```

其中 `.specify/` 是 Spec-Kit 的核心配置目录，`specs/` 是后续规格文档的默认存放目录。

### 3. 检查 CLI 是否正常

在终端中执行：

```
specify --version
specify check
```

如果版本号和检查结果都能正常输出，说明本地 CLI 环境没有问题。

## 九、常见问题

### 1. 初始化时需要联网吗？

需要。初始化时需要访问 GitHub 下载 Spec-Kit 相关内容。初始化完成后，日常使用主要依赖本地生成的命令、模板和文档。

### 2. 只能配合 Claude Code 使用吗？

不是。Spec-Kit 也支持 GitHub Copilot、Gemini CLI 等 AI 代理。不过如果你主要使用 Claude Code，初始化时指定 `--ai claude` 即可。

### 3. Windows 可以用吗？

可以。Windows 环境初始化时选择 PowerShell 脚本类型，也就是 `ps`。

### 4. 已有 `.claude/commands/` 会被覆盖吗？

如果项目里已经有自定义命令，初始化后建议检查 `.claude/commands/` 目录。重点确认是否有同名文件或命名冲突，必要时手动比对后再提交。

## 十、总结

完整安装流程如下：

```
# 1. 安装 uv
brew install uv

# 2. 安装 Spec-Kit CLI
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 3. 检查环境
specify --version
specify check

# 4. 初始化项目
specify init . --ai claude

# 5. 启动 Claude Code
claude
```
