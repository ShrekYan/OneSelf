# Claude Code 运行机制详解（新手学习指南）

> 本文档详细讲解 Claude Code 的启动流程、Agent 机制、Skill 机制和完整运行流程，适合新手学习理解。

---

## 目录

1. [核心概念](#核心概念)
2. [启动加载流程](#启动加载流程)
3. [Auto Memory（自动记忆）](#auto-memory自动记忆)
4. [Agent 运行机制](#agent-运行机制)
5. [Skill（技能）运行机制](#skill技能运行机制)
6. [完整运行流程图](#完整运行流程图)
7. [新手常见疑问](#新手常见疑问)
8. [本项目配置总结](#本项目配置总结)
9. [学习建议](#学习建议)

---

## 核心概念

Claude Code 不是一个简单的聊天工具，它是一个**带上下文的智能开发助手**。

它的核心能力是：**记住项目的所有规范和历史，像一个资深同事一样帮你开发**。

---

## 启动加载流程

当你在项目目录输入 `npx @anthropic-ai/claude-code` 启动时，Claude Code 会按以下顺序**自动读取并记住**这些文件：

### 加载顺序

```
第 1 步: 读取 .claude/settings.json
  ↓
  ├── env: 环境变量（API 地址、模型名称等）
  ├── permissions: 工具权限控制（能做什么，不能做什么）
  ├── hooks: 钩子函数（操作前/后的拦截器）
  └── plugins: 启用的插件
      ↓
第 2 步: 读取 .claude/settings.local.json (如果存在)
  ↓
  └── 本地覆盖配置（比如更严格的安全限制）
      ↓
第 3 步: 读取项目根目录的 CLAUDE.md
  ↓
  ├── 项目描述和技术栈
  ├── Agent 自动触发规则
  ├── 规范入口索引
  └── 项目记忆规则
      ↓
第 4 步: 读取 Auto Memory（自动记忆）
  ↓
  └── ~/.claude/projects/[项目路径哈希]/memory/MEMORY.md
      （这是全局的项目记忆目录）
```

---

## Auto Memory（自动记忆）

### 位置

```
~/.claude/projects/[项目路径哈希]/memory/MEMORY.md
```

### 作用

- **每次对话开始时自动加载**
- 存储高频踩坑教训和快速检查点
- 就像你的"错题本"，每次做题前先看一遍
- 避免重复犯同样的错误

### 本项目的记忆内容示例

1. MobX 箭头函数 `this` 绑定问题
2. Prisma 模型命名规范
3. `#include:` 机制限制
4. 快速检查清单（8 条）
5. 常用命令和重要路径

---

## Agent 运行机制

### 什么是 Agent？

Agent 是一个**有特定技能和知识的专业助手**。就像公司里有前端工程师、后端工程师、架构师一样，Claude Code 里也有不同的 Agent。

### Agent 触发流程

```
用户输入: "帮我开发一个登录页面"
    ↓
Claude Code 去 CLAUDE.md 里匹配"Agent 自动触发规则"
    ↓
匹配到: "开发前端页面 → 使用 frontend-developer Agent"
    ↓
加载 .claude/agents/frontend-developer.md
    ↓
┌──────────────────────────────────────────┐
│ 关键步骤: #include: 指令执行            │
│ ─────────────────────────────────       │
│ #include: ../rules/typescript-common.md │
│ #include: ../rules/security-common.md   │
│ #include: ../skills/h5-frontend/...     │
└───────────────────┬──────────────────────┘
                    ↓
            编译期物理嵌入所有规则
            （不是运行时读取，是直接把内容插进去）
                    ↓
            Agent 获得完整上下文
            （就像你先把所有规范都背下来了）
                    ↓
            按照规范输出代码
```

### Agent 文件的结构

```markdown
---
name: frontend-developer-agent
description: 构建 React 移动端 H5 组件
tools: Read, Write, Edit... # 能使用的工具
model: inherit # 使用的模型
---

<!-- 这里是 #include 区域，所有规范在这里嵌入 -->

#include: ../rules/typescript-common.md
#include: ../rules/security-common.md
...

<!-- 这里是 Agent 特有指令 -->

## 输出代码前必须确认

| 检查项    | 要求           |
| --------- | -------------- |
| 导入路径  | 只用 @/ 别名   |
| MobX 写法 | 用 useObserver |

...

## 角色定位

你是本项目的资深移动端前端开发专家...
```

---

## Skill（技能）运行机制

### 什么是 Skill？

Skill 是**可复用的能力模块**，类似于插件或工具包。

### 触发方式

用户输入 `/xxx` 命令来触发：

```
用户输入: /frontend-code-review
    ↓
Claude Code 查找是否有对应的 Command
    ↓
在 .claude/commands/ 找到 frontend-code-review.md
    ↓
Command 指向对应的 Skill:
  #use: frontend-code-reviewer
    ↓
加载 .claude/skills/frontend-code-review.md
    ↓
执行技能定义的操作
```

### Command 与 Skill 的关系

```
commands/ (用户可见的命令入口)
    ↓
    引用
    ↓
skills/ (实际技能实现)
```

**例子**：

- 用户输入 `/git commit`
- → 加载 `.claude/commands/git.md`
- → 调用 `.claude/skills/common/commit.md`
- → 生成符合规范的 Git Commit

---

## 完整运行流程图

```
你启动 Claude Code
    ↓
┌─────────────────────────────┐
│ 启动阶段（自动加载）        │
├─────────────────────────────┤
│ 1. 读取 settings.json       │
│ 2. 读取 settings.local.json │
│ 3. 读取 CLAUDE.md           │
│ 4. 加载 Auto Memory         │
└─────────────────────────────┘
    ↓
等待你输入提示词...
    ↓
你输入提示词: "帮我开发一个登录页面"
    ↓
┌─────────────────────────────────┐
│ Agent 匹配阶段                  │
├─────────────────────────────────┤
│ 去 CLAUDE.md 的"Agent 自动触发   │
│ 规则"里匹配你的输入特征         │
│                                 │
│ 匹配到: 前端开发 → frontend-    │
│ developer Agent                 │
└───────────────┬─────────────────┘
                ↓
┌─────────────────────────────────┐
│ Agent 加载阶段                  │
├─────────────────────────────────┤
│ 加载 agents/frontend-developer.md│
│                                 │
│ 执行所有 #include: 指令         │
│ → 把所有规则文件的内容物理嵌入  │
│   到 Agent 上下文中             │
│                                 │
│ 现在 Agent 有了完整的规范知识   │
└───────────────┬─────────────────┘
                ↓
┌─────────────────────────────────┐
│ 执行阶段                        │
├─────────────────────────────────┤
│ Agent 根据你的需求开发代码       │
│ 每一步都对照规范检查            │
│ 遵守检查清单的所有要求          │
└───────────────┬─────────────────┘
                ↓
输出符合项目规范的代码给你
```

---

## 新手常见疑问

### Q1: 为什么 CLAUDE.md 里只放索引，不把所有规则都写进去？

**A**: 因为 CLAUDE.md 是每次启动都加载的，如果把所有规则都放进去：

1. 上下文会太臃肿，影响响应速度
2. 规则太多，日常对话用不到
3. 不好维护和复用

**正确做法**：

- CLAUDE.md 放索引和触发规则
- 具体规范放到 `rules/` 和 `skills/`
- Agent 用 `#include:` 按需加载

---

### Q2: `#include:` 为什么不能嵌套？

**A**: Claude Code 的解析器限制。

```
❌ 错误（嵌套不解析）：
Agent.md → include → A.md → include → B.md
（B.md 的内容不会被加载）

✅ 正确（扁平化）：
Agent.md → include → A.md
Agent.md → include → B.md
（所有都直接在 Agent 里 include）
```

---

### Q3: settings.json 和 settings.local.json 区别？

**A**:

| settings.json | settings.local.json |
| ------------- | ------------------- |
| 项目公共配置  | 你个人的本地配置    |
| 提交到 Git    | 不提交到 Git        |
| 基础配置      | 优先级更高          |

---

### Q4: Auto Memory 和 project-memory.md 区别？

**A**:

| Auto Memory          | project-memory.md        |
| -------------------- | ------------------------ |
| 全局目录，不在项目里 | 在项目 `.claude/` 里     |
| 每次对话**自动加载** | 需要时手动读取           |
| 高频踩坑、快速检查点 | 完整的问题记录和解决方案 |
| Claude Code 自动维护 | 人工或指令维护           |

---

### Q5: Agent 和 Skill 区别？

**A**:

| Agent                      | Skill                   |
| -------------------------- | ----------------------- |
| 完整的角色定义             | 特定能力模块            |
| 自动触发（根据输入特征）   | 手动触发（`/xxx` 命令） |
| 有完整的角色设定和检查清单 | 有特定的操作流程        |
| 可以调用 Skill             | 可以被 Agent 调用       |

---

## 本项目配置总结

```
本项目配置层级:

┌─────────────────────────────────────┐
│ CLAUDE.md (项目根入口)               │
│  ├── Agent 触发规则 (15+ Agents)    │
│  └── 规范索引                       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ .claude/agents/ (Agent 定义)        │
│  ├── frontend-developer.md          │
│  ├── backend-architect.md           │
│  └── ...其他 Agent                  │
│      （每个都用 #include 嵌入规则） │
└──────────────┬──────────────────────┘
               ↓
┌──────────────┴──────────────────────┐
│ .claude/rules/ (通用规则)            │
│ .claude/skills/ (技术栈规范)         │
└─────────────────────────────────────┘

Auto Memory: ~/.claude/projects/.../MEMORY.md
（每次启动自动加载）
```

---

## 学习建议

1. **先看 CLAUDE.md** → 了解项目整体和 Agent 触发规则
2. **看一个具体的 Agent 文件** → 比如 `frontend-developer.md`，理解它怎么 `#include` 规则
3. **看几条具体的规则** → 比如 `typescript-common.md`
4. **实际用一下** → 输入一个开发需求，观察 Claude Code 怎么按规范输出

---

## 💡 一句话总结

Claude Code 通过"启动加载基础配置 + 按需加载专业 Agent"的方式，让 AI 像一个熟悉项目所有规范的资深同事一样帮你开发。

---

**文档版本**: v1.0
**最后更新**: 2026-05-01
**适用对象**: Claude Code 新手学习者
