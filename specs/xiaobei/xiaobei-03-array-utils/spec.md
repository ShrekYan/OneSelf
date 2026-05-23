# Feature Specification: 小贝数组工具函数

**Feature Branch**: `xiaobei-03-array-utils`

**Created**: 2026-05-23

**Status**: Draft

**Input**: User description: "小贝项目 - 任务3：数组工具函数。实现 3 个简单的数组工具函数：unique(arr) - 数组去重；sort(arr) - 数组排序；filter(arr, fn) - 数组过滤。质量标准：类型声明完整。执行模式：plan-only。不要添加单元测试。"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - 数组去重 (Priority: P1)

作为项目开发者，我需要对数组中的重复元素进行去重，以便在展示列表、处理选项或整理数据时得到唯一值集合。

**Why this priority**: 去重是最基础的数组工具能力，能够直接提升数据处理复用性，是本功能的核心价值之一。

**Independent Test**: 可通过输入包含重复项的数组并检查输出是否只保留唯一值来独立验证，且不依赖排序或过滤能力。

**Acceptance Scenarios**:

1. **Given** 一个包含重复基础值的数组，**When** 开发者执行去重操作，**Then** 返回结果中每个值只出现一次。
2. **Given** 一个空数组，**When** 开发者执行去重操作，**Then** 返回空数组。
3. **Given** 一个本身没有重复项的数组，**When** 开发者执行去重操作，**Then** 返回结果包含原有全部元素且无额外元素。

---

### User Story 2 - 数组排序 (Priority: P2)

作为项目开发者，我需要对数组进行排序，以便在列表展示或数据处理前得到稳定、可预期的顺序。

**Why this priority**: 排序是常见数据整理能力，优先级低于去重但同样属于数组工具的主要需求。

**Independent Test**: 可通过输入无序数组并检查输出是否按预期顺序排列来独立验证，且不依赖去重或过滤能力。

**Acceptance Scenarios**:

1. **Given** 一个包含数字的无序数组，**When** 开发者执行排序操作，**Then** 返回结果按数字升序排列。
2. **Given** 一个包含字符串的无序数组，**When** 开发者执行排序操作，**Then** 返回结果按默认字典顺序排列。
3. **Given** 一个空数组，**When** 开发者执行排序操作，**Then** 返回空数组。

---

### User Story 3 - 数组过滤 (Priority: P3)

作为项目开发者，我需要按指定条件过滤数组，以便只保留满足业务条件的数据项。

**Why this priority**: 过滤能力依赖调用方提供条件函数，属于常用但相对可组合的数组处理能力。

**Independent Test**: 可通过输入数组与过滤条件，并检查输出是否仅包含满足条件的元素来独立验证。

**Acceptance Scenarios**:

1. **Given** 一个数组和一个返回布尔结果的过滤条件，**When** 开发者执行过滤操作，**Then** 返回结果只包含满足条件的元素。
2. **Given** 一个数组且没有元素满足过滤条件，**When** 开发者执行过滤操作，**Then** 返回空数组。
3. **Given** 一个空数组和任意有效过滤条件，**When** 开发者执行过滤操作，**Then** 返回空数组。

---

### Edge Cases

- 当输入为空数组时，三个工具函数都应返回空数组。
- 当输入数组只有一个元素时，去重、排序、过滤应保持可预期结果。
- 当数组包含重复的基础类型值时，去重应按值识别重复项。
- 当过滤条件对所有元素返回 false 时，过滤结果应为空数组。
- 当排序输入已经有序时，排序结果应保持同样的顺序内容。

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide an array uniqueness capability that returns a collection with duplicate values removed.
- **FR-002**: System MUST provide an array sorting capability that returns values in a predictable ascending/default order.
- **FR-003**: System MUST provide an array filtering capability that keeps only elements matching a caller-provided condition.
- **FR-004**: System MUST support empty-array input for all three capabilities without producing errors.
- **FR-005**: System MUST preserve type information so developers can use the returned values consistently with the input element type.
- **FR-006**: System MUST keep the scope limited to the three requested utility capabilities: uniqueness, sorting, and filtering.
- **FR-007**: System MUST exclude new unit test creation from this feature because the user explicitly requested not to add unit tests.

### Key Entities _(include if feature involves data)_

- **Array Input**: A collection of values supplied by a developer for processing.
- **Filter Condition**: A caller-provided rule that evaluates each array element and determines whether it should remain in the result.
- **Array Result**: The processed collection returned after applying uniqueness, sorting, or filtering.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Developers can use exactly 3 array utility capabilities for uniqueness, sorting, and filtering.
- **SC-002**: 100% of the requested utilities provide complete type declarations for inputs and outputs.
- **SC-003**: For common empty-array and single-item inputs, each utility returns a valid result without errors.
- **SC-004**: The feature remains within the requested scope and adds 0 new unit test files or unit test cases.

## Assumptions

- Array utilities are intended for project developer use rather than direct end-user interaction.
- Equality for uniqueness is based on standard value identity suitable for simple arrays.
- Sorting uses a default ascending behavior appropriate for common simple arrays.
- Filtering uses a developer-supplied condition function that returns whether each item should be kept.
- This specification defines the desired behavior only; detailed implementation steps belong to the planning phase.
