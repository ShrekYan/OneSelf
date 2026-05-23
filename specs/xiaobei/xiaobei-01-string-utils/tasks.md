# Tasks: 小贝字符串工具函数

**Input**: Design documents from `specs/xiaobei/xiaobei-01-string-utils/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 已明确去除单元测试要求；本任务清单不包含新增或运行单元测试任务。验证以契约核对、TypeScript 类型检查和 lint 为准。

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 确认当前前端工具目录、契约文件和验证范围，为后续实现提供稳定上下文。

- [x] T001 Review existing primary string utility exports in apps/web/src/utils/string.ts
- [x] T002 [P] Review string utility contract requirements in specs/xiaobei/xiaobei-01-string-utils/contracts/string-utils.md
- [x] T003 [P] Review quickstart validation commands in specs/xiaobei/xiaobei-01-string-utils/quickstart.md
- [x] T004 [P] Confirm no unit test task is required per specs/xiaobei/xiaobei-01-string-utils/spec.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 完成所有用户故事共享的实现边界确认，避免主工具和备份工具契约不一致。

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Confirm primary and backup utility naming contract in specs/xiaobei/xiaobei-01-string-utils/contracts/string-utils.md
- [x] T006 Confirm target source files from plan structure in specs/xiaobei/xiaobei-01-string-utils/plan.md
- [x] T007 Confirm TypeScript string-only input scope in specs/xiaobei/xiaobei-01-string-utils/data-model.md

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - 使用基础字符串处理能力 (Priority: P1) MVP

**Goal**: 提供主字符串工具能力：去除首尾空白、转大写、转小写。

**Independent Validation**: 使用普通字符串、首尾空白字符串、大小写混合字符串进行契约核对，确认主工具输出符合 `trim`、`uppercase`、`lowercase` 预期；不新增或运行单元测试。

### Implementation for User Story 1

- [x] T008 [US1] Update primary trim signature and behavior in apps/web/src/utils/string.ts
- [x] T009 [US1] Update primary uppercase signature and behavior in apps/web/src/utils/string.ts
- [x] T010 [US1] Update primary lowercase signature and behavior in apps/web/src/utils/string.ts
- [x] T011 [US1] Ensure primary string utilities have explicit exported function return types in apps/web/src/utils/string.ts

**Checkpoint**: User Story 1 should be independently usable through `apps/web/src/utils/string.ts`.

---

## Phase 4: User Story 2 - 使用备份字符串处理能力 (Priority: P2)

**Goal**: 提供备份字符串工具能力，并保证与主字符串工具能力行为一致。

**Independent Validation**: 使用与主工具相同的输入集合进行契约核对，确认备份工具与主工具在同类转换中返回一致结果；不新增或运行单元测试。

### Implementation for User Story 2

- [x] T012 [P] [US2] Create backup string utility file in apps/web/src/utils/string-backup.ts
- [x] T013 [US2] Implement backupTrim with explicit string input and string output in apps/web/src/utils/string-backup.ts
- [x] T014 [US2] Implement backupUppercase with explicit string input and string output in apps/web/src/utils/string-backup.ts
- [x] T015 [US2] Implement backupLowercase with explicit string input and string output in apps/web/src/utils/string-backup.ts
- [x] T016 [US2] Ensure backup utilities mirror primary utility behavior in apps/web/src/utils/string-backup.ts

**Checkpoint**: User Story 1 and User Story 2 should both be independently usable and behaviorally aligned.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 完成类型、格式、契约一致性和验证。

- [x] T017 [P] Compare implemented primary utility names against specs/xiaobei/xiaobei-01-string-utils/contracts/string-utils.md
- [x] T018 [P] Compare implemented backup utility names against specs/xiaobei/xiaobei-01-string-utils/contracts/string-utils.md
- [x] T019 Run TypeScript check from apps/web with npx tsc --noEmit
- [x] T020 Run lint check from apps/web with npm run lint
- [x] T021 Confirm quickstart validation excludes unit tests in specs/xiaobei/xiaobei-01-string-utils/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP scope.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; may run after US1 for easier behavior comparison.
- **Polish (Phase 5)**: Depends on selected user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational phase; no dependency on User Story 2.
- **User Story 2 (P2)**: Can start after Foundational phase; should compare against User Story 1 behavior before final validation.

### Within Each User Story

- Review contract before implementation.
- Implement exported functions before validation.
- Complete story checkpoint before moving to the next priority if working sequentially.
- Do not add or run unit tests for this stage.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001.
- T012 can run in parallel with US1 implementation because it creates a different file.
- T017 and T018 can run in parallel after US1 and US2 implementation.

---

## Parallel Example: User Story 2

```bash
Task: "Create backup string utility file in apps/web/src/utils/string-backup.ts"
```

After `apps/web/src/utils/string-backup.ts` exists, T013-T016 should be completed sequentially in the same file to avoid edit conflicts.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate main `trim` / `uppercase` / `lowercase` behavior by contract review, TypeScript check, and lint.

### Incremental Delivery

1. Deliver primary string utilities first as MVP.
2. Add backup string utilities as a second increment.
3. Run TypeScript and lint validation after implementation.

### Notes

- [P] tasks target different files or read-only checks and can run in parallel.
- [US1] tasks map to primary string utilities.
- [US2] tasks map to backup string utilities.
- All implementation tasks include exact file paths.
- Do not add dependencies, storage, API calls, side effects, or unit tests for this feature.
