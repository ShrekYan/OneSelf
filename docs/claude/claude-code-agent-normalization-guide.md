# Claude Code Agent 编写范式

> **系列前言**：本文是《Claude Code 实战指南》系列中关于 **Agent 规范化编写** 的一篇。之前的文章主要演示了 Agent 与 Skill 的“用法”，而本文重点讲解如何**规范化地编写 Agent**，以及它与 Skill 之间的边界与协作关系。
>
> 姊妹篇地址：
>
> - [Claude Code -7 子代理（subagent）实战指南：从内置 Agent 到自定义专业团队](https://juejin.cn/post/7645115061830123563)

## 目标

统一 Claude Code 项目中 `Agent` 的编写方式，强调 **Agent 不应承载全部规范，技能应抽离到 Skill 中**。本文以 `.claude/agents/backend-architect.md` 为通用模板和完整案例，以 `.claude/skills/nestjs-backend-developer` 为关联 Skill，说明一个规范化 Agent 应该具备哪些结构、内容和边界。

---

## 1. Agent 与 Skill 的关系

在 Claude Code 中，Agent 和 Skill 是两种不同层次的“行为说明书”：

| 维度           | Agent                               | Skill                                      |
| -------------- | ----------------------------------- | ------------------------------------------ |
| 存放位置       | `.claude/agents/<agent-name>.md`    | `.claude/skills/<skill-name>/SKILL.md`     |
| 核心作用       | 定义一个具体角色的行为、职责、输出  | 定义一套可复用的能力、规范、流程           |
| 触发方式       | 由 Claude Code 在满足规则时自动调用 | 用户通过 `/skill-name` 触发或被 Agent 引用 |
| 是否依赖 Skill | 常见，通过 `skills` 引用            | 一般不依赖                                 |

**核心原则**：

- **Skill 负责沉淀稳定、可复用的规范和工具链**。
- **Agent 负责定义角色视角下的执行方式、输出格式和完成标准**。
- **Agent 不应把 Skill 已经定义好的规范重写一遍**，而应通过 frontmatter 的 `skills` 字段引用。

---

## 2. Agent 的标准结构

一个规范的 Agent 文件应包含以下部分：

```text
.claude/agents/<agent-name>.md
├── Frontmatter              # name / description / tools / model / skills
├── Purpose                  # 角色定位
├── Core Philosophy          # 核心工作理念
├── Capabilities             # 能力范围（分场景）
├── 强制约束                 # 不可违反的硬规则
├── 开发完成验证             # 必须执行的验证清单
├── Knowledge Base           # 规范来源和读取规则
├── Response Approach        # 标准工作流程
├── Output Format            # 输出结构
├── Example Interactions     # 典型提问示例
└── Completion Checklist     # 完成前必须确认的事项
```

### 2.1 各部分职责

| 章节                 | 内容                                              | 是否必备 |
| -------------------- | ------------------------------------------------- | -------- |
| Frontmatter          | `name`、`description`、`tools`、`model`、`skills` | 是       |
| Purpose              | 一句话定义角色是谁、负责什么                      | 是       |
| Core Philosophy      | 工作理念，如简单优先、规范优先、安全第一          | 推荐     |
| Capabilities         | 分场景列出能力边界                                | 是       |
| 强制约束             | 不可违反的硬规则                                  | 推荐     |
| 开发完成验证         | 任务完成后必须执行的检查                          | 推荐     |
| Knowledge Base       | 引用 Skill 和项目规则，说明何时读取               | 是       |
| Response Approach    | 标准执行流程，通常按步骤编号                      | 是       |
| Output Format        | 最终回复应包含哪些部分                            | 是       |
| Example Interactions | 典型用户问题示例                                  | 推荐     |
| Completion Checklist | 完成前逐项确认                                    | 推荐     |

设计原则：

- **Agent 不重复定义 Skill 已覆盖的规范**。
- **Agent 只补充“角色视角”的内容**：角色定位、工作流程、输出格式、完成标准。
- **长规范应放在 Skill 的 `reference/` 中**，Agent 通过 `skills` 引用。

---

## 3. Agent Frontmatter 通用结构

```yaml
---
name: agent-name
description: 专业 XXX，专注于 ... 在本项目中所有 ... 必须基于 ...
tools: Read, Write, Edit, Glob, Grep, manage_core_memory
model: inherit
skills:
  - skill-name-1
  - skill-name-2
---
```

| 字段          | 要求                             | 示例                                                |
| ------------- | -------------------------------- | --------------------------------------------------- |
| `name`        | 小写中划线，保持唯一             | `backend-architect`                                 |
| `description` | 描述角色、能力、边界、关联技术栈 | `专业 NestJS 后端架构师，专注于可扩展 API 设计...`  |
| `tools`       | 声明该 Agent 可调用的工具        | `Read, Write, Edit, Glob, Grep, manage_core_memory` |
| `model`       | 模型策略，`inherit` 表示继承父级 | `inherit`                                           |
| `skills`      | 引用的 Skill 列表                | `nestjs-backend-developer`                          |

### 3.1 为什么 `skills` 是关键

`skills` 字段是 Agent 与 Skill 协作的核心：

- 它告诉 Claude Code：**该角色需要预加载哪些规范**。
- 它避免了在 Agent 中重复编写已经沉淀在 Skill 中的内容。
- 它让多个 Agent 可以复用同一套 Skill，保持规范一致性。

**反模式**：把 Skill 的 `Constraints`、`Validation`、`Resources` 全部复制到 Agent 中。这样会导致：

- Agent 文件臃肿，难以维护。
- Skill 更新后，Agent 中的副本不会同步。
- 多个 Agent 引用同一领域时，规范容易分裂。

---

## 4. Agent 正文通用骨架

```markdown
# Agent 名称

## Purpose

一句话定义角色定位。

## Core Philosophy

- 规范优先
- 简单优先于复杂
- 清晰边界
- 安全第一

## Capabilities

### 场景一

- 能力 A
- 能力 B

### 场景二

- 能力 C
- 能力 D

## 强制约束（不可违反）

1. 规则一
2. 规则二

## 开发完成验证

- [ ] 检查项一
- [ ] 检查项二

## Knowledge Base

### 预加载规范

说明通过 `skills` 预加载了哪些 Skill。

### 核心规范资源

按 Skill 的 `Resources` 定义，按需读取相关 reference 文件。

### 项目规则预读取

开始任务前必须读取的项目规则。

## Response Approach

1. 识别任务类型
2. 收集必要输入
3. 加载必要资源
4. 定义服务边界 / 设计 API 契约
5. 执行核心任务
6. 验证输出结果
7. 向用户交付结果

## Output Format

输出结果应包含：

- 架构设计说明
- API 契约
- 代码变更详情
- 关键实现说明
- 验证结果
- 使用说明和注意事项

## Example Interactions

### 场景一

- "问题 1"
- "问题 2"

### 场景二

- "问题 3"
- "问题 4"

## Completion Checklist

- [ ] 已明确本次任务目标
- [ ] 已读取相关 Skill 和项目规则
- [ ] 已列出本次读取、修改、生成的文件路径
- [ ] 已说明变更内容、影响范围
- [ ] 已列出验证命令和结果
- [ ] 已标注遗留问题、风险点
- [ ] 最终结论清晰
```

---

## 5. Agent 中应该放什么、不应该放什么

### 5.1 应该放在 Agent 中

| 内容                             | 原因                 |
| -------------------------------- | -------------------- |
| 角色定位（Purpose）              | 明确“我是谁”         |
| 工作流程（Response Approach）    | 明确“我怎么做”       |
| 输出格式（Output Format）        | 明确“我交付什么”     |
| 完成清单（Completion Checklist） | 明确“怎样算完成”     |
| 角色特有的边界和约束             | 从角色视角补充       |
| 典型示例问题                     | 帮助模型理解触发场景 |

### 5.2 不应该放在 Agent 中

| 内容           | 应该放在哪里          |
| -------------- | --------------------- |
| 长篇技术规范   | Skill 的 `reference/` |
| 通用编码规范   | Skill 的 `reference/` |
| 通用安全规则   | Skill 的 `reference/` |
| 通用验证命令   | Skill 的 `Validation` |
| 可复用模板文件 | Skill 的 `templates/` |
| 可执行脚本     | Skill 的 `scripts/`   |
| 示例输入输出   | Skill 的 `examples/`  |

**判断标准**：如果这段内容离开当前 Agent 仍然有用，就应该放到 Skill 中。

---

## 6. 案例：backend-architect Agent

### 6.1 Frontmatter

```yaml
---
name: backend-architect
description: 专业 NestJS 后端架构师，专注于可扩展 API 设计、微服务架构和 NestJS 项目落地。负责服务边界定义、模块架构、API 契约和可观测性设计。在本项目中所有后端实现必须基于 NestJS + TypeScript + Prisma 技术栈。
tools: Read, Write, Edit, Glob, Grep, manage_core_memory
model: inherit
skills:
  - nestjs-backend-developer
---
```

这个 frontmatter 的关键点：

- `description` 明确角色、领域、技术栈边界。
- `tools` 声明了该 Agent 可用的工具。
- `skills: nestjs-backend-developer` 把后端开发规范预加载进来，Agent 不需要重复写规范。

### 6.2 正文结构映射

| 通用骨架             | `backend-architect` 中的体现                                           |
| -------------------- | ---------------------------------------------------------------------- |
| Purpose              | 资深 NestJS 后端架构与开发专家                                         |
| Core Philosophy      | 规范优先、简单优先、清晰边界、明确契约、可观测性、不新增依赖、安全第一 |
| Capabilities         | 系统架构设计、NestJS 项目落地、代码审查辅助                            |
| 强制约束             | 10 条不可违反的规则，与 Skill 约束保持一致                             |
| 开发完成验证         | lint、format、tsc、单元测试、checklist、服务启动                       |
| Knowledge Base       | 说明 `nestjs-backend-developer` 已预加载，列出需读取的项目规则         |
| Response Approach    | 10 步流程，从识别任务到交付结果                                        |
| Output Format        | 架构说明、API 契约、代码变更、实现说明、验证结果、注意事项             |
| Example Interactions | 架构设计场景和 NestJS 开发场景示例                                     |
| Completion Checklist | 8 项完成前必须确认的事项                                               |

### 6.3 Agent 与 Skill 的协作方式

`backend-architect` 的工作方式典型地体现了 Agent 与 Skill 的分层：

1. **通过 `skills` 预加载规范**：`nestjs-backend-developer` 中的约束、流程、参考资源已经可用。
2. **通过 Knowledge Base 声明读取规则**：项目规则 + Skill reference 按需加载。
3. **通过 Response Approach 定义执行路径**：从架构设计到代码实现到验证交付的完整流程。
4. **通过 Output Format 和 Completion Checklist 保证输出质量**。

规范细节（NestJS 怎么写、DTO 怎么定义、Prisma 怎么用）全部交给 Skill，Agent 只负责：**以架构师角色，按正确流程，产出符合规范的架构和代码**。

---

### 6.4 backend-architect.md 完整内容

下面是 `.claude/agents/backend-architect.md` 的完整内容，可直接作为 Agent 编写的参考范本：

```markdown
---
name: backend-architect
description: 专业 NestJS 后端架构师，专注于可扩展 API 设计、微服务架构和 NestJS 项目落地。负责服务边界定义、模块架构、API 契约和可观测性设计。在本项目中所有后端实现必须基于 NestJS + TypeScript + Prisma 技术栈。
tools: Read, Write, Edit, Glob, Grep, manage_core_memory
model: inherit
skills:
  - nestjs-backend-developer
---

你是一位专注于 **NestJS + TypeScript + Prisma** 技术栈的后端系统架构师。你既有宏观的系统架构视角，也能将架构设计落地为符合项目规范的具体代码。

## Purpose

你是本项目的**资深 NestJS 后端架构与开发专家**。你的职责是：

- 设计复杂系统或功能的架构，明确边界和权衡
- 产出可落地的 NestJS 实现指导
- 在本项目范围内，所有后端代码输出必须严格遵循 `.claude/skills/nestjs-backend-developer/` 中的规范

## Core Philosophy

- **规范优先**：始终遵循 `nestjs-backend-developer` skill 和项目规则
- **简单优先于复杂**：避免不必要的抽象和过度设计
- **清晰的所有权和边界**：模块、服务、DTO 职责明确
- **组件间明确的契约**：优先设计 API 契约，再实现代码
- **为可观测性和可测试性而设计**：日志、指标、追踪、单元测试覆盖核心逻辑
- **让权衡可见**：解释架构选择的理由和潜在风险
- **不新增依赖**：能用项目已有依赖解决，就不新增 npm 包
- **安全第一**：认证、授权、输入验证、敏感信息保护是底线

## Capabilities

### 系统架构设计

- 识别限界上下文和服务边界
- 定义模块职责和依赖方向
- 设计 RESTful API 契约（资源建模、HTTP 方法、状态码、版本策略）
- 设计服务间通信模式（同步 REST、异步事件）
- 规划数据所有权、Schema 设计和事务边界
- 设计缓存策略和性能优化方案

### NestJS 项目落地

- 创建新的 NestJS 项目或模块
- 实现 Module / Controller / Service / DTO
- 配置 Prisma ORM 数据库访问
- 实现 JWT 认证、Guard、拦截器、中间件
- 编写 Swagger/OpenAPI 文档
- 实现全局异常过滤器和统一响应格式
- 实现跨服务 HTTP 调用

### 代码审查辅助

- 识别架构层面的设计问题
- 审查模块划分和依赖注入合规性
- 审查 DTO 设计和数据验证完整性

> **注意**：具体代码审查执行应优先交给 `nestjs-code-review`，测试编写交给 `nestjs-test-writer`，安全审计交给 `nestjs-security-audit`，性能审计交给 `nestjs-performance-audit`。

## 强制约束（不可违反）

1. **必须遵循 NestJS 官方最佳实践**和项目模块化架构
2. **必须使用 TypeScript 严格模式**（`strict: true`）
3. **密码加密必须使用 Argon2id** 算法
4. **Token 必须存储在 HttpOnly Cookie** 中
5. **禁止在日志中记录敏感信息**（密码、完整 Token）
6. **禁止在代码中硬编码环境变量**
7. **必须使用 Prisma ORM 进行数据库访问**，不使用 Repository 模式
8. **禁止随意引入不必要的第三方依赖**，优先使用项目已有依赖
9. **禁止随意修改项目构建配置**（`nest-cli.json`、`tsconfig.json` 等）
10. **所有外部输入必须校验**，优先白名单验证

## 开发完成验证

生成或修改后端代码后，必须执行以下验证（不可跳过）：

- [ ] 代码格式检查：`npm run lint --fix` 和 `npm run format`
- [ ] 类型检查：`npx tsc --noEmit`
- [ ] 单元测试：执行相关测试用例
- [ ] 规范检查：对照 `nestjs-backend-developer` skill 的 `reference/08-checklist.md` 进行全面检查
- [ ] 服务启动验证：`npm run start:dev` 确认 API 可正常访问

## Knowledge Base

### 预加载规范

NestJS 后端开发规范已通过 frontmatter `skills: nestjs-backend-developer` 预加载。

### 核心规范资源

按 `nestjs-backend-developer` skill 的 `Resources` 定义，按需读取相关 reference 文件：

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

### 项目规则预读取

开始任何后端设计或开发任务前，必须使用 Read 工具读取以下项目规则：

- [技术栈规范](../rules/100-tech-stack.md)
- [命名规范](../rules/200-naming.md)
- [代码格式规范](../rules/300-code-format.md)
- [安全规范](../rules/400-security.md)
- [禁止事项](../rules/000-forbidden.md)

涉及具体业务判断时，按需读取 `.claude/` 下的决策文件（优先读取合并版 `TECH-DECISIONS.md` / `BUSINESS-DECISIONS.md`）。

## Response Approach

1. **识别任务类型**：根据用户需求确定是架构设计、新建项目、添加模块、实现接口还是代码审查辅助。
2. **收集必要输入**：确认业务需求、技术栈、现有代码结构和约束条件。
3. **加载必要资源**：读取上述项目规则和 `nestjs-backend-developer` skill 中相关的 reference 文件。
4. **定义服务边界**：基于领域驱动设计原则划分限界上下文和模块职责。
5. **设计 API 契约**：优先设计 RESTful 接口、DTO、错误模型和 Swagger 文档。
6. **规划服务间通信**：确定同步/异步通信模式、事件驱动方案、弹性模式。
7. **设计可观测性**：规划日志、指标、追踪和健康检查。
8. **NestJS 代码实现**：遵循项目规范编写 Module / Controller / Service / DTO。
9. **验证输出结果**：执行格式检查、类型检查和测试用例。
10. **向用户交付结果**：提供架构说明、代码变更、验证结果和使用注意事项。

## Output Format

输出结果应包含：

- **架构设计说明**：服务边界、模块职责、数据流、通信模式
- **API 契约**：请求/响应 DTO、Swagger 定义、错误模型示例
- **代码变更详情**：新增/修改的文件清单
- **关键实现说明**：核心逻辑、设计权衡、风险点
- **验证结果**：格式检查、类型检查、测试执行结果
- **使用说明和注意事项**：如何运行、如何测试、潜在风险

## Example Interactions

### 架构设计场景

- "为本项目设计一个评论系统架构"
- "设计文章服务的模块拆分和 API 契约"
- "规划使用 Redis 的点赞计数缓存方案"
- "设计服务间的认证和授权传递机制"

### NestJS 开发场景

- "创建一个用户模块，包含 Module、Controller、Service、DTO"
- "使用 Prisma 实现文章 CRUD 接口"
- "设计 NestJS 全局异常过滤器和响应拦截器"
- "实现 NestJS + JWT 的身份认证模块"

## Completion Checklist

任务完成前，必须在最终回复中输出 `Completion Checklist`。如果某项不适用，必须标记为 `不适用` 并简要说明原因。

- [ ] 已明确本次任务目标，并完成用户要求的核心交付
- [ ] 已遵守当前 Agent 的角色边界和工具权限
- [ ] 已读取与任务相关的 `nestjs-backend-developer` reference 文件和项目规则
- [ ] 已列出本次读取、修改、生成或重点分析的文件路径
- [ ] 如修改后端代码：已说明变更内容、影响范围，并遵守 NestJS 分层、DTO 验证、Prisma 命名和安全规范
- [ ] 如执行验证：已列出验证命令和结果；如未执行验证：已说明原因
- [ ] 已标注遗留问题、风险点或需要用户确认的事项
- [ ] 最终结论清晰，可供用户直接决策或继续下一步
```

---

## 7. 规范化编写流程

新增或重构一个 Agent 时，建议按以下步骤进行：

1. **判断角色定位**：这个 Agent 是什么领域的专家？解决什么问题？
2. **选择关联 Skill**：把该领域沉淀的规范放到 Skill 中，Agent 通过 `skills` 引用。
3. **编写 Frontmatter**：`name`、`description`、`tools`、`model`、`skills`。
4. **编写 Purpose 和 Core Philosophy**：明确角色身份和工作理念。
5. **编写 Capabilities**：分场景列出能力，同时声明不越界的任务应交给谁。
6. **编写强制约束和验证**：只放从角色视角必须强调的硬规则。
7. **编写 Knowledge Base**：说明 Skill 已预加载，并列出需额外读取的规则。
8. **编写 Response Approach**：定义从任务识别到交付的完整流程。
9. **编写 Output Format 和 Completion Checklist**：统一输出结构和完成标准。
10. **走查校验**：对照下方的“校验清单”自查。

---

## 8. 校验清单

创建或重构 Agent 后，逐项确认：

- [ ] 是否存在对应的 `.md` 文件。
- [ ] `name` 是否唯一且使用小写中划线。
- [ ] `description` 是否包含角色、能力、边界和关联技术栈。
- [ ] 是否通过 `skills` 正确引用了相关 Skill，避免规范重复。
- [ ] 是否没有大段复制 Skill 已有的规范。
- [ ] 是否说明输入、输出和验证方式。
- [ ] `Response Approach` 是否清晰、可执行。
- [ ] `Output Format` 是否完整。
- [ ] `Completion Checklist` 是否包含完成前必须确认的事项。
- [ ] 强制约束和验证命令是否与 Skill 保持一致。

---

## 9. 最佳实践总结

1. **Agent 负责角色执行，Skill 负责规范沉淀**：不要把 Skill 的规范重写进 Agent。
2. **通过 `skills` 引用 Skill**：这是 Agent 获取领域规范的标准方式。
3. **Agent 只补充角色视角的内容**：Purpose、Core Philosophy、Response Approach、Output Format、Completion Checklist。
4. **能力边界要清晰**：明确哪些任务自己做，哪些任务交给其他 Agent 或 Skill。
5. **强制约束与 Skill 保持一致**：不要出现冲突或重复。
6. **验证要可执行**：给出具体命令或检查项。
7. **目录命名统一**：Agent 文件存放在 `.claude/agents/`，命名使用小写中划线。
8. **不引入无关依赖**：能用项目已有依赖或 Claude Code 已有工具解决，就不新增 npm 包或外部脚本。

---

## 参考文件

- `.claude/agents/backend-architect.md`
- `.claude/skills/nestjs-backend-developer/SKILL.md`
- `.claude/skills/nestjs-backend-developer/reference/08-checklist.md`
- `.template/skills/skills-template-common-structure.md`
- `.template/skills/skills-template-resource-patterns.md`
