# Tasks: 数组工具

**所属 Feature**: 小贝工具库

**Stage ID**: 03-array-utils

**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

**Tests**: 不生成单元测试任务。验收以功能契约、类型声明、行为边界和本地 lint/typecheck 为准。

## Phase 1: Setup

- [ ] S03-T001 Create `apps/web/src/utils/array.ts` if it does not already exist

## Phase 2: Implementation

- [ ] S03-T002 Implement `unique(arr)` in `apps/web/src/utils/array.ts` using shallow uniqueness while preserving first occurrence order
- [ ] S03-T003 Implement `sort(arr)` in `apps/web/src/utils/array.ts` using default ascending behavior without mutating the input array
- [ ] S03-T004 Implement `filter(arr, fn)` in `apps/web/src/utils/array.ts` using a synchronous predicate without mutating the input array

## Phase 3: Validation

- [ ] S03-T005 Ensure `apps/web/src/utils/array.ts` exports only the three requested array utilities
- [ ] S03-T006 Verify `apps/web/src/utils/array.ts` includes explicit generic parameter and return types for all three array utilities
- [ ] S03-T007 Confirm `apps/web/src/utils/array.ts` does not introduce deep object uniqueness, complex comparators, multi-field sorting, async filtering, chaining, lazy evaluation, or stream processing
- [ ] S03-T008 Review `contract.md` against `apps/web/src/utils/array.ts` for contract alignment

## Dependencies

- Depends on global Foundational phase completion (T001-T006 in root tasks.md)

## Acceptance

Review `apps/web/src/utils/array.ts` and confirm it exports exactly `unique`, `sort`, and `filter` with explicit input and return types, matching `contract.md`.
