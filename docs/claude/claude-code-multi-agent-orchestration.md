# Claude Code 多 Agent 编排与环境隔离方案调研

## 结论

目前还没有一个非常成熟的“Claude Code 单窗口总控 + 多 Agent 并行干活 + 每个 Agent 强环境隔离 + 自动汇总结果”的完整开箱产品。

更现实、工程上更成熟的方案是组合式架构：

```text
一个主控 Claude Code 窗口
  ├─ 负责任务拆解、调度、验收、汇总
  ├─ 多个 worker Agent
  │   ├─ 每个 Agent 一个 git worktree / 分支
  │   ├─ 必要时每个 Agent 一个 Docker / devcontainer / CI runner
  │   └─ 每个 Agent 输出 diff、测试结果、报告或 PR
  └─ 主控窗口最终汇总结果
```

一句话概括：

> Claude Code Subagents 解决“一个窗口调多个专家”；git worktree 解决“多个执行空间互不污染”；Docker / CI 解决“运行环境隔离”；Orchestrator 解决“调度与汇总”。

---

## 方案对比

| 方案 | 单窗口编排 | 结果汇总 | 文件隔离 | 运行环境隔离 | 成熟度 |
|---|---:|---:|---:|---:|---:|
| Claude Code Subagents | 强 | 强 | 弱 | 弱 | 高 |
| 多 Claude Code 实例 + git worktree | 弱 | 弱/中 | 强 | 中 | 高 |
| Claude Agent SDK 自建编排器 | 强 | 强 | 可强 | 可强 | 中高 |
| GitHub Actions / CI Runner | 中 | 中 | 强 | 强 | 高 |
| Docker / devcontainer | 不负责 | 不负责 | 强 | 强 | 高 |
| LangGraph / AutoGen / CrewAI | 强 | 强 | 需自建 | 需自建 | 中到高 |

---

## 1. Claude Code 原生 Subagents

Claude Code Subagents 是最接近“一个窗口指挥多个 Agent”的官方能力。

优点：

- 主 Claude Code 可以调用多个 subagent。
- 每个 subagent 有独立上下文。
- 每个 subagent 可以有不同 system prompt。
- 可以限制不同 subagent 的工具权限。
- subagent 的结果会回到当前 Claude Code 窗口。

但关键限制是：

> Subagent 不是环境隔离。

它们更像：

```text
一个主窗口
  ├─ 前端专家
  ├─ 后端专家
  ├─ 搜索专家
  └─ 安全审查专家
```

这些 Agent 可以各自分析、审查、生成建议，但默认仍然面向同一个项目目录，不是每个 Agent 一个独立文件系统、依赖环境、数据库或端口。

适合场景：

- 代码搜索
- 代码审查
- 架构规划
- 安全扫描
- 性能分析
- 测试方案生成
- 小范围串行修改

不太适合：

- 多个 Agent 并行大规模改代码
- 多个 Agent 同时运行服务
- 需要互不污染的实验性改动

---

## 2. git worktree + 多 Claude Code 实例

这是目前最实用的本地工程方案。

典型结构：

```text
Claude Code A -> worktree A -> branch A
Claude Code B -> worktree B -> branch B
Claude Code C -> worktree C -> branch C
```

优点：

- 文件隔离强。
- 分支隔离强。
- 每个 AI 的改动可以独立审查。
- 可以独立提交、独立 PR。
- 出问题可以直接丢弃某个 worktree。

缺点：

> 它不是天然单窗口，也不会自动汇总。

它解决的是：

```text
不互相污染
```

但不解决：

```text
谁统一看结果？
谁判断合并顺序？
谁处理冲突？
谁保证整体跑通？
```

所以它通常需要一个“主控”：

```text
主控 Claude / 人
  ├─ 分配任务
  ├─ 收集每个 worktree 报告
  ├─ 查看 diff
  ├─ 决定合并顺序
  └─ 最终验收
```

最佳实践：

```text
一个 AI = 一个 worktree = 一个独立分支 = 一个独立 Claude Code 会话
```

进一步建议：

- 每个任务限定修改范围。
- 每个 worktree 输出固定格式交付报告。
- 每个 worktree 独立运行 lint、test、build。
- 合并前由主控统一查看 diff 和验证结果。
- 避免多个 AI 同时修改同一批核心文件。

---

## 3. Claude Agent SDK 自建 Orchestrator

如果目标是真正实现：

```text
一个 Claude Code 窗口
  -> 启动多个 Agent
  -> 每个 Agent 独立 worktree
  -> 每个 Agent 跑任务
  -> 最后统一输出报告
```

比较靠谱的方向是用 Claude Agent SDK 自己做一个 orchestrator。

可能结构：

```text
Claude Code 主窗口
  └─ npm run agent:orchestrate
      ├─ 创建 worktree A
      ├─ 创建 worktree B
      ├─ 创建 worktree C
      ├─ 启动 Agent A
      ├─ 启动 Agent B
      ├─ 启动 Agent C
      ├─ 收集 diff / test / build / logs
      └─ 输出汇总报告
```

优点：

- 可以保持单窗口体验。
- 可以自动汇总。
- 可以控制并发数。
- 可以定义每个 Agent 的 cwd。
- 可以给每个任务绑定独立分支。
- 可以接 Docker / devcontainer。
- 可以自动生成 PR 或报告。

缺点：

- 需要自己开发编排逻辑。
- 不是完全开箱即用。
- 需要自己设计失败恢复、权限、日志、合并策略。

适合场景：

- 想长期沉淀一套可复用的 AI 编排工作流。
- 想把多 Agent 编排产品化。
- 想统一管理任务、日志、权限、成本和结果汇总。

---

## 4. GitHub Actions / CI Runner

如果更看重成熟度、隔离性和审计能力，CI Runner 是最成熟的落地层。

典型结构：

```text
主 Claude Code 拆任务
  └─ 创建多个 issue / PR / workflow job
      ├─ runner A 执行任务 A
      ├─ runner B 执行任务 B
      ├─ runner C 执行任务 C
      └─ 每个 runner 输出 PR / comment / artifact
```

优点：

- 每个 job 天然独立 checkout。
- 可以使用容器。
- 日志完整。
- 权限可控。
- 适合团队审计。
- PR 流程成熟。

缺点：

- 不是本地实时单窗口体验。
- 交互性弱。
- 调试成本较高。
- 更偏异步自动化。

适合场景：

- 团队级 AI 协作。
- 大规模自动化修复。
- 高风险代码修改。
- 需要 CI 门禁、审计日志和权限控制的仓库。

---

## 5. Docker / devcontainer / sandbox

Docker、devcontainer、sandbox 不是 Agent 编排方案，而是隔离底座。

它们解决：

- 依赖隔离。
- 端口隔离。
- 命令执行隔离。
- 文件挂载范围控制。
- 数据库 / Redis 独立环境。
- 安全边界。

它们不解决：

- 谁拆任务。
- 谁调度 Agent。
- 谁收集结果。
- 谁合并代码。

所以通常要与其他方案组合：

```text
Agent SDK / GitHub Actions / 自定义脚本
  +
git worktree
  +
Docker / devcontainer
```

推荐隔离层级：

| 隔离级别 | 方案 | 适合场景 |
|---|---|---|
| 轻量 | git worktree | 防止文件互相覆盖 |
| 中等 | worktree + 独立 env + 独立端口 | 本地并行开发 |
| 强 | worktree + devcontainer | 依赖和命令隔离 |
| 很强 | 每个任务一个 Docker container | 高风险执行 |
| 最强 | ephemeral CI runner / VM | 企业审计和安全边界 |

---

## 6. 第三方多 Agent 框架

常见方案包括：

- LangGraph
- AutoGen
- CrewAI
- Semantic Kernel

它们适合做“多 Agent 编排系统”，例如：

```text
planner -> coder -> reviewer -> tester -> reporter
```

优点：

- 编排能力强。
- 支持多 Agent 状态流。
- 可以做人类审批节点。
- 可以持久化 checkpoint。
- 可以自定义汇总逻辑。

但问题是：

> 它们不是 Claude Code 原生开发流。

如果希望它们像 Claude Code 一样：

- 读写本地代码。
- 调 MCP。
- 读取项目 CLAUDE.md。
- 管理 git worktree。
- 创建 PR。
- 运行测试。
- 遵守权限策略。

通常需要额外胶水代码。

---

## 推荐架构

### 本地开发优先

```text
主控 Claude Code
  +
Claude Code Subagents 做分析 / 审查
  +
git worktree 做代码隔离
  +
Docker / devcontainer 做运行环境隔离
  +
主控窗口汇总 diff、测试结果、PR
```

适合个人或小团队在本地并行探索、并行开发。

---

### 产品化编排优先

```text
Claude Agent SDK Orchestrator
  +
git worktree
  +
Docker / devcontainer
  +
GitHub PR
```

适合长期建设自己的 AI 编排平台。

---

### 企业级审计优先

```text
GitHub Actions
  +
独立 runner / container
  +
Claude worker
  +
PR / Check / Artifact 汇总
```

适合团队、企业、关键仓库和高风险自动化变更。

---

## 对当前项目的建议

可以按三层能力建设：

```text
Claude Code Subagents：负责“一个窗口调多个专家”
git worktree：负责“多个执行空间互不污染”
Docker / CI：负责“运行环境隔离”
Orchestrator：负责“汇总和调度”
```

完整形态：

```text
一个主控窗口
  ├─ 用 subagents 做分析和规划
  ├─ 用 worktree 派发执行任务
  ├─ 用 container / CI 隔离运行环境
  ├─ 每个 worker 输出标准报告
  └─ 主控统一汇总、审查、合并
```

最终建议：

1. 小任务：直接使用单个 Claude Code 会话。
2. 专业分析 / 审查：使用 Claude Code Subagents。
3. 多任务并行写代码：使用 git worktree + 多 Claude Code 会话。
4. 需要单窗口汇总：自建 Agent SDK Orchestrator。
5. 需要强环境隔离：worktree + Docker / devcontainer。
6. 需要企业级审计：GitHub Actions / CI Runner。

---

## 关键判断

当前成熟度最高的不是某一个单体工具，而是组合方案：

```text
主控 Claude Code
  +
Subagents
  +
git worktree
  +
Docker / devcontainer / CI
  +
标准交付报告 / PR 流程
```

这套组合能分别解决：

| 问题 | 解决方案 |
|---|---|
| 一个窗口调多个专家 | Claude Code Subagents |
| 多个 Agent 写代码不互相污染 | git worktree |
| 依赖、端口、数据库、命令隔离 | Docker / devcontainer / CI |
| 结果汇总、任务调度、失败恢复 | Agent SDK Orchestrator / 主控流程 |
| 审计、权限、CI 门禁 | GitHub Actions / PR 流程 |

所以目前的现实结论是：

> 还没有完全成熟的 Claude Code 原生“一体化多 Agent 隔离编排平台”；成熟做法是把 Claude Code、Agent SDK、git worktree、容器和 CI 组合起来。

---

## 参考来源

- Claude Code Subagents: https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Claude Code git worktrees workflow: https://docs.anthropic.com/en/docs/claude-code/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees
- Claude Code GitHub Actions: https://docs.anthropic.com/en/docs/claude-code/github-actions
- Claude Code devcontainer: https://docs.anthropic.com/en/docs/claude-code/devcontainer
- Claude Code settings and permissions: https://docs.anthropic.com/en/docs/claude-code/settings
- Claude Code SDK: https://docs.anthropic.com/en/docs/claude-code/sdk
- LangGraph multi-agent systems: https://langchain-ai.github.io/langgraph/concepts/multi_agent/
- Microsoft AutoGen: https://microsoft.github.io/autogen/
- CrewAI: https://docs.crewai.com/
