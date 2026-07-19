---
name: todo-scan
description: TODO 扫描命令，扫描项目中所有 TODO/FIXME/XXX 标记，整理输出待办清单
---

# TODO Scan Command

## 分类定位

面向数据与配置治理的 command，聚焦于项目待办事项扫描、技术债务追踪和代码配置一致性检查。强调扫描结果的正确性、一致性和可量化追踪。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| 技术债务清理 | 扫描项目中的 TODO/FIXME/XXX 标记 | 待办清单、统计报告、清理建议 |
| 代码审查前置 | 审查前扫描待办事项 | 按优先级排序的待办列表 |
| 项目健康检查 | 定期扫描追踪技术债务 | 趋势报告、治理节奏建议 |

## Context

用户需要扫描项目中所有的 TODO/FIXME/XXX 标记，整理输出结构化的待办清单，方便清理和追踪。重点关注正确性、一致性、可靠性和可量化追踪。

## Requirements

$ARGUMENTS

## Instructions

### 1. Target and Constraint Analysis
- 识别扫描范围：项目根目录
- 排除不需要搜索的目录（node_modules, .git, .claude, dist, build 等）
- 确定搜索模式：TODO, FIXME, XXX
- 识别环境和所有权

### 2. Schema / Rules / Indicators Definition
- 定义搜索模式规则：TODO（普通待办）、FIXME（需要修复）、XXX（占位符）
- 定义优先级规则：默认优先级、紧急标记
- 定义严重程度：Critical | High | Medium | Low

### 3. Pipeline or Validation Design
- 定义扫描阶段：搜索、收集、整理、统计
- 定义执行方式：使用 ripgrep 搜索
- 定义输出格式：详细报告或摘要报告

### 4. Monitoring and Governance
- 定义分类统计和分组方式
- 提供清理建议和优先级排序
- 建立持续改进机制

## Output Format

Return:
- Scope and Assumptions（范围与假设）
- Schema / Rules / SLO Definitions（规则定义）
- Implementation Plan（实施计划）
- Validation and Monitoring（验证与监控）
- Failure Handling（故障处理）
- Governance Cadence（治理节奏）

---

## 扫描配置

```yaml
governance_command:
  target_type: configuration
  inputs:
    - TODO 标记
    - FIXME 标记
    - XXX 标记
  outputs:
    - 待办清单
    - 统计报告
    - 清理建议
  rules:
    - pattern: TODO
      severity: Medium
    - pattern: FIXME
      severity: High
    - pattern: XXX
      severity: Critical
  monitoring:
    - 总数统计
    - 按文件分组
    - 优先级排序

scan_config:
  patterns:
    - TODO
    - FIXME
    - XXX
  exclude_dirs:
    - node_modules
    - .git
    - .claude
    - dist
    - build
  sort_by: path | priority | date
  output_format: detailed | summary
```

---

## 执行流程

1. 使用 ripgrep 搜索整个项目中包含 TODO/FIXME/XXX 的所有行
2. 排除不需要搜索的目录（node_modules, .git, .claude, dist, build 等）
3. 按文件路径排序整理结果
4. 统计总数，输出结构化清单
5. 显示文件路径、行号、注释内容
6. 给出清理建议

---

## 强制执行协议

请调用 Skill 工具执行 `common-todo-scan`，并将用户参数原样传入。规范入口：[common-todo-scan Skill](../skills/common-todo-scan/SKILL.md)。