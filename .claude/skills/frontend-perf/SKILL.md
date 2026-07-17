---
name: frontend-perf
description: Use this skill when the user wants to analyze frontend performance issues, optimize React 19 + MobX + Vite applications, or generate performance reports. Triggers include "性能优化", "性能分析", "性能问题", "加载慢", "卡顿", "内存泄漏", "performance optimization". Do NOT use for backend performance issues or unrelated tasks.
license: Complete terms in LICENSE.txt
---

# 前端性能优化审查

## Overview

本 skill 用于系统性分析前端性能瓶颈并提供可落地方案，专注于 **React 19.2.3 + MobX 6.13.5 + Vite 7.3.1 + Ant Design Mobile 5.42.3** 技术栈的移动端 H5 应用。

核心能力包括：加载性能优化、交互性能优化、内存泄漏排查、网络请求优化、构建产物分析。

## When to use this skill

使用场景：
- 用户请求分析前端性能问题（加载慢、卡顿、内存泄漏等）
- 用户需要优化特定页面或组件的性能
- 用户需要生成性能分析报告
- 用户需要验证优化效果

不适用场景：
- 后端性能问题
- 非前端技术栈项目
- 纯格式优化请求

## Inputs

- 分析对象：页面路径、组件路径、模块名称
- 分析目标：首屏性能、交互性能、内存、网络、综合
- 可选约束：特定关注点、已知问题

## Workflow

1. **明确范围**：确认分析对象、目标和技术栈
2. **收集证据**：读取代码、搜索性能相关模式、分析构建产物
3. **分类判断**：确定问题类型（确定问题/高可信风险/潜在风险/非问题）
4. **优先级评估**：按 P0/P1/P2/P3 分级
5. **输出报告**：使用标准模板输出结构化报告
6. **落地优化**：用户确认后执行修改

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/core-philosophy.md` | 了解核心理念和工作原则 |
| `reference/performance-classification.md` | 学习性能问题分类和分析流程 |
| `reference/capabilities.md` | 了解技术栈优化能力 |
| `reference/react-mobx-optimization.md` | React 19 + MobX 专项优化指南 |
| `reference/builtin-optimizations.md` | 了解项目已内置的优化设施 |
| `reference/checklist.md` | 按优先级逐项排查性能问题 |
| `reference/analysis-workflow.md` | 执行系统性分析工作流 |
| `reference/constraints.md` | 了解问题分级和约束条件 |
| `reference/quick-reference.md` | 验证命令、常见问题速查 |
| `templates/report-template.md` | 生成性能分析报告 |
| `examples/examples.md` | 参考示例交互场景 |

## Output Format

性能分析报告结构：
1. 结论摘要 - 整体结论和优先处理建议
2. 分析范围 - 分析对象、目标、技术栈
3. P0/P1 问题列表 - 包含位置、证据、影响、优化建议
4. 潜在风险 - 缺少充分证据但值得关注的问题
5. 需要补充的数据 - 如 Lighthouse 报告、Performance Trace
6. 最终建议 - 修复优先级和验证方式

## Validation

- [ ] 是否基于代码证据分析问题
- [ ] 是否按 P0/P1/P2/P3 正确分级
- [ ] 是否提供可操作的优化建议
- [ ] 是否包含验证方式
- [ ] 是否使用中文输出结构化报告

## Constraints

- 禁止不基于证据凭空断言性能问题
- 禁止盲目建议缓存、虚拟滚动、懒加载（需评估适用性）
- 禁止为了性能优化改变业务语义、安全控制、用户流程
- 禁止自动安装、升级或删除依赖
- 禁止自动修改构建配置
- 默认只读分析模式，仅在用户明确要求时进入修改模式