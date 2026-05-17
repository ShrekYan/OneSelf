# Tasks: 前端字符串工具函数

**Input**: Design documents from `specs/001-string-utils/`

**Prerequisites**: plan.md, spec.md, data-model.md

**Tests**: 无（已通过 clarify 确认不编写单元测试）

**Organization**: 任务按用户故事分组。所有函数位于同一文件，可在同一 phase 内完成。

---

## Phase 1: User Story 1 - 去除字符串首尾空格 (Priority: P1) 🎯 MVP

**Goal**: 实现 `trim` 函数，支持 `string | null | undefined` 输入，返回去除首尾空白后的字符串

**Independent Test**: 在 IDE 中导入并调用 `trim('  hello  ')`，验证返回 `'hello'`；调用 `trim(null)` 验证返回 `''`

### Implementation for User Story 1

- [x] T001 [US1] 实现 `trim` 函数于 `apps/web/src/utils/string.ts`

**Checkpoint**: `trim` 函数可在 IDE 中直接导入使用，传入 `null`/`undefined` 安全返回 `''`

---

## Phase 2: User Story 2 - 字符串转为大写 (Priority: P1)

**Goal**: 实现 `uppercase` 函数，支持 `string | null | undefined` 输入，返回全大写字符串

**Independent Test**: 在 IDE 中导入并调用 `uppercase('abc')`，验证返回 `'ABC'`；调用 `uppercase(null)` 验证返回 `''`

### Implementation for User Story 2

- [x] T002 [US2] 实现 `uppercase` 函数于 `apps/web/src/utils/string.ts`

**Checkpoint**: `uppercase` 函数可独立使用，不依赖其他故事完成

---

## Phase 3: User Story 3 - 字符串转为小写 (Priority: P1)

**Goal**: 实现 `lowercase` 函数，支持 `string | null | undefined` 输入，返回全小写字符串

**Independent Test**: 在 IDE 中导入并调用 `lowercase('ABC')`，验证返回 `'abc'`；调用 `lowercase(null)` 验证返回 `''`

### Implementation for User Story 3

- [x] T003 [US3] 实现 `lowercase` 函数于 `apps/web/src/utils/string.ts`

**Checkpoint**: `lowercase` 函数可独立使用，不依赖其他故事完成

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: 代码风格一致性检查

- [x] T004 确保 `apps/web/src/utils/string.ts` 中所有函数包含完整 JSDoc 注释
- [x] T005 确保导入排序遵循项目规范（`@/` 别名）

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1 (Phase 1)**: 可直接开始，创建 `string.ts` 文件并实现 `trim`
- **User Story 2 (Phase 2)**: 可在 Phase 1 后或并行进行（同一文件追加函数）
- **User Story 3 (Phase 3)**: 可在 Phase 2 后或并行进行（同一文件追加函数）
- **Polish (Phase 4)**: 所有函数实现完成后执行

### User Story Dependencies

- 三个用户故事之间**无依赖**，可独立实现
- 由于所有函数位于同一文件 `string.ts`，实际操作中按顺序追加更稳妥

### Within Each User Story

- 每个用户故事仅一个实现任务
- 空值安全处理（`str ?? ''`）与函数逻辑在同一任务内完成

### Parallel Opportunities

- 理论上三个函数实现可并行（不同文件时）
- 实际位于同一文件，建议顺序执行 T001 → T002 → T003

---

## Parallel Example: 单文件追加

```typescript
// T001: 在 apps/web/src/utils/string.ts 中添加 trim
export function trim(str: string | null | undefined): string {
  return (str ?? '').trim();
}

// T002: 在同一文件中追加 uppercase
export function uppercase(str: string | null | undefined): string {
  return (str ?? '').toUpperCase();
}

// T003: 在同一文件中追加 lowercase
export function lowercase(str: string | null | undefined): string {
  return (str ?? '').toLowerCase();
}
```

---

## Implementation Strategy

### MVP First (T001 即 MVP)

1. T001: 创建 `string.ts` 并实现 `trim` → 立即可用
2. T002: 追加 `uppercase` → 立即可用
3. T003: 追加 `lowercase` → 立即可用
4. T004 + T005: 格式和注释检查

### 增量交付

- 每完成一个函数，文件即可被其他模块导入使用
- 不需要等待所有任务完成才可用

---

## Notes

- 所有任务操作同一文件 `apps/web/src/utils/string.ts`
- 每个函数需包含：JSDoc 注释、显式类型声明、空值安全处理 `(str ?? '')`
- 导出方式为命名导出：`export function`
- 本特性无单元测试，验收标准为代码实现正确
