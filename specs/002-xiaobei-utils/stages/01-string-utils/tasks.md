# Tasks: 字符串工具

**所属 Feature**: 小贝工具库

**Stage ID**: 01-string-utils

**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

**Tests**: 不生成单元测试任务。验收以功能契约、类型声明、行为边界和本地 lint/typecheck 为准。

## Phase 1: Implementation

- [ ] S01-T001 Implement `trim(str)` in `apps/web/src/utils/string.ts` using native string trim semantics
- [ ] S01-T002 Implement `uppercase(str)` in `apps/web/src/utils/string.ts` using native uppercase semantics
- [ ] S01-T003 Implement `lowercase(str)` in `apps/web/src/utils/string.ts` using native lowercase semantics

## Phase 2: Validation

- [ ] S01-T004 Ensure `apps/web/src/utils/string.ts` exports only the three requested string utilities
- [ ] S01-T005 Verify `apps/web/src/utils/string.ts` includes explicit parameter and return types for all three string utilities
- [ ] S01-T006 Review `contract.md` against `apps/web/src/utils/string.ts` for contract alignment

## Dependencies

- Depends on global Foundational phase completion (T001-T006 in root tasks.md)

## Acceptance

Review `apps/web/src/utils/string.ts` and confirm it exports exactly `trim`, `uppercase`, and `lowercase` with explicit input and return types, matching `contract.md`.
