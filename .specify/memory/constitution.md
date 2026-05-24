<!--
同步影响报告
版本变化：模板占位 -> 1.0.0
已修改原则：
- 模板原则一 -> I. 类型安全优先
- 模板原则二 -> II. 默认安全
- 模板原则三 -> III. 清晰架构边界
- 模板原则四 -> IV. 最小变更与优先复用
- 模板原则五 -> V. 规格与契约驱动
新增原则：
- VI. 验证门禁
- VII. 一致性与格式规范
新增章节：
- 系统边界与技术约束
- Spec Kit 工作流与 Constitution Check
移除章节：
- 模板中的占位章节 SECTION_2_NAME 与 SECTION_3_NAME
模板同步：
- ✅ .specify/templates/plan-template.md 已检查；按用户要求不修改模板
- ✅ .specify/templates/spec-template.md 已检查；无需强制修改
- ✅ .specify/templates/tasks-template.md 已检查；无需强制修改
- ✅ .specify/templates/commands/*.md 已检查；未发现文件
后续 TODO：
- 无
-->

# Claude Monorepo Constitution

## Core Principles

### I. 类型安全优先

所有生产代码必须符合仓库 TypeScript 严格模式的预期。函数和方法参数、返回值、异步
`Promise<T>` 返回值、公共组件 Props、API 数据结构、DTO、共享包导出都必须使用明确类型。
禁止无理由使用 `any`；应优先使用具体类型、泛型，或使用 `unknown` 并配合类型守卫完成收窄。
仅导入或导出类型时，必须使用 `import type` 和 `export type`。

理由：本项目同时包含前端、后端和共享包，类型安全是防止跨系统数据结构漂移和集成错误的
基础防线。

### II. 默认安全

认证与敏感数据处理必须默认安全。Access Token 与 Refresh Token 必须通过 HttpOnly Cookie
传输；前端代码禁止把 Token 存入 `localStorage` 或 `sessionStorage`，也禁止手动拼接携带
Token 的 Authorization 请求头。新密码哈希必须使用 Argon2id。日志和错误响应不得暴露完整
Token、密钥、SQL 细节、堆栈、内部路径等敏感信息。所有系统边界处的外部输入都必须进行
明确的白名单、类型、范围和格式校验。

理由：统一的安全默认值可以降低 XSS 窃取 Token、凭据泄露、账户枚举和输入绕过等风险。

### III. 清晰架构边界

仓库必须保持 Monorepo 系统边界：`apps/` 存放面向用户的应用，`services/` 存放独立职责的
后端服务，`packages/` 存放跨系统技术库，`specs/` 存放 Spec Kit 功能产物，`.claude/` 存放
Claude Code 规则和项目指导。后端服务之间必须通过服务 API 通信，不得直接共享数据库。
认证策略归属 `services/auth-service`；博客核心业务归属 `services/backend`；日志与审计能力
归属 `services/log-service`。共享包必须保持纯技术能力，不得依赖业务服务或承载业务流程。

理由：清晰边界可以保证服务独立演进和独立部署，降低耦合，并让 Spec Kit 计划能基于明确
职责进行审查。

### IV. 最小变更与优先复用

任何变更都必须以满足已批准需求为最小范围。新增实现前，必须优先搜索并复用现有组件、Hook、
工具函数、DTO、服务和共享包。公共接口、导出函数、路由契约、数据库结构和共享包 API 不得在
未评估影响范围的情况下重命名或修改。重构、新抽象和大范围格式调整必须服务于当前需求，不能
基于假设的未来需求提前引入。

理由：最小变更和优先复用可以降低多系统仓库中的回归风险，让评审聚焦于本次需求本身。

### V. 规格与契约驱动

非平凡功能必须由 Spec Kit 产物驱动：先形成清晰的 `spec.md`，再形成 `plan.md`，最后生成
可执行的 `tasks.md` 后再进入实现。功能涉及 API、工具函数入口、服务接口或跨系统数据结构时，
必须在 `contracts/` 中描述可观察行为。实现必须与已批准的 spec、plan、tasks 和 contracts
保持一致；若行为发生实质变化，必须同步更新相关产物。

理由：规格和契约为“用户意图 -> 设计 -> 实现 -> 验证”提供可追溯链路，也让 Constitution
Check 有明确依据。

### VI. 验证门禁

每个变更都必须定义与影响范围匹配的验证方式。代码变更至少要在受影响子项目执行本地 lint 和
类型检查。后端变更必须执行对应服务的 lint、build、test，或记录等价验证方式。前端变更影响
`apps/web` 时，必须在 `apps/web` 执行 `npm run lint` 和 `npx tsc --noEmit`。契约变更必须
与已生成或已记录的契约核对。对于新增行为、高风险行为、跨系统行为或回归风险较高的行为，
应该新增或更新测试；如果某个 feature 明确不写测试，只能在该 feature 的 plan 中说明，不能
变成全项目免测规则。

理由：验证强度应随风险变化；不能把单个 feature 的临时测试约束误升格为长期项目原则。

### VII. 一致性与格式规范

代码必须遵守仓库统一格式基线：2 空格缩进、单引号、分号、多行对象和数组使用 trailing comma、
导入分组排序、逻辑块之间保留空行。命名和结构必须遵循所属系统规则：前端页面使用已确认的
页面拆分模式，公共组件保持 Props 驱动并使用 CSS Modules，Prisma 模型使用 PascalCase，
并通过映射保持数据库表名 snake_case，共享包暴露稳定且有类型的 API。

理由：一致的结构和格式可以降低理解成本，让多人和多 Agent 协作时更容易审查变更。

## 系统边界与技术约束

- `apps/web/` 是 H5 前端应用，使用 React 19、Vite、TypeScript、MobX、Ant Design Mobile、
  SCSS、CSS Modules、React Router 和既有前端 API 分层。
- `services/auth-service/` 负责登录、注册、Token 签发、Token 刷新、Token 校验和会话认证策略。
- `services/backend/` 负责文章、评论、用户管理等博客核心业务，并必须把认证校验委托给认证
  服务边界。
- `services/log-service/` 负责操作日志、审计追踪和行为分析。
- `packages/shared-logging/` 是纯 TypeScript 共享日志包。修改共享包时，必须考虑所有使用方，
  并在共享契约变化时同步更新调用方。
- 新增系统必须放入正确的顶层边界：`apps/`、`services/` 或 `packages/`，并在对应 Spec Kit
  plan 中说明归属、依赖和通信边界。
- 替换已采纳的技术栈或架构决策，例如替换 MobX、Vite、React Router、NestJS、Prisma 或
  HttpOnly Cookie 认证策略，必须先更新 ADR/FADR，并完成 Constitution 合规审查。

## Spec Kit 工作流与 Constitution Check

每个 feature 的 `plan.md` 必须在 Phase 0 research 前包含 Constitution Check。该检查必须把
feature 映射到本 Constitution 的原则，并明确说明计划是否满足类型安全、默认安全、架构边界、
最小变更、规格/契约、验证门禁和一致性规则。

Phase 1 设计产物完成后，`plan.md` 必须包含 Post-Design Constitution Check。第二次检查必须
确认 `research.md`、`data-model.md`、`contracts/` 和 `quickstart.md` 没有引入新的原则违反项，
并确认验证步骤仍然匹配 feature 的影响范围。

如果某个 feature 无法遵守某条原则，必须在 `plan.md` 的 `Complexity Tracking` 表格中记录：
违反的原则、为什么必须例外、考虑过的更简单合规方案、为什么拒绝该方案，以及例外适用范围。
例外只对当前 feature 有效，不得作为其他 feature 的先例。

Spec Kit 产物必须保留历史上下文。已经完成的历史 feature plan 不需要因为本 Constitution
生效而强制回写；从版本 1.0.0 起，新建或再次修改的 feature 必须使用本 Constitution。

## Governance

本 Constitution 是仓库顶层治理文件。`.claude/DECISIONS.md`、`.claude/FRONTEND-DECISIONS.md`
和 `.claude/rules/*.md` 仍然是详细执行规范。如果详细规则与本 Constitution 冲突，以本
Constitution 为准，并必须更新详细规则或提出明确的 Constitution 修订。

修订 Constitution 时，必须说明变更原因、受影响系统、迁移要求、对模板和 Spec Kit 工作流的
影响，以及语义化版本变化。删除原则或以不兼容方式重新定义原则，必须提升 MAJOR 版本。新增
原则或显著扩展治理内容，必须提升 MINOR 版本。措辞澄清、错别字修复和不改变语义的说明优化，
提升 PATCH 版本。

新增架构决策应先记录到 ADR/FADR。只有稳定、全项目适用，并且会反复影响计划、评审、安全或
跨系统边界的决策，才应该提升到本 Constitution。

所有新的 feature plan、代码评审和实现任务都必须检查是否符合本 Constitution。评审者和 Agent
必须标记偏离项，并要求在继续执行非合规方案前补充 Complexity Tracking 说明。

**Version**: 1.0.0 | **Ratified**: 2026-05-24 | **Last Amended**: 2026-05-24
