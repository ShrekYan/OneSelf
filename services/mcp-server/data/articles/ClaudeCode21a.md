---
title: SKILL 规范化编写范式
slug: claude-code-skill-standard-paradigm
date: 2024-06-01
tags: [Claude Code, Skill, 规范化]
---

**系列前言**：本文是# Claude Code 工程化实战：从单兵到军团(保姆级教程)系列中关于 **Skill 规范化编写** 的一篇。之前的文章主要演示了 Agent 与 Skill 的"用法"，而本文重点讲解如何**规范化地编写 Skill**，让工程规范能够稳定、可复用地沉淀下来。

姊妹篇地址：

- [Claude Code -8 Skills 实战指南：让 AI 精准执行你的工程规范](https://juejin.cn/post/7645131219097436160)

## 目标

统一 Claude Code 项目中 `Skill` 的编写方式，让新技能的创建、老技能的维护和跨项目复用都有明确范式可遵循。本文以 `.template/skills` 的通用模板为基础，以 `nestjs-backend-developer` 为真实案例，说明一个规范化 Skill 应该具备哪些结构、内容和边界。

---

## 1. Skill 的定位

Skill 是 Claude Code 中的**可复用能力说明书**，它定义了一套规范、流程或工具链，供模型在对应场景下调用。

- **存放位置**：`.claude/skills/<skill-name>/SKILL.md`
- **核心作用**：定义一套可复用的能力、规范、流程
- **触发方式**：用户可通过 `/skill-name` 直接触发，也可由其他配置文件引用
- **设计目标**：把稳定、可复用的知识沉淀下来，避免每次任务都重新描述

---

## 2. 标准目录结构

根据 `.template/skills/skills-template-common-structure.md`，一个完整的 Skill 目录应如下组织：

```
<skill-name>/
├── SKILL.md                 # 必备：元信息、触发条件、核心流程
├── LICENSE.txt              # 推荐：许可或使用条款
├── templates/               # 可选：可复制的模板文件
├── scripts/                 # 可选：确定性脚本和工具
├── reference/               # 可选：长文档、规范、分语言指南
├── examples/                # 可选：示例输入、输出、流程
├── assets/                  # 可选：静态资源
├── themes/                  # 可选：主题文件
└── core/                    # 可选：可复用核心逻辑
```

### 2.1 目录职责

| 目录       | 放置内容                       | 典型场景                    |
| ---------- | ------------------------------ | --------------------------- |
| SKILL.md   | 触发、判断、流程、关键约束     | 所有 Skill 必备             |
| templates/ | 起步代码、HTML、XML、文档片段  | 需要生成基础文件时          |
| scripts/   | Python、Shell、JS 等确定性脚本 | 需要校验、转换、处理时      |
| reference/ | 长规范、最佳实践、分语言指南   | SKILL.md 过长或按场景加载时 |
| examples/  | 示例输入、示例输出、示例流程   | 供模型模仿格式和场景        |
| assets/    | 图片、字体、HTML 等静态资源    | 产物需要复用资源            |
| themes/    | 主题配置、视觉风格             | 视觉或文档主题复用          |
| core/      | 可复用内部模块                 | 复杂工具链或生成器内部逻辑  |

设计原则：

- `SKILL.md` 只放触发、判断、流程和关键约束，不放长篇规范。
- 大段参考资料拆入 `reference/`。
- 可运行或可复用的确定性逻辑放入 `scripts/` 或 `core/`。
- 可复制起步文件放入 `templates/`。
- 示例和样例输出放入 `examples/`。

---

## 3. SKILL.md 通用结构

### 3.1 Frontmatter 模板

```yaml
---
name: skill-name
description: Use this skill when ...
license: Complete terms in LICENSE.txt
---
```

| 字段        | 要求                         | 示例                                                                 |
| ----------- | ---------------------------- | -------------------------------------------------------------------- |
| name        | 小写中划线，保持唯一         | nestjs-backend-developer                                             |
| description | 同时描述能力、触发场景、边界 | 当用户需要开发、构建、集成或优化 NestJS 后端 API 服务时使用此技能... |
| license     | 指向许可文件或说明条款位置   | Complete terms in LICENSE.txt                                        |

### 3.2 正文通用骨架

```markdown
# Skill Title

## Overview

说明 skill 的目标、适用场景、核心产物和总体工作方式。

## When to use this skill

列出典型触发场景、用户表达和不适用场景。

## Inputs

说明需要用户提供哪些信息、文件、约束或上下文。

## Workflow

1. 识别任务类型。
2. 收集必要输入。
3. 加载必要资源。
4. 执行核心流程。
5. 验证输出结果。
6. 向用户交付结果。

## Resources

说明何时读取 `templates/`、`scripts/`、`reference/`、`examples/` 等资源。

## Output format

定义最终回复、文件、报告或产物的结构。

## Validation

说明如何检查结果正确性、完整性和风险。

## Constraints

说明限制条件、安全边界、兼容性和禁止事项。
```

### 3.3 description 触发描述写法

`description` 是 Skill 的主要触发入口，应尽量包含：

1. skill 能做什么。
2. 用户出现哪些表达时应使用。
3. 典型任务类型。
4. 不应使用的边界。
5. 必要时强调"即使用户没有直接说出 skill 名称，也应该触发"。

推荐模板：

```
description: Use this skill whenever the user wants to <核心目标>. Triggers include <关键词/场景>. Also use when <相邻场景>. Do NOT use for <排除场景>.
```

---

## 4. 资源目录设计规范

### 4.1 `reference/` 与 `examples/` 的边界

| 目录       | 重点                   | 示例                                |
| ---------- | ---------------------- | ----------------------------------- |
| examples/  | 教模型模仿格式和场景   | 沟通模板、测试脚本、样例输出        |
| reference/ | 提供系统性知识和长指南 | 最佳实践、语言实现指南、schema 说明 |

当内容具有"可模仿性"时放入 `examples/`；当内容具有"可查询性"时放入 `reference/`。

### 4.2 `scripts/` 设计建议

适合承载可重复、可验证、确定性的任务：

- 文档拆包、打包、格式校验。
- PDF 表单字段检测与填充。
- Office XML schema 校验。
- MCP server 连接检查与评估。
- 测试自动化示例脚本。

设计建议：

1. 脚本职责单一，文件名表达动作。
2. 在 `SKILL.md` 中明确何时调用脚本。
3. 说明输入文件、输出文件和失败处理方式。
4. 不把脚本源码大段复制进 `SKILL.md`。

### 4.3 目录选择决策表

| 需要保存的内容   | 推荐目录                       |
| ---------------- | ------------------------------ |
| 可复制起步文件   | templates/                     |
| 可执行确定性流程 | scripts/                       |
| 脚本内部片段     | scripts/templates/             |
| 长指南或规范     | reference/                     |
| 可模仿样例       | examples/                      |
| 主题定义         | themes/                        |
| 静态展示或资源   | assets/                        |
| 可复用内部库     | core/                          |
| 字体与授权说明   | canvas-fonts/ 或 assets/fonts/ |

---

## 5. 案例：nestjs-backend-developer Skill

### 5.1 目录结构

```
.claude/skills/nestjs-backend-developer/
├── SKILL.md
└── reference/
    ├── 01-architecture-module.md
    ├── 02-file-naming.md
    ├── 03-controller-service.md
    ├── 04-dto-validation.md
    ├── 05-typescript-spec.md
    ├── 06-api-documentation.md
    ├── 07-error-handling.md
    ├── 08-checklist.md
    ├── 09-prisma-orm.md
    ├── 10-code-format.md
    ├── 11-security-authentication.md
    ├── 12-middleware.md
    ├── 13-scheduled-tasks.md
    ├── 14-cross-service-http.md
    └── nestjs-typescript.md
```

这是一个典型的"开发规范型 Skill"：**没有 `templates/`、`scripts/`、`examples/`，全部规范都沉淀在 `reference/` 中**。这符合"把长参考内容拆出 `SKILL.md`"的原则。

### 5.2 Frontmatter

```yaml
---
name: nestjs-backend-developer
description: 当用户需要开发、构建、集成或优化 NestJS 后端 API 服务时使用此技能。触发场景包括：创建新的 NestJS 项目、实现 RESTful API、设计模块架构、配置 Prisma ORM、实现认证安全、编写中间件等。也适用于代码审查和规范检查。不适用于前端开发或其他框架（如 Express、Fastify 原生）。
license: Complete terms in LICENSE.txt
---
```

`description` 覆盖了能力、触发场景和不适用边界，符合通用模板要求。

### 5.3 正文结构映射

| 通用骨架      | nestjs-backend-developer 中的体现                                        |
| ------------- | ------------------------------------------------------------------------ |
| Overview      | 本技能提供完整的 NestJS 后端开发规范和最佳实践                           |
| When to use   | 创建项目、实现 API、Prisma、JWT、中间件、代码审查；不用于前端/Express    |
| Inputs        | 业务需求、技术栈、现有结构、环境配置、安全约束                           |
| Workflow      | 识别任务 -> 收集输入 -> 加载 reference -> 执行 -> 验证 -> 交付           |
| Resources     | 用表格列出 14 个 reference 文件及读取时机                                |
| Output format | 代码变更、实现说明、验证结果、使用说明                                   |
| Validation    | lint、format、tsc、单元测试、checklist、服务启动                         |
| Constraints   | NestJS 最佳实践、strict、Argon2id、HttpOnly Cookie、Prisma、不新增依赖等 |

### 5.4 reference 资源加载设计

`SKILL.md` 通过表格把 `reference/` 中的文件与使用场景一一对应：

| 资源                                    | 何时使用                  |
| --------------------------------------- | ------------------------- |
| reference/01-architecture-module.md     | 设计模块架构和目录结构时  |
| reference/04-dto-validation.md          | 定义 DTO 和数据验证规则时 |
| reference/11-security-authentication.md | 实现认证安全功能时        |
| ...                                     | ...                       |

这种"按需加载"的方式避免了一次性把所有规范塞进上下文，符合 `SKILL.md` 的编写原则。

### 5.5 强制约束与验证

该 Skill 把"不可违反"的约束单独列出：

- 必须使用 TypeScript 严格模式（`strict: true`）
- 密码加密必须使用 Argon2id
- Token 必须存储在 HttpOnly Cookie 中
- 必须使用 Prisma ORM，不使用 Repository 模式
- 禁止随意引入不必要的第三方依赖

并在 `Validation` 中给出可执行的检查命令：

```bash
npm run lint --fix
npm run format
npx tsc --noEmit
npm run test
npm run start:dev
```

### 5.6 SKILL.md 完整内容

下面是 `.claude/skills/nestjs-backend-developer/SKILL.md` 的完整内容，可直接作为规范型 Skill 的参考范本：

```markdown
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

| 资源                                      | 何时使用                      |
| ----------------------------------------- | ----------------------------- |
| `reference/01-architecture-module.md`     | 设计模块架构和目录结构时      |
| `reference/02-file-naming.md`             | 确定文件和类命名规范时        |
| `reference/03-controller-service.md`      | 实现 Controller 和 Service 时 |
| `reference/04-dto-validation.md`          | 定义 DTO 和数据验证规则时     |
| `reference/05-typescript-spec.md`         | 编写 TypeScript 代码时        |
| `reference/06-api-documentation.md`       | 添加 Swagger API 文档时       |
| `reference/07-error-handling.md`          | 实现异常处理时                |
| `reference/08-checklist.md`               | 开发完成后进行检查时          |
| `reference/09-prisma-orm.md`              | 使用 Prisma ORM 时            |
| `reference/10-code-format.md`             | 代码格式化和工具链配置时      |
| `reference/11-security-authentication.md` | 实现认证安全功能时            |
| `reference/12-middleware.md`              | 编写中间件时                  |
| `reference/13-scheduled-tasks.md`         | 实现定时任务时                |
| `reference/14-cross-service-http.md`      | 实现跨服务 HTTP 调用时        |

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
```

---

## 6. 规范化编写流程

新增或重构一个 Skill 时，建议按以下步骤进行：

1. **判断类型**：产物型、规范型、工具型、审查型、创作型？
2. **选择模板**：基于 `.template/skills` 中的分类模板（通用结构、资源模式、设计创作、文档处理、开发工具、测试通信）。
3. **编写 Frontmatter**：必填 `name`、`description`；可选 `license`。
4. **编写正文骨架**：Overview、When to use、Inputs、Workflow、Resources、Output format、Validation、Constraints。
5. **拆分资源**：把长规范移入 `reference/`，把可执行脚本放入 `scripts/`，把模板放入 `templates/`，把样例放入 `examples/`。
6. **定义触发边界**：`description` 必须同时说明"何时用"和"何时不用"。
7. **定义验证清单**：列出可执行的检查项或命令。
8. **走查校验**：对照下方的"校验清单"自查。

---

## 7. 校验清单

创建或重构 Skill 后，逐项确认：

- 是否存在 `SKILL.md`。
- `name` 是否唯一且使用小写中划线。
- `description` 是否包含触发场景和排除边界。
- 是否把长参考内容拆出 `SKILL.md`。
- 是否把确定性逻辑放入脚本或核心模块。
- 是否说明输入、输出和验证方式。
- 是否避免复制大段许可证或无关源码。
- 是否能让模型按需加载资源，而不是一次性读取全部内容。
- 强制约束、验证命令是否完整。

---

## 8. 最佳实践总结

1. **Skill 负责规范沉淀**：把稳定、可复用的能力写成 Skill，避免每次任务重复说明。
2. **保持 `SKILL.md` 简洁**：超过 500 行时，应把长内容拆入 `reference/` 或 `examples/`。
3. **触发描述要具体**：必须同时包含"典型触发"和"不应使用"两个维度。
4. **资源按需加载**：在 `Resources` 中用表格说明每个文件的使用时机。
5. **强制约束不可协商**：用编号列表明确"不可违反"的规则。
6. **验证要可执行**：给出具体命令或检查项，而不是抽象要求。
7. **目录命名统一**：`SKILL.md` 大写、`reference/`、`templates/`、`scripts/`、`examples/`、`assets/`、`themes/`、`core/` 小写。
