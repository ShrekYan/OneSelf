# Agent 编排模式学习指南

> 📚 学习日期：2026-05-01
> 🎯 适用场景：Claude Code 多 Agent 协同开发

---

## 一、核心结论

**本项目实现了标准的「双重编排模式」**，是 Agent 编排架构的经典实现：

- **Skill 层**：用户入口，定义命令和使用方式
- **Orchestrator Agent 层**：编排器核心，指挥多个专业 Agent 协同工作

---

## 二、基础概念辨析

### 2.1 Skill vs Agent 区别

| 概念                   | 文件位置示例                                          | 角色定位       | 通俗比喻                         |
| ---------------------- | ----------------------------------------------------- | -------------- | -------------------------------- |
| **Skill**              | `.claude/skills/full-frontend-review.md`              | **用户入口层** | 🔑 遥控器按钮 - 用户点一下就触发 |
| **Orchestrator Agent** | `.claude/agents/full-frontend-review-orchestrator.md` | **执行指挥层** | 🎬 导演 - 拿着剧本指挥演员干活   |

### 2.2 编排器 vs 普通 Agent

| 特征         | 普通单一 Agent          | 编排器 Orchestrator     |
| ------------ | ----------------------- | ----------------------- |
| 干活方式     | 自己亲自干活            | 指挥别人干活            |
| 核心工具     | Read, Edit, Write, Glob | **只用 Agent 工具**     |
| 核心能力     | 解决具体问题            | **协调流程 + 整合结果** |
| 可修改代码？ | ✅ 可以                 | ❌ 不修改，只指挥       |

---

## 三、项目编排架构详解

### 3.1 整体调用链路

```
用户输入: /full-frontend-review src/
        ↓
┌─────────────────────────────────────┐
│  Skill: full-frontend-review.md    │  ← 用户可见的命令界面
│  - 定义命令格式                     │
│  - 说明参数含义                     │
│  - 给出使用示例                     │
└─────────────────────────────────────┘
        ↓ 触发
┌─────────────────────────────────────┐
│  Agent: full-frontend-review-orchestrator.md  ← 编排器核心
│  ┌─────────────────────────────────┐
│  │ 步骤1: 调用 frontend-code-reviewer  → 代码质量专家
│  └─────────────────────────────────┘
│  ┌─────────────────────────────────┐
│  │ 步骤2: 调用 frontend-security-auditor → 安全专家
│  └─────────────────────────────────┘
│  ┌─────────────────────────────────┐
│  │ 步骤3: 调用 frontend-performance-expert → 性能专家
│  └─────────────────────────────────┘
│  ┌─────────────────────────────────┐
│  │ 步骤4: 整合三份报告 → 输出综合结果
│  └─────────────────────────────────┘
└─────────────────────────────────────┘
```

### 3.2 编排器核心工作流程

（来源：`full-frontend-review-orchestrator.md` 第 28-79 行）

```
7 步标准编排流程：

1. 解析用户输入
   └─ 获取检查范围、解析选项参数

2. 触发第一阶段 - 代码质量审查
   └─ 使用 Agent 工具调用 frontend-code-reviewer

3. 评估第一阶段结果
   ├─ 统计严重问题数量
   └─ 条件判断：有严重问题且未设置 --continue-on-error → 停止
                                             否则 → 继续

4. 触发第二阶段 - 安全漏洞扫描
   └─ 使用 Agent 工具调用 frontend-security-auditor
   └─ 关键：把第一阶段发现的问题传递给第二阶段！

5. 评估第二阶段结果
   └─ 同样的条件判断逻辑

6. 触发第三阶段 - 性能分析优化
   └─ 使用 Agent 工具调用 frontend-performance-expert
   └─ 关键：把前两阶段发现的问题都传递过去！

7. 整合输出综合报告
   └─ 统一按优先级排序问题
   └─ 按固定模板输出完整报告
```

---

## 四、编排模式的 4 个黄金标准

✅ **本项目全部满足**

| 标准         | 项目实现说明                                   |
| ------------ | ---------------------------------------------- |
| **单一职责** | 编排器只负责协调流程，不做具体审查工作         |
| **流程可控** | 有明确步骤、有条件判断、有停止机制             |
| **信息传递** | 前一阶段的结果会传递给后一阶段，让后续重点关注 |
| **结果整合** | 最后统一整理所有问题，按优先级重新排序         |

---

## 五、编排器标志特征

看 yaml 头部，**只声明 Agent 工具**，这就是编排器的身份证：

```yaml
# .claude/agents/full-frontend-review-orchestrator.md
---
name: full-frontend-review-orchestrator
description: ...
tools: Agent # 👈 看这里！只用这一个工具
model: inherit
---
```

---

## 六、为什么要用编排模式？

### 6.1 不做编排的痛点（手动执行 3 次）

```bash
# 用户需要记住 3 个命令，依次执行
/frontend-code-review src/pages/Article
/frontend-security src/pages/Article
/frontend-performance src/pages/Article
```

### 6.2 做了编排后的优势（1 次自动完成）

```bash
# 用户只需要记住 1 个命令
/full-frontend-review src/pages/Article
```

### 6.3 编排模式核心价值

| 价值点      | 说明                             |
| ----------- | -------------------------------- |
| 🧠 **智能** | 前面发现的问题，后面可以重点关注 |
| ⚡ **高效** | 一次触发，自动跑完整个流程       |
| 🎯 **专注** | 用户只需要面对一个入口命令       |
| 📊 **统一** | 最后输出整合好的报告，不用自己拼 |

---

## 七、新手如何仿写编排器？

### 标准模板

```yaml
---
name: xxx-orchestrator
description: 一句话描述这个编排器做什么
tools: Agent # 记住！编排器只需要这一个工具
model: inherit
triggers:
  - 触发关键词1
  - 触发关键词2
---
# 角色定位
你是 XX 编排器，负责协调 A、B、C 三个 Agent 依次执行。

用户只需要触发一次，你自动跑完整个流程。
---
# 你必须严格遵循的工作流程

按照以下 N 步顺序执行：
## 步骤 1: ...

## 步骤 2: ...

## ...

## 步骤 N: 整合输出综合报告

---
# 输出模板

（定义统一的输出格式）
---
# 行为准则

1. 不修改代码：只负责编排流程
2. 结构化输出：严格遵循输出模板
3. 尊重专业判断：每个子 Agent 的结论不要随意修改
4. 结果传递：务必把前面阶段发现的问题告诉后面阶段
```

### 可以仿写的练习题目

1. **后端完整审查编排器**：依次调用
   - nestjs-code-review
   - nestjs-security-audit
   - nestjs-performance-audit

2. **全栈代码生成编排器**：依次调用
   - backend-architect（生成后端 API）
   - frontend-developer（生成前端调用代码）
   - frontend-test-writer（生成前端测试）

---

## 八、项目中的 Agent 清单

（截至 2026-05-01）

| Agent 名称                          | 类型      | 说明                     |
| ----------------------------------- | --------- | ------------------------ |
| `full-frontend-review-orchestrator` | ✅ 编排器 | **项目中唯一的纯编排器** |
| `frontend-developer`                | 单一功能  | 前端开发                 |
| `frontend-code-reviewer`            | 单一功能  | 前端代码审查             |
| `frontend-security-auditor`         | 单一功能  | 前端安全扫描             |
| `frontend-performance-expert`       | 单一功能  | 前端性能优化             |
| `frontend-test-writer`              | 单一功能  | 前端测试编写             |
| `backend-architect`                 | 单一功能  | 后端架构开发             |
| `nestjs-code-review`                | 单一功能  | 后端代码审查             |
| `nestjs-security-audit`             | 单一功能  | 后端安全扫描             |
| `nestjs-performance-audit`          | 单一功能  | 后端性能审计             |
| `nestjs-test-writer`                | 单一功能  | 后端测试编写             |
| `ui-designer`                       | 单一功能  | UI 组件设计              |
| `design-system-architect`           | 单一功能  | 设计系统架构             |
| `search-expert`                     | 单一功能  | 代码搜索                 |
| `debug-assistant`                   | 单一功能  | Bug 诊断                 |
| `git-helper`                        | 单一功能  | Git 操作助手             |

---

## 九、学习路径建议

### 第一阶段：先会用（1 小时）

```bash
# 实际运行一下，看看编排器的效果
/full-frontend-review apps/web/src/components/LazyImage
```

### 第二阶段：看懂源码（2 小时）

1. 打开 `.claude/agents/full-frontend-review-orchestrator.md`
2. 反复读 3 遍，理解每一步做什么
3. 重点关注：流程控制、条件判断、结果传递、整合输出

### 第三阶段：自己仿写（4 小时）

写一个「后端完整审查编排器」作为练习

---

## 十、关键文件速查

| 文件                                                  | 用途                     |
| ----------------------------------------------------- | ------------------------ |
| `.claude/skills/full-frontend-review.md`              | Skill 入口，用户命令定义 |
| `.claude/agents/full-frontend-review-orchestrator.md` | 编排器核心实现           |
| `.claude/agents/frontend-code-reviewer.md`            | 子 Agent：代码质量       |
| `.claude/agents/frontend-security-auditor.md`         | 子 Agent：安全扫描       |
| `.claude/agents/frontend-performance-expert.md`       | 子 Agent：性能优化       |

---

_本指南基于项目实际代码整理，适用于 Claude Code Agent 编排模式学习_
