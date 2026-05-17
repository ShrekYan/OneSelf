# Implementation Plan: 前端字符串工具函数

**Branch**: `[20260320-string-utils]` | **Date**: 2026-05-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-string-utils/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

在 `apps/web/src/utils` 目录下新增 `string.ts` 模块，提供 3 个纯 TypeScript 字符串工具函数：`trim`、`uppercase`、`lowercase`。所有函数均为纯函数，具备完整类型声明，采用命名导出方式，与现有 utils 模块风格保持一致。

**关键设计点**：函数参数类型为 `string | null | undefined`，内部做空值安全处理——传入 `null` 或 `undefined` 时返回空字符串 `''`，避免调用方因空值导致运行时异常。

本特性**不包含单元测试**，无额外验收步骤。

## Technical Context

**Language/Version**: TypeScript 5.5.3

**Primary Dependencies**: 无外部依赖，仅使用 JavaScript 原生 `String.prototype` 方法

**Storage**: N/A

**Testing**: 无单元测试（已通过 `/speckit-clarify` 确认）。无额外验收步骤。

**Target Platform**: 浏览器环境（H5 移动端）

**Project Type**: web-application 前端内部工具库

**Performance Goals**: 单次调用耗时 < 1ms（纯字符串操作，无 I/O）

**Constraints**: 纯函数无副作用；参数类型为 `string | null | undefined`，函数内部对 `null`/`undefined` 做安全处理返回 `''`

**Scale/Scope**: 3 个函数，约 30 行实现代码（含空值安全检查），无测试代码

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution 文件为初始模板，未配置具体约束。本特性满足以下通用原则：

- 单一职责：每个函数只做一件事
- 纯函数：无副作用，输入相同则输出相同
- 自包含：不依赖外部状态或全局变量
- 防御式编程：对 `null`/`undefined` 做安全处理，提升调用方体验

**结论**: Constitution Check 通过，无违规项。

## Project Structure

### Documentation (this feature)

```text
specs/001-string-utils/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # N/A - 无外部接口
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
apps/web/src/utils/
├── string.ts            # 新增：字符串工具函数模块
├── security.ts          # 现有
├── secure-storage.ts    # 现有
└── __tests__/           # 现有测试目录，本次不新增
    ├── ...
```

**Structure Decision**: 采用前端项目内部 utils 模块扩展方式，与现有 `security.ts`、`secure-storage.ts` 并列。仅新增 `string.ts` 一个实现文件，不创建测试文件。保持扁平化目录结构。

## Complexity Tracking

> 本特性为极简单工具函数实现，无复杂度违规项，无需填写。
