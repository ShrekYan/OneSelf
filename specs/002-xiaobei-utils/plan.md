# Implementation Plan: 小贝工具库

**Branch**: `[20260321-xiaobei-utils]` | **Date**: 2026-05-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-xiaobei-utils/spec.md`

**Planning Scope**: 当前计划完整覆盖同一个"小贝工具库" feature 下的三个阶段：字符串工具、数字工具、数组工具。三个阶段属于同一 feature，不拆分为独立 feature，也不创建外层项目目录。

## Summary

本轮计划在前端内部工具目录中交付小贝工具库的三组基础工具能力：

- 字符串工具覆盖 `trim()`、`uppercase()`、`lowercase()` 三个基础能力。
- 数字工具覆盖 `add(a, b)`、`multiply(a, b)`、`formatNumber(num)` 三个基础能力。
- 数组工具覆盖 `unique(arr)`、`sort(arr)`、`filter(arr, fn)` 三个基础能力。

三个工具集合均保持单一职责、显式类型声明和可预测行为，不扩展到来源需求之外的复杂能力。

## Technical Context

**Language/Version**: TypeScript 5.5.3

**Primary Dependencies**: 无新增外部依赖；使用 JavaScript 原生能力。

**Storage**: N/A

**Testing**: 不规划单元测试交付；用户已明确要求去除单元测试，当前验收以功能契约、类型声明和行为边界说明为准。

**Target Platform**: 前端 H5 应用内部工具库

**Project Type**: web-application 前端内部 utils 模块

**Performance Goals**: 单次工具调用应为同步轻量操作，对常规输入保持即时返回

**Constraints**: 仅交付指定的 9 个工具函数；不引入外部依赖；不加入复杂处理能力；不创建独立包、独立 feature 或外层项目目录。

**Scale/Scope**: 9 个工具函数；不包含单元测试交付规划；全部位于 `apps/web/src/utils` 范围内。

## Stage Index

| Stage ID | Stage Name | Priority | Stage Plan                                                       |
| -------- | ---------- | -------- | ---------------------------------------------------------------- |
| 01       | 字符串工具 | P1       | [stages/01-string-utils/plan.md](stages/01-string-utils/plan.md) |
| 02       | 数字工具   | P2       | [stages/02-number-utils/plan.md](stages/02-number-utils/plan.md) |
| 03       | 数组工具   | P3       | [stages/03-array-utils/plan.md](stages/03-array-utils/plan.md)   |

## Stage Execution Order

1. **Stage 01 - 字符串工具 (P1)**: 建议作为 MVP 首先交付
2. **Stage 02 - 数字工具 (P2)**: 可与 Stage 01 并行执行（不同文件）
3. **Stage 03 - 数组工具 (P3)**: 可与 Stage 01、Stage 02 并行执行（不同文件）

## Project Structure

### Documentation (this feature)

```text
specs/002-xiaobei-utils/
├── plan.md                 # 本文件，全局实现计划索引
├── research.md             # 全局研究索引
├── data-model.md           # 全局数据模型索引
├── quickstart.md           # 全局 quickstart 索引
├── contracts/              # 兼容旧路径，保留历史契约
│   ├── string-utils.md
│   ├── number-utils.md
│   └── array-utils.md
├── stages/                 # 阶段文档目录
│   ├── 01-string-utils/
│   ├── 02-number-utils/
│   └── 03-array-utils/
└── tasks.md                # 全局任务编排
```

### Source Code (repository root)

```text
apps/web/src/utils/
├── string.ts               # 字符串工具函数：trim / uppercase / lowercase
├── number.ts               # 数字工具函数：add / multiply / formatNumber
├── array.ts                # 数组工具函数：unique / sort / filter
├── security.ts             # 现有工具文件
└── secure-storage.ts       # 现有工具文件
```

**Structure Decision**: 采用前端现有 `apps/web/src/utils` 扁平工具模块结构。保留同一 feature 目录，不拆分为新的 Speckit feature。

## Constitution Check

当前 `.specify/memory/constitution.md` 仍为模板内容，未配置可执行的项目约束条款。因此本轮按项目现有通用规范执行：

- 单一职责：每个工具函数只处理一种明确能力。
- 最小范围：仅覆盖三个阶段中声明的 9 个工具。
- 类型完整：函数输入与输出需要具备明确类型声明。
- 验收方式：按用户澄清去除单元测试要求，以功能契约、类型声明和行为边界说明作为验收依据。
- 无新增依赖：避免为简单工具函数引入第三方库。
- 不创建额外目录：遵守用户要求，不创建外层项目目录或独立 feature。

**Gate Status**: PASS。无 constitution 违规项。

## Post-Design Constitution Check

三个阶段设计产物均遵守本轮约束：不引入新增依赖，不创建外层目录，不拆分 feature，不规划来源范围之外的工具能力。

**Gate Status**: PASS。

## Global Validation

- Run `npm run lint` from `apps/web/` to validate frontend lint rules
- Run `npx tsc --noEmit` from `apps/web/` to validate TypeScript types
- Confirm no unit test files were added for this feature under `apps/web/src/utils/`
