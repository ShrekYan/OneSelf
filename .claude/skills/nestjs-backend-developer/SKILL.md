---
name: nestjs-backend-developer
description: 当用户需要开发、构建、集成或优化 NestJS 后端 API 服务时使用此技能。触发场景包括：创建新的 NestJS 项目、实现 RESTful API、设计模块架构、配置 Prisma ORM、实现认证安全、编写中间件等。也适用于代码审查和规范检查。不适用于前端开发或其他框架（如 Express、Fastify 原生）。
license: Complete terms in LICENSE.txt
---

# NestJS 后端开发工程师

## Overview

本技能提供完整的 NestJS 后端开发规范和最佳实践，帮助开发者构建高质量、可维护的企业级后端 API 服务。核心技术栈包括 NestJS 11.0 + TypeScript 5.7 + Prisma ORM 6.4，涵盖架构设计、代码规范、安全认证、错误处理等方面。

## When to use this skill

- 用户需要创建新的 NestJS 项目或模块
- 用户需要实现 RESTful API 接口
- 用户需要设计模块化架构和目录结构
- 用户需要配置 Prisma ORM 数据库访问
- 用户需要实现 JWT 认证和安全策略
- 用户需要编写中间件、守卫或拦截器
- 用户需要进行代码审查和规范检查

**不适用场景**：
- 前端开发任务
- 其他框架（Express、Fastify 原生）开发
- 纯数据库查询或 SQL 编写
- 运维部署和 DevOps 任务

## Inputs

开始开发任务前，请准备以下信息：
- 业务需求和功能描述
- 技术栈要求（如数据库类型、认证方式）
- 项目现有结构和代码风格
- 环境配置要求（如端口、数据库连接）
- 安全约束和合规要求

## Workflow

1. **识别任务类型**：根据用户需求确定是新建项目、添加模块、实现接口还是代码审查。
2. **收集必要输入**：确认技术栈、现有代码结构和约束条件。
3. **加载必要资源**：根据任务类型读取 `reference/` 目录中的相关规范文档。
4. **执行核心流程**：按照规范实现代码，包括架构设计、代码编写、测试验证。
5. **验证输出结果**：执行格式检查、类型检查和测试用例。
6. **向用户交付结果**：提供代码变更说明和验证结果。

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/01-architecture-module.md` | 设计模块架构和目录结构时 |
| `reference/02-file-naming.md` | 确定文件和类命名规范时 |
| `reference/03-controller-service.md` | 实现 Controller 和 Service 时 |
| `reference/04-dto-validation.md` | 定义 DTO 和数据验证规则时 |
| `reference/05-typescript-spec.md` | 编写 TypeScript 代码时 |
| `reference/06-api-documentation.md` | 添加 Swagger API 文档时 |
| `reference/07-error-handling.md` | 实现异常处理时 |
| `reference/08-checklist.md` | 开发完成后进行检查时 |
| `reference/09-prisma-orm.md` | 使用 Prisma ORM 时 |
| `reference/10-code-format.md` | 代码格式化和工具链配置时 |
| `reference/11-security-authentication.md` | 实现认证安全功能时 |
| `reference/12-middleware.md` | 编写中间件时 |
| `reference/13-scheduled-tasks.md` | 实现定时任务时 |
| `reference/14-cross-service-http.md` | 实现跨服务 HTTP 调用时 |

### 资源加载指南

开始任何后端开发任务之前，请先阅读以下核心规范：

#### 后端核心规范

- [架构与模块规范](reference/01-architecture-module.md)
- [文件命名规范](reference/02-file-naming.md)
- [Controller 与 Service 开发规范](reference/03-controller-service.md)
- [DTO 与数据验证规范](reference/04-dto-validation.md)
- [TypeScript 规范](reference/05-typescript-spec.md)
- [API 文档规范](reference/06-api-documentation.md)
- [异常处理规范](reference/07-error-handling.md)
- [开发完成检查清单](reference/08-checklist.md)

#### 数据、安全与服务治理

- [Prisma ORM 开发规范](reference/09-prisma-orm.md)
- [代码格式与工具链规范](reference/10-code-format.md)
- [安全认证规范](reference/11-security-authentication.md)
- [中间件开发规范](reference/12-middleware.md)
- [定时任务开发规范](reference/13-scheduled-tasks.md)
- [跨服务 HTTP 客户端规范](reference/14-cross-service-http.md)

#### 补充规则

- [NestJS TypeScript 开发规范](reference/nestjs-typescript.md)

## Output format

输出结果应包含：
- 代码变更详情（新增/修改的文件）
- 关键实现说明
- 验证结果（格式检查、类型检查、测试）
- 使用说明和注意事项

## Validation

- [ ] 代码格式检查：`npm run lint --fix` 和 `npm run format`
- [ ] 类型检查：`npx tsc --noEmit`
- [ ] 单元测试：执行相关测试用例
- [ ] 规范检查：对照 `reference/08-checklist.md` 进行全面检查
- [ ] 服务启动验证：`npm run start:dev` 确认 API 可正常访问

## Constraints

- 必须遵循 NestJS 官方最佳实践
- 必须使用 TypeScript 严格模式（`strict: true`）
- 密码加密必须使用 Argon2id 算法
- Token 必须存储在 HttpOnly Cookie 中
- 禁止在日志中记录敏感信息（密码、完整 Token）
- 禁止在代码中硬编码环境变量
- 必须使用 Prisma ORM 进行数据库访问，不使用 Repository 模式