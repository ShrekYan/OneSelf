# Implementation Plan: 小贝数字工具函数

**Branch**: `xiaobei-02-number-utils` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/xiaobei/xiaobei-02-number-utils/spec.md`

## Summary

为 `apps/web` 前端工具层提供 3 个纯数字处理入口：`add`、`multiply`、`formatNumber`。实现范围限定在 `apps/web/src/utils`，不引入依赖、状态、存储、API 或副作用。本阶段用户已明确“不需要单元测试”，验证以契约核对、TypeScript 类型检查和 lint 为准。

## Technical Context

**Language/Version**: TypeScript 5.5.3（前端项目）

**Primary Dependencies**: 无新增运行时依赖；使用 JavaScript/TypeScript 原生数字运算与字符串格式化能力

**Storage**: N/A（纯数字计算与展示格式化，无持久化）

**Testing**: 本阶段不要求新增或运行单元测试；验证以 TypeScript 类型检查、lint 和契约核对为准

**Target Platform**: 前端 H5 工程内通用工具层

**Project Type**: Monorepo 中的前端工具函数增强

**Performance Goals**: 单次数字计算与格式化为同步轻量操作，不引入异步流程、网络访问或额外依赖

**Constraints**: 类型声明完整；保持纯函数；不修改调用方业务逻辑；不引入 `any`；不产生副作用；输入域限定为 `number`

**Scale/Scope**: 3 个数字工具入口：`add`、`multiply`、`formatNumber`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

当前 `.specify/memory/constitution.md` 仍为模板占位内容，未定义已批准的具体治理原则。此计划按项目已加载规范执行：

- TypeScript 严格类型：通过，所有函数均需显式参数与返回类型。
- 代码复用优先：通过，沿用 `apps/web/src/utils` 工具目录，不扩散到页面、组件或服务层。
- 简单实现：通过，仅使用原生数字运算和字符串处理能力，不引入依赖、状态、存储或 API。
- 安全边界：通过，不处理敏感信息，不读写 Token，不涉及外部输入副作用。
- 验证范围：通过，按用户要求不新增或运行单元测试，仅执行类型检查、lint 与契约核对。

## Project Structure

### Documentation (this feature)

```text
specs/xiaobei/xiaobei-02-number-utils/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── number-utils.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   └── utils/
│       ├── string.ts           # 既有字符串工具能力
│       ├── string-backup.ts    # 既有备份字符串工具能力
│       └── number.ts           # 新增数字工具能力
└── package.json                # TypeScript/ESLint 脚本来源
```

**Structure Decision**: 本功能限定在 `apps/web/src/utils` 工具层内完成，不新增页面、组件、状态管理、API 或后端服务。数字工具使用独立 `number.ts` 文件承载，避免与既有字符串工具混合，保持工具目录按能力类型分文件组织。

## Complexity Tracking

无需要豁免的复杂度项。

## Phase 0: Research Summary

详见 [research.md](./research.md)。关键决策：

- 数字工具新增在 `apps/web/src/utils/number.ts`。
- `add` 与 `multiply` 使用原生数字运算，不新增依赖或异步流程。
- `formatNumber` 使用常见逗号千位分隔展示，并保留有效小数信息。
- 输入范围限定为 `number`；字符串、空值或非数字值不纳入当前计划。
- 本阶段不新增或运行单元测试，验证以契约核对、TypeScript 类型检查和 lint 为准。

## Phase 1: Design Summary

设计产物：

- [data-model.md](./data-model.md)：描述数字输入、计算结果、格式化展示结果的领域模型与规则。
- [contracts/number-utils.md](./contracts/number-utils.md)：定义 3 个数字工具入口的函数契约。
- [quickstart.md](./quickstart.md)：定义实现与验证入口。

## Constitution Check (Post-Design)

Phase 1 设计后复核通过：

- 未新增外部依赖或跨系统接口。
- 未引入存储、网络、权限、认证或敏感数据处理。
- 函数契约均保持显式输入输出类型。
- 设计范围仍限定在前端工具函数层，符合简单性与最小改动原则。
- 验证命令仅包含 `npm run lint` 与 `npx tsc --noEmit`，符合“不需要单元测试”的明确要求。
