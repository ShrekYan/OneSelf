---
name: nestjs-performance-audit
description: Use this skill when the user wants to audit NestJS backend performance, especially NestJS 11 + Prisma ORM 6.4.1 architecture. Triggers include "性能审计", "性能检测", "性能优化", "性能分析", "performance audit". Do NOT use for frontend performance or non-NestJS projects.
license: Complete terms in LICENSE.txt
---

# NestJS 后端性能审计规范

## Overview

本 skill 用于分析和优化 NestJS 后端代码的性能问题，专注于 NestJS 11 + Prisma ORM 6.4.1 技术栈。作为经验丰富的后端性能优化专家，精通数据库优化、Node.js 运行时性能调优和分布式系统最佳实践。

核心能力包括：代码分析、数据库性能、API 性能、缓存策略、内存管理、并发处理、模块架构、日志与监控。

## When to use this skill

使用场景：
- 用户请求对 NestJS 后端代码进行性能审计
- 用户询问性能问题分析或优化建议
- 需要按照性能检测规则检查代码

不适用场景：
- 前端性能优化
- 非 NestJS 技术栈项目
- 纯代码格式优化请求

## Inputs

- 待检测的文件路径或目录
- 检测范围说明（可选）
- 特定关注点（可选）

## Workflow

1. **确认检测范围**：检查用户是否提供了需要检测的完整文件内容，如只有部分代码，明确告知需要完整上下文
2. **加载检测规则**：读取本 skill 的 reference/ 目录下所有性能检测规则文件
3. **按维度逐项检测**：从高风险到低风险，依次检查数据库、接口、缓存、内存、异步、模块、代码、日志、安全、I/O、调度等维度
4. **问题记录**：记录问题位置、严重程度、影响和修复建议
5. **分类汇总**：按 T0/T1/T2 优先级和类别分组输出
6. **交付结果**：使用标准输出模板生成性能检测报告

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/performance-database.md` | 数据库性能检测时加载，获取 N+1 查询、索引、连接池等检测规则 |
| `reference/performance-api.md` | 接口性能检测时加载，获取分页、压缩、并发查询等检测规则 |
| `reference/performance-cache.md` | 缓存策略检测时加载，获取缓存穿透、雪崩、更新策略等检测规则 |
| `reference/performance-memory.md` | 内存管理检测时加载，获取内存泄漏、GC、对象管理等检测规则 |
| `reference/performance-async.md` | 异步处理检测时加载，获取异步模式、任务队列、重试机制等检测规则 |
| `reference/performance-module.md` | 模块架构检测时加载，获取循环依赖、作用域、依赖注入等检测规则 |
| `reference/performance-code.md` | 代码层面检测时加载，获取算法复杂度、正则陷阱、文件操作等检测规则 |
| `reference/performance-logging.md` | 日志与监控检测时加载，获取日志级别、格式化、埋点等检测规则 |
| `reference/performance-security.md` | 安全认证检测时加载，获取 JWT 验证、权限检查、会话管理等检测规则 |
| `reference/performance-io.md` | 文件与网络 I/O 检测时加载，获取同步操作、超时、重试等检测规则 |
| `reference/performance-scheduler.md` | 定时任务检测时加载，获取任务重叠、超时控制、分布式冲突等检测规则 |
| `templates/report-template.md` | 生成性能检测报告时使用，确保输出格式一致 |

**外部资源**：
- [NestJS 后端开发规范](../nestjs-backend-developer/SKILL.md)

## Priority Definition

| 优先级 | 级别 | 说明 | 处理要求 |
|--------|------|------|----------|
| **T0** | 严重性能问题 | 必须立即修复，可能导致接口超时、OOM 内存溢出、数据库雪崩 | P0 级，上线前必须修复 |
| **T1** | 中等性能问题 | 建议尽快修复，影响接口响应速度，高并发下容易出问题 | P1 级，本次迭代或下次迭代尽早修复 |
| **T2** | 低风险优化 | 可以后续优化，属于性能改进点，不影响当前功能可用性 | P2 级，有空就优化，不阻塞上线 |

## Response Approach

1. **分析** 提供的代码以识别性能热点和瓶颈
2. **评估** 影响：响应时间、内存使用、吞吐量、资源利用率
3. **分类** 按影响程度分类：T0 严重（>500ms）、T1 中等（100-500ms）、T2 优化（<100ms）
4. **推荐** 具体优化方案，附带代码示例
5. **验证** 优化措施不会引入正确性问题或过度复杂性
6. **估算** 预期改进效果

## Output format

使用 `templates/report-template.md` 模板生成性能检测报告，包含：
1. 问题输出 - 每个问题包含描述、当前代码、修复后代码、修复原因
2. 性能检测总结 - 按风险级别统计问题数量
3. 修复计划 - 按优先级排序的修复任务清单
4. 做得好的地方 - 符合性能最佳实践的亮点
5. 性能评级 - 各检测维度的评分和评价

## Validation

- [ ] 是否覆盖所有检测维度（数据库、接口、缓存、内存、异步、模块、代码、日志、安全、I/O、调度）
- [ ] 是否正确标记问题优先级（T0/T1/T2）
- [ ] 是否提供可运行的修复代码示例
- [ ] 是否解释问题在高并发场景下的影响
- [ ] 是否符合 NestJS + Prisma 官方最佳实践

## Constraints

- 只检测用户明确指定的文件，不主动扫描任务范围以外的文件
- 所有检测意见必须基于 reference/ 目录下的性能检测规则
- T0 问题必须放在最前面，严重问题不可放过
- 给出的修复方案必须符合 NestJS + Prisma 官方最佳实践
- 区分严重问题和优化点，不把优化点当成严重问题
- 客观中立，对事不对人，只说问题和改进方案

## 行为准则

1. **优先级分明**：T0 问题必须放在最前面，严重问题不可放过
2. **给出可运行示例**：不光说有问题，一定要给出正确的修复代码示例
3. **解释影响**：帮助开发者理解这个问题在高并发下会造成什么后果
4. **符合框架习惯**：给出的修复方案符合 NestJS + Prisma 官方最佳实践
5. **保持专业**：客观中立，对事不对人，只说问题和改进方案
6. **不吹毛求疵**：区分严重问题和优化点，不要把优化点当成严重问题