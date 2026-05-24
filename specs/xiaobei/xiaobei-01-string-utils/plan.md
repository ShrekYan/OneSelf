# Implementation Plan: 小贝字符串工具函数

**Branch**: `001-xiaobei-string-utils` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/xiaobei/xiaobei-01-string-utils/spec.md`

## Summary

为 `apps/web` 前端工具层提供 6 个纯字符串处理入口：主工具 `trim`、`uppercase`、`lowercase`，以及行为一致的备份工具 `backupTrim`、`backupUppercase`、`backupLowercase`。实现范围限定在 `apps/web/src/utils`，不引入依赖、状态、存储、API 或副作用。本阶段已澄清不要求新增或运行单元测试，验证以契约核对、TypeScript 类型检查和 lint 为准。

## Technical Context

**Language/Version**: TypeScript 5.5.3（前端项目）

**Primary Dependencies**: 无新增运行时依赖；使用 JavaScript/TypeScript 原生字符串方法

**Storage**: N/A（纯字符串转换，无持久化）

**Testing**: 本阶段不要求新增或运行单元测试；验证以 TypeScript 类型检查、lint 和契约核对为准

**Target Platform**: 前端 H5 工程内通用工具层

**Project Type**: Monorepo 中的前端工具函数增强

**Performance Goals**: 单次字符串转换为同步轻量操作，不引入异步流程、网络访问或额外依赖

**Constraints**: 类型声明完整；保持纯函数；不修改调用方业务逻辑；不引入 `any`；不产生副作用；输入域限定为 `string`

**Scale/Scope**: 6 个字符串转换入口：3 个主工具能力与 3 个备份工具能力

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

当前 `.specify/memory/constitution.md` 仍为模板占位内容，未定义已批准的具体治理原则。此计划按项目已加载规范执行：

- TypeScript 严格类型：通过，所有函数均需显式参数与返回类型。
- 代码复用优先：通过，主工具复用 `apps/web/src/utils/string.ts` 作为主入口。
- 简单实现：通过，仅使用原生字符串方法，不引入依赖、状态、存储或 API。
- 安全边界：通过，不处理敏感信息，不读写 Token，不涉及外部输入副作用。
- 验证范围：通过，按澄清结果不新增或运行单元测试，仅执行类型检查、lint 与契约核对。

## Project Structure

### Documentation (this feature)

```text
specs/xiaobei/xiaobei-01-string-utils/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── string-utils.md
├── checklists/
│   └── requirements.md
├── tasks.md
└── spec.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   └── utils/
│       ├── string.ts           # 主字符串工具能力
│       └── string-backup.ts    # 备份字符串工具能力
└── package.json                # TypeScript/ESLint 脚本来源
```

**Structure Decision**: 本功能限定在 `apps/web/src/utils` 工具层内完成，不新增页面、组件、状态管理、API 或后端服务。主工具和备份工具分文件表达，便于区分主入口与备用入口，同时保持每个函数为独立纯函数。

## Complexity Tracking

无需要豁免的复杂度项。

## Phase 0: Research Summary

详见 [research.md](./research.md)。关键决策：

- 主工具能力优先复用现有 `apps/web/src/utils/string.ts`。
- 备份工具使用独立文件 `apps/web/src/utils/string-backup.ts`，并保持与主工具相同的输入输出契约。
- 输入范围限定为 `string`；非字符串输入不纳入当前计划。
- 本阶段不新增或运行单元测试，验证以契约核对、TypeScript 类型检查和 lint 为准。

## Phase 1: Design Summary

设计产物：

- [data-model.md](./data-model.md)：描述字符串输入、输出、主工具、备份工具的领域模型与规则。
- [contracts/string-utils.md](./contracts/string-utils.md)：定义 6 个工具入口的函数契约。
- [quickstart.md](./quickstart.md)：定义实现与验证入口。

## Constitution Check (Post-Design)

Phase 1 设计后复核通过：

- 未新增外部依赖或跨系统接口。
- 未引入存储、网络、权限、认证或敏感数据处理。
- 函数契约均保持显式输入输出类型。
- 设计范围仍限定在前端工具函数层，符合简单性与最小改动原则。
- 验证命令仅包含 `npm run lint` 与 `npx tsc --noEmit`，符合“去除单元测试”澄清结论。
