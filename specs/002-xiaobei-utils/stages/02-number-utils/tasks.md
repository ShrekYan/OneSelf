# Tasks: 数字工具

**所属 Feature**: 小贝工具库

**Stage ID**: 02-number-utils

**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

**Tests**: 不生成单元测试任务。验收以功能契约、类型声明、行为边界和本地 lint/typecheck 为准。

## Phase 1: Setup

- [ ] S02-T001 Create `apps/web/src/utils/number.ts` if it does not already exist

## Phase 2: Implementation

- [ ] S02-T002 Implement `add(a, b)` in `apps/web/src/utils/number.ts` using native number addition semantics
- [ ] S02-T003 Implement `multiply(a, b)` in `apps/web/src/utils/number.ts` using native number multiplication semantics
- [ ] S02-T004 Implement `formatNumber(num)` in `apps/web/src/utils/number.ts` using a simple predictable thousands-separator display string

## Phase 3: Validation

- [ ] S02-T005 Ensure `apps/web/src/utils/number.ts` exports only the three requested number utilities
- [ ] S02-T006 Verify `apps/web/src/utils/number.ts` includes explicit parameter and return types for all three number utilities
- [ ] S02-T007 Confirm `apps/web/src/utils/number.ts` does not introduce complex math, financial precision, localization, currency, percentage, or big-number behavior
- [ ] S02-T008 Review `contract.md` against `apps/web/src/utils/number.ts` for contract alignment

## Dependencies

- Depends on global Foundational phase completion (T001-T006 in root tasks.md)

## Acceptance

Review `apps/web/src/utils/number.ts` and confirm it exports exactly `add`, `multiply`, and `formatNumber` with explicit input and return types, matching `contract.md`.
