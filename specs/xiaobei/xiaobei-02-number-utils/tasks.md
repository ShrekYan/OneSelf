# Tasks: 小贝数字工具函数

**Input**: Design documents from `specs/xiaobei/xiaobei-02-number-utils/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/number-utils.md, quickstart.md

**Tests**: 用户明确要求不需要单元测试；本任务清单不生成测试任务，验证以契约核对、lint 和 TypeScript 类型检查为准。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 确认目标目录和现有工具文件，避免把数字工具放到错误层级。

- [x] T001 Verify `apps/web/src/utils/` exists and review existing utility style in `apps/web/src/utils/string.ts`
- [x] T002 Confirm no existing number utility entry conflicts with planned file `apps/web/src/utils/number.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 建立所有用户故事共享的数字工具文件，后续 US1/US2/US3 都在该文件内完成。

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Create shared number utility file `apps/web/src/utils/number.ts` with no exports yet
- [x] T004 Add file-level structure in `apps/web/src/utils/number.ts` consistent with existing utility files

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - 计算两个数字之和 (Priority: P1) MVP

**Goal**: 使用者能够传入两个数字并获得正确相加结果。

**Independent Test**: 手动核对 `add(1, 2) -> 3`、`add(-1, 2) -> 1`、`add(1.5, 2) -> 3.5`，并确认函数签名为 `(a: number, b: number) => number`。

### Implementation for User Story 1

- [x] T005 [US1] Implement exported `add(a: number, b: number): number` in `apps/web/src/utils/number.ts`
- [x] T006 [US1] Verify `add` contract examples from `specs/xiaobei/xiaobei-02-number-utils/contracts/number-utils.md` against `apps/web/src/utils/number.ts`

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - 计算两个数字之积 (Priority: P1)

**Goal**: 使用者能够传入两个数字并获得正确相乘结果。

**Independent Test**: 手动核对 `multiply(2, 3) -> 6`、`multiply(-2, 3) -> -6`、`multiply(0, 99) -> 0`，并确认函数签名为 `(a: number, b: number) => number`。

### Implementation for User Story 2

- [x] T007 [US2] Implement exported `multiply(a: number, b: number): number` in `apps/web/src/utils/number.ts`
- [x] T008 [US2] Verify `multiply` contract examples from `specs/xiaobei/xiaobei-02-number-utils/contracts/number-utils.md` against `apps/web/src/utils/number.ts`

**Checkpoint**: User Story 2 should be fully functional and testable independently.

---

## Phase 5: User Story 3 - 格式化数字显示 (Priority: P2)

**Goal**: 使用者能够传入数字并获得带千位分隔符且保留有效小数信息的字符串展示。

**Independent Test**: 手动核对 `formatNumber(123) -> "123"`、`formatNumber(12345) -> "12,345"`、`formatNumber(12345.67) -> "12,345.67"`、`formatNumber(-12345.67) -> "-12,345.67"`，并确认函数签名为 `(num: number) => string`。

### Implementation for User Story 3

- [x] T009 [US3] Implement exported `formatNumber(num: number): string` in `apps/web/src/utils/number.ts`
- [x] T010 [US3] Ensure `formatNumber` preserves decimal text and negative sign in `apps/web/src/utils/number.ts`
- [x] T011 [US3] Verify `formatNumber` contract examples from `specs/xiaobei/xiaobei-02-number-utils/contracts/number-utils.md` against `apps/web/src/utils/number.ts`

**Checkpoint**: User Story 3 should be fully functional and testable independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 对所有数字工具入口做最终契约核对和项目级验证。

- [x] T012 Verify all exported function signatures in `apps/web/src/utils/number.ts` match `specs/xiaobei/xiaobei-02-number-utils/contracts/number-utils.md`
- [x] T013 Run lint validation with `npm run lint` from `apps/web`
- [x] T014 Run TypeScript validation with `npx tsc --noEmit` from `apps/web`
- [x] T015 Confirm no unit test files were added for this feature under `apps/web/src` or `apps/web/tests`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories because they share `apps/web/src/utils/number.ts`.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; may be implemented after or alongside US1 if editing is coordinated.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; should avoid simultaneous edits to `apps/web/src/utils/number.ts` with US1/US2 unless merged carefully.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependency on other stories.
- **User Story 2 (P1)**: Can start after Foundational - no dependency on other stories.
- **User Story 3 (P2)**: Can start after Foundational - no dependency on US1/US2 behavior, but shares the same file.

### Within Each User Story

- Implement the exported function in `apps/web/src/utils/number.ts`.
- Contract-check the examples for that function.
- Complete the story checkpoint before proceeding to final validation.

### Parallel Opportunities

- T001 and T002 can be checked in parallel by separate agents because they are read-only inspections.
- US1, US2, and US3 are logically independent, but they all edit `apps/web/src/utils/number.ts`; parallel implementation requires coordination or separate patches to avoid file conflicts.
- T013 and T014 can be run independently after implementation is complete.

---

## Parallel Example: Read-Only Setup

```bash
Task: "Verify apps/web/src/utils/ exists and review existing utility style in apps/web/src/utils/string.ts"
Task: "Confirm no existing number utility entry conflicts with planned file apps/web/src/utils/number.ts"
```

## Parallel Example: Final Validation

```bash
Task: "Run lint validation with npm run lint from apps/web"
Task: "Run TypeScript validation with npx tsc --noEmit from apps/web"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1 (`add`).
4. Stop and validate `add` independently using the contract examples.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add User Story 1 (`add`) and validate independently.
3. Add User Story 2 (`multiply`) and validate independently.
4. Add User Story 3 (`formatNumber`) and validate independently.
5. Run final lint and TypeScript validation.

### Single-Agent Strategy

Because all implementation stories modify `apps/web/src/utils/number.ts`, a single agent should normally execute T003-T012 sequentially to avoid same-file merge conflicts. Read-only setup checks and final validation commands can still be handled independently.

---

## Notes

- No unit test tasks are included because the user explicitly stated “不需要单元测试”.
- All task descriptions include exact file paths or exact validation command context.
- User story labels are only used in user story phases.
- Each user story remains independently contract-checkable even though implementation shares one file.
