# Claude Code 项目配置架构文档

> 本文档详细说明 `CLAUDE.md` 与 `.claude/` 目录的架构关系和调用机制。

---

## 目录

1. [整体架构图](#整体架构图)
2. [核心组件说明](#核心组件说明)
3. [关键机制详解](#关键机制详解)
4. [完整运行流程](#完整运行流程)
5. [设计原则总结](#设计原则总结)

---

## 整体架构图

```
================================================================================
                        Claude Code 项目配置架构图
================================================================================

                                     用户输入
                                       ↓
                                 CLAUDE.md (项目根入口)
                                       ↓
            ┌───────────────────────────┼───────────────────────────┐
            ↓                           ↓                           ↓
    项目描述 & 技术栈            Agent 自动触发规则            规范入口索引
                                       ↓                           ↓
               ┌───────────────────────┘                           │
               ↓                                                   ↓
          .claude/ 配置仓库                                        │
               ↓                                                   │
    ┌──────────┼──────────┬──────────┬──────────┬──────────┐       │
    ↓          ↓          ↓          ↓          ↓          ↓       │
  rules/    skills/    agents/  commands/  projects/  project-memory│
    ↓          ↓          ↓          ↓          ↓                  ↓
    │          │          │          │          │          规范索引引用
    │          │          │          │          │
    │          │          ├──────────┘          │
    │          │          ↓                     │
    │          │  ┌───────────────────┐        │
    │          │  │ frontend-developer│        │
    │          │  │ backend-architect │        │
    │          │  │   ...其他 Agent   │        │
    │          │  └─────────┬─────────┘        │
    │          │            ↓                  │
    │          │      #include: 嵌入           │
    │          │  (编译期物理嵌入规则)          │
    │          └────────────┬──────────────────┘
    │                       ↓
    ├───────────────────────┤
    ↓                       ↓
  通用规则               技术栈规范
    ↓                       ↓
┌───┼───┬───┬───┐     ┌───┼───┬───┐
↓   ↓   ↓   ↓   ↓     ↓   ↓   ↓   ↓
TS  安全 格式 行为  公共组件  前端  后端  通用
规范 规范 规范 规范  规范  规范  规范  规范

================================================================================
```

---

## 核心组件说明

### 1. CLAUDE.md (项目根入口)

**定位**：用户进入项目时 Claude Code 自动读取的第一份文件

**职责**：

| 模块               | 说明                                   |
| ------------------ | -------------------------------------- |
| 项目描述           | Monorepo 架构说明、前后端技术栈介绍    |
| 核心技术栈         | React 19 + MobX + NestJS + Prisma      |
| 关键指令           | npm run dev / build / lint 等开发命令  |
| Agent 自动触发规则 | 根据用户输入特征，自动选择对应的 Agent |
| 规范入口索引       | 链接到 `.claude/` 下的详细规则文件     |
| 项目记忆规则       | 踩坑记录的格式和流程                   |

---

### 2. .claude/ 配置仓库

| 目录/文件           | 层级         | 作用                                                    |
| ------------------- | ------------ | ------------------------------------------------------- |
| **`rules/`**        | 通用规则层   | 前后端共用的 TypeScript、安全、格式、行为规范           |
| **`skills/`**       | 技术栈规范层 | 前端/后端/通用等特定技术栈的完整规范系列                |
| **`agents/`**       | Agent 定义层 | 通过 `#include:` 指令编译期物理嵌入规则，运行时直接生效 |
| **`commands/`**     | CLI 命令层   | `/xxx` 命令的入口，映射到对应的 Skill                   |
| **`projects/`**     | 项目信息层   | 前端/后端项目特有信息                                   |
| `project-memory.md` | 踩坑知识库   | 持续积累的项目问题和解决方案                            |

---

### 3. 通用规则层 (rules/)

| 文件                     | 说明                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| `typescript-common.md`   | TypeScript 通用规范（严格模式、类型原则、空值处理、异步规范等）   |
| `security-common.md`     | 安全通用规范（HttpOnly Cookie、Token 安全、密码加密、错误信息安全 |
| `code-format-common.md`  | 代码格式通用规范（缩进、引号、分号、导入排序、工具链配置）        |
| `project-behavior.md`    | 全局行为规范（代码复用、影响范围确认、安全底线）                  |
| `frontend-components.md` | 公共组件开发规范                                                  |

---

### 4. 技术栈规范层 (skills/)

| 目录                        | 说明                                      |
| --------------------------- | ----------------------------------------- |
| `h5-frontend-developer/`    | React + MobX 前端全量规范（10+ 个规则文件 |
| `nestjs-backend-developer/` | NestJS 后端全量规范（14+ 个规则文件）     |
| `common/`                   | 通用能力规范（Git 提交、模块文档等）      |

---

### 5. Agent 定义层 (agents/)

| Agent                                  | 触发场景                                      |
| -------------------------------------- | --------------------------------------------- |
| `frontend-developer.md`                | 开发前端页面、组件、API、Hook                 |
| `backend-architect.md`                 | 开发 NestJS 后端、Controller、Service、Module |
| `frontend-code-reviewer.md`            | 审查前端代码质量                              |
| `nestjs-code-review.md`                | 审查后端代码质量                              |
| `frontend-performance-expert.md`       | 前端性能问题分析、优化                        |
| `nestjs-performance-audit.md`          | 后端性能问题分析、优化                        |
| `frontend-test-writer.md`              | 前端单元测试编写                              |
| `nestjs-test-writer.md`                | 后端单元测试编写                              |
| `frontend-security-auditor.md`         | 前端安全漏洞扫描                              |
| `nestjs-security-audit.md`             | 后端安全漏洞扫描                              |
| `ui-designer.md`                       | UI 设计稿转代码、组件设计                     |
| `debug-assistant.md`                   | 错误日志分析、Bug 诊断                        |
| `search-expert.md`                     | 搜索代码、组件、调用链                        |
| `full-frontend-review-orchestrator.md` | 全量前端代码审查（质量 + 安全 + 性能）        |
| `git-helper.md`                        | Git 操作助手                                  |
| `design-system-architect.md`           | 设计系统架构师                                |

---

## 关键机制详解

### `#include:` 指令机制

```
================================================================================
                          关键机制: #include 指令
================================================================================

Agent 文件
  ↓
┌─────────────────────────────────────────────────────────┐
│ #include: ../rules/typescript-common.md                 │
│ #include: ../rules/security-common.md                   │
│ #include: ../skills/h5-frontend-developer/rules/...     │
└───────────────────────────┬─────────────────────────────┘
                            ↓
                  编译期物理嵌入到 Agent 上下文
                  (不是运行时动态读取)
                            ↓
                    Agent 获得完整规则集
```

**关键点**：

- `#include:` 是 Claude Code 的**编译期物理嵌入机制**
- 不是运行时动态引用
- Agent 被调用时所有规则已经在上下文中
- 不需要运行时再读取文件

**限制**：

- 不支持嵌套 include（A include B，B include C）
- 所有规范必须在 Agent 入口一级直接 `#include:`
- 避免通过中间文件间接引用

---

## 完整运行流程

```
================================================================================
                            完整运行流程
================================================================================

用户: "开发一个登录页面"
  ↓
Claude Code 读取 CLAUDE.md
  ↓
匹配 Agent 触发规则: "前端开发 → frontend-developer"
  ↓
加载 agents/frontend-developer.md
  ↓
#include 机制编译期物理嵌入:
  ├─ rules/typescript-common.md    ← 通用 TS 规范
  ├─ rules/security-common.md      ← 安全规范
  ├─ rules/code-format-common.md   ← 代码格式规范
  ├─ rules/project-behavior.md     ← 全局行为规范
  └─ skills/h5-frontend-developer/ ← 前端所有特有规范
  ↓
获得完整上下文后开发代码
  ↓
输出符合项目规范的代码
```

### 序列图

```
用户 -> Claude Code: "开发一个登录页面"
Claude Code -> CLAUDE.md: 读取项目入口
CLAUDE.md --> Claude Code: "前端开发任务 → 使用 frontend-developer Agent
Claude Code -> Agent 定义: 加载 frontend-developer.md
Note over Agent 定义: #include 指令在此生效
             所有规则被物理嵌入
Agent 定义 --> Claude Code: 完整上下文（通用规则 + 前端规则）
Claude Code -> Claude Code: 使用完整规范开发代码
Claude Code --> 用户: 输出符合项目规范的代码
```

---

## 设计原则总结

| 原则           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| **分层架构**   | CLAUDE.md（入口）→ Agents（定义）→ rules/skills（具体规则）  |
| **不重复原则** | 通用规则统一维护，技术栈特定规则只包含独有的内容             |
| **扁平化引用** | Agent 直接 `#include` 所有需要的规则，不嵌套引用避免解析失败 |
| **编译期嵌入** | `#include` 是物理嵌入，不是运行时动态读取，确保上下文完整    |
| **向后兼容**   | 原有规则文件保留，只做内容精简，不影响现有工作流             |

---

## 文件结构参考

```
claude/ (Monorepo 根)
├── CLAUDE.md                          # 项目入口（自动加载）
└── .claude/
    ├── agents/                        # Agent 定义层
    │   ├── frontend-developer.md
    │   ├── backend-architect.md
    │   └── ...其他 Agent
    ├── rules/                         # 通用规则层
    │   ├── typescript-common.md
    │   ├── security-common.md
    │   ├── code-format-common.md
    │   ├── project-behavior.md
    │   └── frontend-components.md
    ├── skills/                        # 技术栈规范层
    │   ├── h5-frontend-developer/
    │   ├── nestjs-backend-developer/
    │   └── common/
    ├── commands/                      # CLI 命令层
    ├── projects/                      # 项目信息文件
    └── project-memory.md             # 踩坑知识库
```

---

**文档版本**: v1.0
**最后更新**: 2026-05-01
**维护者**: Claude Code
