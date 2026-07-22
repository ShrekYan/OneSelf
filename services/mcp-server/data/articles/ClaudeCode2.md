---
title: 全方位介绍目录配置
slug: claude-code-directory-configuration-guide
date: 2024-06-01
tags: [Claude Code, 配置, 目录结构]
---

# Claude Code -2 全方位介绍目录配置

## Claude Code 目录配置

用 Claude Code 半年还在纯对话？配置体系才是从"能用"到"好用"的关键。这篇文章帮你理清每个目录和配置文件的作用，快速建立全景认知。

### 前言

很多人用 Claude Code，`claude` 一敲就开始对话。但当项目变大、团队变多，纯靠上下文会让 AI 反复"失忆"——不知道项目规范、忘记技术栈、每次都要重新解释架构。

解决方案就是 **配置化** 。Claude Code 提供了一套完整的目录和配置体系，把规则、Agent、命令、技能、MCP 工具全部沉淀到项目文件里，让 AI 的行为可预期、可复用、可团队共享。

这篇文章只做一件事：**帮你搞清楚每个目录和配置文件是什么、放什么** 。至于怎么用好每一个，后续会逐个展开单讲。

### 一、目录全景

#### 1.1 项目根目录完整结构

```
your-project/
├── CLAUDE.md # 项目核心指令（会话自动加载）
├── CLAUDE.local.md # 个人偏好覆盖（不提交 Git）
├── .mcp.json # MCP 外部工具配置
└── .claude/ # 项目级配置主目录
    ├── settings.json # 项目基础设置
    ├── settings.local.json # 本地个人覆盖配置（Git 忽略）
    ├── rules/ # 主题化路径门控规则
    ├── commands/ # 快捷自定义命令
    ├── skills/ # 可复用自定义技能
    ├── workflows/ # 工作流编排定义
    ├── agents/ # 专项子代理定义
```

#### 1.2 全局级配置

```
~/.claude/
├── CLAUDE.md # 全局个人指令（所有项目生效）
├── settings.json # 全局默认配置
├── rules/ # 全局通用规则
├── skills/ # 全局复用技能
├── agents/ # 全局子代理
├── commands/ # 个人命令（所有项目可用）
├── plugins/ # 已安装插件数据
├── history.jsonl # 历史提示记录
├── stats-cache.json # 令牌用量统计
└── projects/ # 各项目会话运行数据 + 自动记忆
```

#### 1.3 双层作用域

| 维度         | 项目级                | 全局级       |
| ------------ | --------------------- | ------------ |
| 位置         | `项目根目录/.claude/` | `~/.claude/` |
| 作用范围     | 当前项目              | 所有项目     |
| 是否提交 Git | ✅ 共享配置提交       | ❌ 仅本地    |
| 优先级       | **高** （覆盖全局）   | 低           |

### 二、核心文件速览

#### CLAUDE.md

每次会话启动必加载的"项目入职手册"。声明技术栈、构建命令、编码规范、架构约束等，决定 Claude 对项目的基础认知。

#### CLAUDE.local.md

CLAUDE.md 的本地覆盖版本，存放个人偏好和本地配置。与 CLAUDE.md 同步加载，但不提交 Git。

#### settings.json

Claude Code 的核心控制文件。管控工具权限（allow/deny/ask）、执行钩子、环境变量、模型参数、插件开关等。

#### settings.local.json

settings.json 的本地覆盖版本，存放 token、baseUrl 等敏感信息和个人权限配置。不提交 Git。

#### .mcp.json

MCP（Model Context Protocol）外部工具配置。定义 Claude Code 可连接的外部工具服务器，扩展 AI 能力边界。

### 三、.claude 子目录速览

#### agents/ — 专项子代理定义

定义项目专属的 Agent 角色，每个 `.md` 文件就是一个带人设和职责的 AI 专家。支持显式调用和隐式路由触发。

#### commands/ — 快捷自定义命令

给常用操作起个短名字（Slash Commands），每个 `.md` 文件对应一个命令，用 `/project:命令名` 触发。个人命令放 `~/.claude/commands/`，用 `/user:命令名` 触发。

#### rules/ — 主题化路径门控规则

AI 必须遵守的约束，每个 `.md` 文件聚焦一类规则。**核心特性：支持路径门控** ——加 YAML frontmatter 后，规则只在 Claude 处理特定路径的文件时才加载，避免全局上下文膨胀。

#### skills/ — 可复用自定义技能

可复用的流程模板，每个 Skill 是一个子目录，包含 `SKILL.md` 入口文件和可选的参考文档、脚本、模板。Claude 根据上下文自动判断是否调用，也支持显式触发。支持渐进式加载，只在调用时才读取完整内容。

#### workflows/ — 工作流编排定义

定义多步骤、多 Agent 协作的完整工作流程，将开发、审查、安全、测试等环节串联成可复用的执行链。

#### agent-memory/ — 子代理持久内存

存储子 Agent 的跨会话持久记忆，让 Agent 在不同对话中保持上下文。管理命令：`/memory`。

#### output-styles/ — 响应格式化规则

定义 Claude Code 的输出格式化规则，控制 AI 回复的呈现方式（如结构化 JSON、表格、自定义模板）。

### 四、初始化与快速上手

```
cd your-project
claude
> /init
```

Claude Code 会自动创建 `.claude/` 目录和 `CLAUDE.md` 模板。

**推荐配置顺序：**

1. `CLAUDE.md` — 写清项目规范和技术栈（影响最大）

2. `settings.json` 的 `permissions` — 拒绝敏感文件访问，允许常用命令

3. `rules/` — CLAUDE.md 开始变挤时按模块拆分

4. `skills/` — 有可复用流程时沉淀

5. `agents/` — 需要角色分工时定义

6. `workflows/` — 多 Agent 协作场景编排

### 五、.gitignore 建议

| 文件/目录                     | 提交 Git  | 说明                 |
| ----------------------------- | --------- | -------------------- |
| `CLAUDE.md`                   | ✅        | 团队共享项目规范     |
| `CLAUDE.local.md`             | ❌        | 个人偏好             |
| `.claude/settings.json`       | ✅        | 团队共享权限和配置   |
| `.claude/settings.local.json` | ❌        | 个人 token、MCP 权限 |
| `.claude/rules/`              | ✅        | 团队共享规则         |
| `.claude/commands/`           | ✅        | 团队共享命令         |
| `.claude/skills/`             | ✅        | 团队共享技能         |
| `.claude/agents/`             | ✅        | 团队共享 Agent 定义  |
| `.claude/workflows/`          | ✅        | 团队共享工作流       |
| `.claude/agent-memory/`       | ❌        | 本地会话数据         |
| `.claude/output-styles/`      | ✅        | 团队共享输出格式     |
| `.mcp.json`                   | ⚠️ 看情况 | 含 token 则不提交    |

### 六、一张图总结

Claude Code 的配置体系本质上回答三个问题：

| 问题                  | 答案                                                                          |
| --------------------- | ----------------------------------------------------------------------------- |
| AI 应该遵守什么规则？ | `CLAUDE.md` + `CLAUDE.local.md` + `rules/` + `settings.json` 的 `permissions` |
| AI 应该怎么做事？     | `agents/` + `skills/` + `commands/` + `workflows/`                            |
| AI 能用什么工具？     | `.mcp.json` + `settings.json` 的插件和 MCP 配置                               |

三者叠加，就是一个 **可预期、可复用、可团队共享** 的 AI 编程工作流。

绝大多数日常场景只需关注 `CLAUDE.md` 和 `settings.json` 两个核心文件，其余扩展模块按需启用。配置是长出来的，不是设计出来的。
