---
name: nestjs-code-review
description: 当用户需要审查 NestJS 后端代码质量时使用此技能。触发场景包括代码审查、PR 审查、规范检查、架构分层检查、DTO 验证检查、TypeScript 类型安全检查等。适用于 services/ 目录下的 NestJS 11 + TypeScript + Prisma 后端代码。不用于前端代码或其他框架。
license: Complete terms in LICENSE.txt
---

# NestJS 后端代码审查规范

## Overview

此技能用于对 NestJS 后端代码进行结构化审查，覆盖架构分层、命名规范、Controller/Service 编码、DTO 验证、TypeScript 类型安全、错误处理、Prisma ORM、API 文档和代码质量等维度。

审查目标：

- 发现违反项目规范的代码问题
- 给出可执行的修正建议
- 输出结构化的审查报告和评分

## When to use this skill

- 用户要求审查 NestJS 后端代码时
- 用户提到 "review"、"审查"、"代码质量"、"规范检查" 等关键词时
- 需要评估 Controller、Service、DTO、Prisma 查询、异常处理等实现时
- PR 审查或代码走查场景

## Inputs

- **待审查代码**：用户提供的完整文件内容或文件路径
- **审查范围说明**：（可选）用户希望重点检查的维度
- **项目上下文**：（可选）相关模块或依赖文件

## Workflow

1. **确认审查范围**：检查用户是否提供了完整代码上下文；如只有片段，先提示补充。
2. **加载参考规范**：根据审查维度，按需读取 [reference/](reference/) 下的检查规则。
3. **逐项检查**：按照 [templates/review-output-template.md](templates/review-output-template.md) 的维度逐项审查。
4. **记录问题**：对发现的问题标注优先级 `[T0]` / `[T1]` / `[T2]`，并给出修正示例。
5. **输出评分**：按照输出模板填写各维度评分和改进计划。
6. **总结亮点**：列出符合规范的亮点，保持客观友好。

## Resources

| 资源 | 何时使用 |
|------|----------|
| [reference/review-architecture.md](reference/review-architecture.md) | 检查架构分层、模块拆分、导入顺序、DTO 导入方式时 |
| [reference/review-naming.md](reference/review-naming.md) | 检查文件命名、类名、变量名、DTO 后缀、枚举命名时 |
| [reference/review-controller-service.md](reference/review-controller-service.md) | 检查 Controller 路由、HTTP 方法、参数装饰器、Service 注入时 |
| [reference/review-dto.md](reference/review-dto.md) | 检查请求/响应 DTO、class-validator、Swagger 文档装饰器时 |
| [reference/review-typescript.md](reference/review-typescript.md) | 检查类型声明、any 使用、catch 块错误收窄、类型导出时 |
| [reference/review-error-handling.md](reference/review-error-handling.md) | 检查业务异常、Prisma 错误处理、错误消息友好性时 |
| [reference/review-prisma.md](reference/review-prisma.md) | 检查 Prisma schema、查询 select、事务、分页、索引、命名转换时 |
| [reference/review-api-docs.md](reference/review-api-docs.md) | 检查 Swagger 装饰器、ApiTags、ApiOperation、ApiResponse 时 |
| [reference/review-quality.md](reference/review-quality.md) | 检查 lint/format、调试代码、类型检查、注释质量时 |
| [templates/review-output-template.md](templates/review-output-template.md) | 输出审查报告时作为格式模板 |
| [examples/example-review-output.md](examples/example-review-output.md) | 需要参考完整审查输出样例时 |

## Output format

最终输出必须遵循 [templates/review-output-template.md](templates/review-output-template.md) 的结构，包含：

- 按优先级排列的问题列表
- 每个维度的评分
- 总分
- 优先改进计划
- 做得好的地方
- 推荐阅读的规范文档

单个问题输出格式：

```markdown
### [序号]. [优先级] [问题类别] 简短标题

**问题描述**:
> 一句话清楚说明问题出在哪里

**当前代码**:
```typescript
// 问题代码片段
```

**修正后的正确代码**:
```typescript
// 完整修正示例
```

**为什么要这样改进**:
- 引用本项目哪条规范要求
- 解释这样改进带来什么好处
```

## Validation

审查完成后检查以下内容：

- [ ] 是否覆盖了所有相关维度
- [ ] 每个问题是否都标注了 `[T0]` / `[T1]` / `[T2]` 优先级
- [ ] 是否给出了可执行的修正代码示例
- [ ] 评分表是否完整，总分计算是否正确
- [ ] 是否包含正向总结
- [ ] 输出是否符合 [templates/review-output-template.md](templates/review-output-template.md) 的结构

## Constraints

- 只审查 NestJS 后端代码，不审查前端代码
- 严格对照本项目规范，不输出与项目决策冲突的个人建议
- ESLint 已覆盖的格式问题可快速带过，重点关注架构和规范问题
- 必须解释每条建议的原因，不假设开发者已知
- 保持客观中立，对事不对人
