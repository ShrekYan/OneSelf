# Tasks: 小贝工具库

**Input**: Design documents from `/specs/002-xiaobei-utils/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, stages/, quickstart.md

**Tests**: 不生成单元测试任务。用户已澄清"去除单元测试"，当前验收以功能契约、类型声明、行为边界和本地 lint/typecheck 为准。

---

## Phase 1: Global Setup

**Purpose**: Confirm the existing frontend utils location and prevent accidental scope expansion.

- [ ] T001 Confirm global constraints in `specs/002-xiaobei-utils/spec.md`
- [ ] T002 Confirm target source directory `apps/web/src/utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared implementation rules that all stages must follow.

**CRITICAL**: No stage work should begin until this phase is complete.

- [ ] T003 Review TypeScript function style requirements in `.claude/rules/typescript-common.md`
- [ ] T004 Review code formatting requirements in `.claude/rules/code-format-common.md`
- [ ] T005 Confirm the three target source files are `apps/web/src/utils/string.ts`, `apps/web/src/utils/number.ts`, and `apps/web/src/utils/array.ts`
- [ ] T006 Confirm no external dependency is needed for string, number, or array utilities in `apps/web/package.json`

**Checkpoint**: Foundation ready - stage implementation can now begin.

---

## Phase 3: Stage Execution

**Purpose**: Execute each stage's tasks from their respective stage task files.

- [ ] T007 Execute Stage 01 tasks from `specs/002-xiaobei-utils/stages/01-string-utils/tasks.md`
- [ ] T008 Execute Stage 02 tasks from `specs/002-xiaobei-utils/stages/02-number-utils/tasks.md`
- [ ] T009 Execute Stage 03 tasks from `specs/002-xiaobei-utils/stages/03-array-utils/tasks.md`

---

## Phase 4: Final Validation

**Purpose**: Validate consistency across all utility groups and design artifacts.

- [ ] T010 Run `npm run lint` from `apps/web/` to validate frontend lint rules
- [ ] T011 Run `npx tsc --noEmit` from `apps/web/` to validate TypeScript types
- [ ] T012 Confirm no unit test files were added for this feature under `apps/web/src/utils/`
- [ ] T013 Confirm quickstart examples in `specs/002-xiaobei-utils/quickstart.md` match implemented exports and import paths

---

## Stage Task References

| Stage ID | Stage Name | Task File                                                          |
| -------- | ---------- | ------------------------------------------------------------------ |
| 01       | 字符串工具 | [stages/01-string-utils/tasks.md](stages/01-string-utils/tasks.md) |
| 02       | 数字工具   | [stages/02-number-utils/tasks.md](stages/02-number-utils/tasks.md) |
| 03       | 数组工具   | [stages/03-array-utils/tasks.md](stages/03-array-utils/tasks.md)   |

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks stage implementation
- **Stage Execution (Phase 3)**: Depends on Foundational completion
- **Final Validation (Phase 4)**: Depends on all stages being complete

### Stage Dependencies

- **Stage 01 - 字符串工具 (P1)**: No dependency on Stage 02 or Stage 03; recommended MVP
- **Stage 02 - 数字工具 (P2)**: No dependency on Stage 01 or Stage 03
- **Stage 03 - 数组工具 (P3)**: No dependency on Stage 01 or Stage 02

### Parallel Opportunities

- Stage 01, Stage 02, and Stage 03 can run in parallel after Phase 2 if different developers work on different files

---

## Notes

- This task list intentionally excludes unit test creation tasks per user clarification
- Each stage should be independently completable and reviewable
- Avoid adding utilities not declared in `specs/002-xiaobei-utils/spec.md`
