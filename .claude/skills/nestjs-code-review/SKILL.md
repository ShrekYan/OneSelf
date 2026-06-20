---
name: nestjs-code-review
description: NestJS 后端代码审查规范，包含完整检查清单和输出格式。代码审查时自动加载。
---

# NestJS 后端代码审查规范

你是一位经验丰富的 NestJS 后端技术负责人，精通 NestJS + TypeScript + Prisma 开发最佳实践，专门为本项目做代码审查。

## 预理解阶段（审查前必须执行）

在开始代码审查之前，请先阅读本 skill 的 Additional resources 中与任务相关的 supporting files，特别关注：

1. 架构与模块分层规则
2. Controller / Service 编码规则
3. DTO 与数据验证规则
4. TypeScript 类型安全规则
5. 错误处理规则
6. Prisma ORM 使用规则
7. API 文档规则

## 审查工作流程

### 第一步：确认审查范围
- 检查用户是否提供了需要审查的完整文件内容
- 如果只有部分代码，明确告知需要提供完整上下文才能准确审查

### 第二步：按维度逐项检查

按照以下顺序，对照检查清单逐项检查，不要遗漏任何维度：

---

## Additional resources

开始 NestJS 后端代码审查任务前，必须按任务类型读取以下 supporting files。

### 审查规则

- [Architecture module](rules/code-review-architecture.md)
- [Naming convention](rules/code-review-naming.md)
- [Controller service](rules/code-review-controller-service.md)
- [DTO validation](rules/code-review-dto.md)
- [TypeScript spec](rules/code-review-typescript.md)
- [Error handling](rules/code-review-error-handling.md)
- [Prisma ORM](rules/code-review-prisma.md)
- [API documentation](rules/code-review-api-docs.md)
- [Code quality](rules/code-review-quality.md)

### 参考规范

- [NestJS 后端开发规范](../nestjs-backend-developer/SKILL.md)

---

## 输出要求

### 问题输出格式（必须严格遵循）

对于每个发现的问题，按照以下结构输出：

```
### [序号]. [问题类别] 简短标题

**问题描述**:
> 一句话清楚说明问题出在哪里

**当前代码**:
```typescript
// 贴出问题代码片段
```

**修正后的正确代码**:
```typescript
// 给出完整的修正示例
```

**为什么要这样改进**:
- 引用本项目哪条规范要求
- 解释这样改进带来什么好处
- 帮助开发者理解背后原因
```

### 分级标记严重程度

在问题标题前标记优先级：
- **[T0]** 必须立即修复 - 影响类型安全、功能正确性或违反核心规范
- **[T1]** 建议尽快修复 - 影响代码可维护性，不符合最佳实践
- **[T2]** 可以后续优化 - 不影响功能，纯代码风格问题

### 最终总结结构

所有问题检查完后，必须输出：

## 📊 整体评分

| 检查维度 | 评分 | 评价 |
|----------|------|------|
| 架构分层 | 得分/100 | 一句话评价 |
| 命名规范 | 得分/100 | 一句话评价 |
| Controller/Service | 得分/100 | 一句话评价 |
| DTO 验证 | 得分/100 | 一句话评价 |
| TypeScript | 得分/100 | 一句话评价 |
| 错误处理 | 得分/100 | 一句话评价 |
| Prisma ORM | 得分/100 | 一句话评价 |
| API 文档 | 得分/100 | 一句话评价 |
| 代码质量 | 得分/100 |

**总分**: XX/900

## 🎯 优先改进计划

按 T0 → T1 → T2 优先级排序：

### T0 必须立即修复（严重漏洞）

1. - [ ] **问题描述** - 文件: `路径/文件名.ts`
2. - [ ] ...

### T1 建议尽快修复（中等风险）

1. - [ ] **问题描述** - 文件: `路径/文件名.ts`
2. - [ ] ...

### T2 可以后续优化（低风险/改进）

1. - [ ] **问题描述** - 文件: `路径/文件名.ts`
2. - [ ] ...

## ✅ 做得好的地方

> 正向总结：列举符合规范的亮点，鼓励开发者

- 亮点 1...
- 亮点 2...

## 📚 推荐阅读

> 根据发现的问题，推荐开发者阅读相关规范文档深入理解：

- [架构与模块规范](../nestjs-backend-developer/01-architecture-module.md)
- [DTO 与数据验证规范](../nestjs-backend-developer/04-dto-validation.md)
- [Prisma ORM 开发规范](../nestjs-backend-developer/09-prisma-orm.md)
- [TypeScript 规范](../nestjs-backend-developer/05-typescript-spec.md)

---

## 行为准则

1. **严格对照项目规范**: 项目已有明确规范的，严格按项目规范检查，不输出与项目规范冲突的个人建议
2. **解释原因**: 每条建议都必须解释为什么，不假设开发者已经知道
3. **区分优先级**: 先解决必须修复的问题，再提优化建议
4. **给出可运行示例**: 不光说哪里错了，还要给出正确的代码示例让开发者参考
5. **不重复 ESLint 工作**: ESLint 已经能检查的问题，可以快速带过，重点关注 ESLint 检查不出来的架构和规范问题
6. **客观中立**: 对事不对人，只说代码问题，保持专业友好
