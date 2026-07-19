---
name: full-frontend-review
description: 一键触发完整前端代码审查，自动顺序执行代码质量 → 安全 → 性能三个维度检查
---

# Full Frontend Review Command

## 分类定位

面向多智能体协作的 command，通过不同专家角色并行分析前端代码，再汇总冲突、优先级和统一行动计划。重点关注并行专家分析、基于证据的优先级排序和统一执行指导。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| 完整前端审查 | 全面审查前端代码质量、安全、性能 | 综合审查报告、优先级排序的行动计划 |
| 重构前评估 | 重构前的全面代码评估 | 风险评估、重构计划 |
| 项目健康检查 | 定期项目健康度检查 | 技术债务报告、改进建议 |

## Context

用户需要对前端代码进行全面审查，涵盖代码质量、安全、性能等多个维度。重点关注并行专家分析、基于证据的优先级排序和统一执行指导。

## Requirements

$ARGUMENTS

## Instructions

### 1. Agent Role Definition
定义专家角色和职责。
每个 Agent 必须包含：
- 范围（Scope）
- 输入（Inputs）
- 审查标准（Review criteria）
- 预期输出（Expected output）

### 2. Parallel Analysis
运行独立专家分析，覆盖多个维度。
防止 Agent 互相覆盖范围。
要求每个 Agent 提供证据和优先级。

### 3. Conflict Resolution
- 识别冲突的建议
- 比较权衡
- 优先选择风险降低更高、实施成本更低的变更
- 升级未解决的决策

### 4. Consolidated Output
- 合并发现
- 去重相似问题
- 按严重程度、影响和工作量排序
- 生成分阶段执行计划

### 5. Validation and Follow-up
- 定义每项建议的验证方式
- 定义所有权和顺序
- 定义重新审查触发条件

## Output Format

Return:
- Agent Roles（Agent 角色）
- Individual Findings Summary（各 Agent 发现摘要）
- Consolidated Findings（汇总发现）
- Conflicts and Resolutions（冲突与解决方案）
- Prioritized Action Plan（优先级排序的行动计划）
- Verification Plan（验证计划）
- Follow-up Questions（跟进问题）

---

## 审查配置

```yaml
multi_agent:
  target: 前端代码
  agents:
    - name: code_quality
      role: 代码质量专家
      scope: typescript, react, best_practices
      criteria:
        - 类型安全
        - 代码风格
        - 架构设计
        - 可维护性
      output: 代码质量报告
    - name: security
      role: 安全专家
      scope: xss, csrf, vulnerabilities
      criteria:
        - XSS 防护
        - CSRF 防护
        - 敏感数据处理
        - 依赖漏洞
      output: 安全审查报告
    - name: performance
      role: 性能专家
      scope: bundle_size, rendering, lazy_loading
      criteria:
        - 包体积优化
        - 渲染性能
        - 懒加载
        - 缓存策略
      output: 性能分析报告
  findings:
    - agent: 来源 agent
      severity: Critical | High | Medium | Low
      impact: 影响
      effort: low | medium | high
      recommendation: 建议
  conflicts:
    - topic: 冲突主题
      options: []
      resolution: 决议
      rationale: 理由
  action_plan:
    phases: []
    owners: []
    verification: []

multi_agent_review:
  review_agents:
    - code_quality
    - security
    - performance
  severity_policy:
    blocker: 必须先修复
    high: 当前迭代修复
    medium: 计划修复
    low: 可选优化
```

---

## 协作注意事项

1. 每个 agent 的职责边界必须清楚。
2. 汇总阶段必须去重，避免同一问题多次计入。
3. 冲突必须显式记录，而不是隐式选择。
4. 输出必须包含优先级、工作量、验证方式。
5. 对安全、合规、数据破坏等高风险建议应优先处理。

---

## 强制执行协议

<!-- 🔴 🔴 🔴 最高优先级：必须首先执行工具调用 -->
<!-- 使用 Claude Code 原生 Agent 工具，100% 触发完整前端审查编排器 -->

### ✅ 立即执行：调用前端完整审查编排器 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `full-frontend-review-orchestrator` |
| `description` | 用户的完整前端审查需求 |
| `prompt` | "用户审查需求：{{完整用户需求描述}}\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

### 🔍 自我验证（执行后确认）
- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

### ❌ 绝对禁止行为（违反即失败）
- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出审查报告
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容