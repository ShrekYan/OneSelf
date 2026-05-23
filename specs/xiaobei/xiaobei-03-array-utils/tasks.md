# Tasks: 小贝数组工具函数

**Input**: Design documents from `specs/xiaobei/xiaobei-03-array-utils/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 本 feature 明确要求“不添加单元测试”，因此不生成单元测试任务；验证以契约核对、lint 和 TypeScript 类型检查为准。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- 前端工具函数位于 `apps/web/src/utils/`
- 本 feature 目标文件为 `apps/web/src/utils/array.ts`
- 规格与计划文档位于 `specs/xiaobei/xiaobei-03-array-utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 确认实现位置、契约和约束，避免误建测试或放错目录。

- [x] T001 核对 `specs/xiaobei/xiaobei-03-array-utils/contracts/array-utils.md` 中 `unique`、`sort`、`filter` 的函数签名和行为约束
- [x] T002 核对 `apps/web/src/utils/string.ts` 与 `apps/web/src/utils/number.ts` 的现有工具函数风格，确保 `apps/web/src/utils/array.ts` 命名与导出方式保持一致

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 创建所有用户故事共用的数组工具文件和基础类型边界。

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 在 `apps/web/src/utils/array.ts` 中创建数组工具文件，并预留 `unique`、`sort`、`filter` 三个导出函数入口
- [x] T004 在 `apps/web/src/utils/array.ts` 中为三个导出函数声明显式参数类型与返回类型，使用泛型或具体联合类型，避免使用 `any`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 数组去重 (Priority: P1) MVP

**Goal**: 开发者可以调用 `unique(arr)` 获取去重后的新数组。

**Independent Test**: 通过契约核对确认 `unique([1, 1, 2])` 预期为 `[1, 2]`，`unique([])` 预期为 `[]`，且输入数组不被修改。

### Implementation for User Story 1

- [x] T005 [US1] 在 `apps/web/src/utils/array.ts` 中实现 `unique<T>(arr: readonly T[]): T[]`，使用标准值身份去重并保留首次出现顺序
- [x] T006 [US1] 在 `apps/web/src/utils/array.ts` 中核对 `unique` 对空数组、单元素数组、无重复数组的返回结果均符合 `contracts/array-utils.md`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 数组排序 (Priority: P2)

**Goal**: 开发者可以调用 `sort(arr)` 获取排序后的新数组。

**Independent Test**: 通过契约核对确认 `sort([3, 1, 2])` 预期为 `[1, 2, 3]`，`sort(['b', 'a', 'c'])` 预期为 `['a', 'b', 'c']`，且输入数组不被修改。

### Implementation for User Story 2

- [x] T007 [US2] 在 `apps/web/src/utils/array.ts` 中实现 `sort<T extends number | string>(arr: readonly T[]): T[]`，返回新数组并支持数字升序与字符串默认字典顺序
- [x] T008 [US2] 在 `apps/web/src/utils/array.ts` 中核对 `sort` 对空数组、已排序数组、数字数组、字符串数组的返回结果均符合 `contracts/array-utils.md`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 数组过滤 (Priority: P3)

**Goal**: 开发者可以调用 `filter(arr, fn)` 获取满足条件的新数组。

**Independent Test**: 通过契约核对确认 `filter([1, 2, 3], (item) => item > 1)` 预期为 `[2, 3]`，条件全部为 false 时返回 `[]`，且输入数组不被修改。

### Implementation for User Story 3

- [x] T009 [US3] 在 `apps/web/src/utils/array.ts` 中实现 `filter<T>(arr: readonly T[], fn: (item: T) => boolean): T[]`，按输入顺序保留满足同步布尔条件的元素
- [x] T010 [US3] 在 `apps/web/src/utils/array.ts` 中核对 `filter` 对空数组、全部命中、部分命中、全部不命中的返回结果均符合 `contracts/array-utils.md`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 覆盖所有用户故事的质量检查与最终约束确认。

- [x] T011 核对 `apps/web/src/utils/array.ts` 中三个函数均不修改输入数组、不引入副作用、不新增运行时依赖
- [x] T012 核对 `apps/web/src/utils/array.ts` 中没有 `any`、没有无用注释、没有调试输出，并符合当前工具文件代码风格
- [x] T013 在 `apps/web` 目录执行 `npm run lint` 验证数组工具代码风格与 lint 规则
- [x] T014 在 `apps/web` 目录执行 `npx tsc --noEmit` 验证数组工具类型声明完整且类型检查通过
- [x] T015 核对本 feature 未新增任何单元测试文件或单元测试用例，确保符合 `specs/xiaobei/xiaobei-03-array-utils/spec.md` 的 FR-007 与 SC-004

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order: US1 → US2 → US3
  - 由于三个故事修改同一个文件 `apps/web/src/utils/array.ts`，不建议并行写同一文件
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No functional dependency on US1, but same文件修改建议按优先级顺序执行
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No functional dependency on US1/US2, but same文件修改建议按优先级顺序执行

### Within Each User Story

- 本 feature 不创建测试任务
- 先实现函数签名与核心逻辑
- 再按契约核对边界场景
- 每个故事完成后可独立检查对应函数行为

### Parallel Opportunities

- 本 feature 的核心实现集中在 `apps/web/src/utils/array.ts`，同文件写入存在冲突，因此实现任务不标记 `[P]`
- 可并行进行的工作主要是人工/LLM 阅读类核对，但为保持任务可执行性和避免同文件冲突，任务列表按顺序组织
- lint 与 TypeScript 检查应在所有实现任务完成后执行

---

## Parallel Example: User Story 1

```bash
# 本 feature 的实现集中在同一个文件，不建议并行修改。
# 建议顺序执行：
Task: "T005 在 apps/web/src/utils/array.ts 中实现 unique<T>(arr: readonly T[]): T[]"
Task: "T006 在 apps/web/src/utils/array.ts 中核对 unique 的边界场景"
```

## Parallel Example: User Story 2

```bash
# 本 feature 的实现集中在同一个文件，不建议并行修改。
# 建议顺序执行：
Task: "T007 在 apps/web/src/utils/array.ts 中实现 sort<T extends number | string>(arr: readonly T[]): T[]"
Task: "T008 在 apps/web/src/utils/array.ts 中核对 sort 的边界场景"
```

## Parallel Example: User Story 3

```bash
# 本 feature 的实现集中在同一个文件，不建议并行修改。
# 建议顺序执行：
Task: "T009 在 apps/web/src/utils/array.ts 中实现 filter<T>(arr: readonly T[], fn: (item: T) => boolean): T[]"
Task: "T010 在 apps/web/src/utils/array.ts 中核对 filter 的边界场景"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. STOP and VALIDATE: 按契约独立核对 `unique` 行为
5. 若只需要 MVP，可先交付 `unique`

### Incremental Delivery

1. Complete Setup + Foundational → 基础文件和类型边界就绪
2. Add User Story 1 → 独立核对 `unique` → MVP
3. Add User Story 2 → 独立核对 `sort`
4. Add User Story 3 → 独立核对 `filter`
5. Run lint + TypeScript checks → 最终验证

### Parallel Team Strategy

由于核心实现集中在 `apps/web/src/utils/array.ts`，建议单人或单 Agent 顺序完成实现，避免同文件冲突。若多人协作，可将契约核对和最终检查分离，但代码写入仍应按任务顺序合并。

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- 本 feature 不新增单元测试任务
- 避免引入依赖、状态、网络请求、存储或副作用
- 避免修改 `apps/web/src/utils/string.ts` 和 `apps/web/src/utils/number.ts`
