# Implementation Plan: 小贝数组工具函数

**Branch**: `xiaobei-03-array-utils` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/xiaobei/xiaobei-03-array-utils/spec.md`

## Summary

为 `apps/web` 前端工具层提供 3 个纯数组处理入口：`unique`、`sort`、`filter`。实现范围限定在 `apps/web/src/utils`，不引入依赖、状态、存储、API 或副作用。用户已明确“不要添加单元测试”，验证以契约核对、TypeScript 类型检查和 lint 为准。

## Technical Context

**Language/Version**: TypeScript 5.5.3（前端项目）

**Primary Dependencies**: 无新增运行时依赖；使用 JavaScript/TypeScript 原生数组处理能力

**Storage**: N/A（纯数组处理，无持久化）

**Testing**: 本阶段不要求新增或运行单元测试；验证以 TypeScript 类型检查、lint 和契约核对为准

**Target Platform**: 前端 H5 工程内通用工具层

**Project Type**: Monorepo 中的前端工具函数增强

**Performance Goals**: 单次数组处理为同步轻量操作，不引入异步流程、网络访问或额外依赖

**Constraints**: 类型声明完整；保持纯函数；不修改输入数组；不修改调用方业务逻辑；不引入 `any`；不产生副作用；排序范围限定为数字数组或字符串数组

**Scale/Scope**: 3 个数组工具入口：`unique`、`sort`、`filter`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

当前 `.specify/memory/constitution.md` 仍为模板占位内容，未定义已批准的具体治理原则。此计划按项目已加载规范执行：

- TypeScript 严格类型：通过，所有函数均需显式参数与返回类型。
- 代码复用优先：通过，沿用 `apps/web/src/utils` 工具目录，不扩散到页面、组件或服务层。
- 简单实现：通过，仅使用原生数组能力，不引入依赖、状态、存储或 API。
- 安全边界：通过，不处理敏感信息，不读写 Token，不涉及外部输入副作用。
- 验证范围：通过，按用户要求不新增或运行单元测试，仅执行类型检查、lint 与契约核对。

## Project Structure

### Documentation (this feature)

```text
specs/xiaobei/xiaobei-03-array-utils/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── array-utils.md
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
│       ├── number.ts           # 既有数字工具能力
│       └── array.ts            # 新增数组工具能力
└── package.json                # TypeScript/ESLint 脚本来源
```

**Structure Decision**: 本功能限定在 `apps/web/src/utils` 工具层内完成，不新增页面、组件、状态管理、API 或后端服务。数组工具使用独立 `array.ts` 文件承载，避免与既有字符串、数字工具混合，保持工具目录按能力类型分文件组织。

## Complexity Tracking

无需豁免的复杂度项。

## Phase 0: Research Summary

详见 [research.md](./research.md)。关键决策：

- 数组工具新增在 `apps/web/src/utils/array.ts`。
- `unique` 基于标准值身份去重，保持首次出现顺序，不支持对象深度去重。
- `sort` 返回排序后的新数组，数字数组按数字升序，字符串数组按默认字典顺序。
- `filter` 接收同步布尔条件函数，返回满足条件的新数组。
- 所有函数均不修改输入数组，不引入依赖或异步流程。
- 本阶段不新增或运行单元测试，验证以契约核对、TypeScript 类型检查和 lint 为准。

## Phase 1: Design Summary

设计产物：

- [data-model.md](./data-model.md)：描述数组输入、去重结果、排序结果、过滤条件、过滤结果的领域模型与规则。
- [contracts/array-utils.md](./contracts/array-utils.md)：定义 3 个数组工具入口的函数契约。
- [quickstart.md](./quickstart.md)：定义实现与验证入口。

## Constitution Check (Post-Design)

Phase 1 设计后复核通过：

- 未新增外部依赖或跨系统接口。
- 未引入存储、网络、权限、认证或敏感数据处理。
- 函数契约均保持显式输入输出类型，不使用 `any`。
- 设计范围仍限定在前端工具函数层，符合简单性与最小改动原则。
- 验证命令仅包含 `npm run lint` 与 `npx tsc --noEmit`，符合“不要添加单元测试”的明确要求。
