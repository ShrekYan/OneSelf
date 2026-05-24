# Spec Kit 中 Feature、User Story、Requirements、Tasks 的关系说明

## 背景

在阅读 Spec Kit 生成的 feature 文档时，经常会看到这样的结构：

```text
一个 Feature
  包含多个 User Story

一个 User Story
  对应多个 Functional Requirements

一个 Functional Requirement
  又会拆成多个 Tasks
```

对于新手来说，这很容易产生困惑：

- 为什么一个 User Story 不是只对应一个功能？
- 为什么一个需求又会拆成很多任务？
- `spec.md` 里的需求和 `tasks.md` 里的任务到底有什么区别？

核心结论：

> **Feature 是功能范围，User Story 是用户目标，Functional Requirements 是系统能力，Tasks 是开发执行步骤。它们不是一一对应关系，而是从大到小逐层拆解的关系。**

---

## 一句话理解

```text
Feature：我要做哪一类功能？
User Story：用户想完成什么目标？
Functional Requirements：系统必须具备哪些能力？
Tasks：开发者具体要改哪些文件、写哪些代码、跑哪些测试？
```

也可以简单记成：

```text
Feature 管范围
User Story 管目标
Requirements 管能力
Tasks 管执行
```

---

## 1. Feature：最大的功能范围

**Feature 表示一个完整的功能主题或功能集合。**

例如：

```text
Feature: 小贝字符串工具函数
```

这个 feature 可能包含多个具体能力：

- 判断字符串是否为空。
- 字符串首字母大写。
- 去除字符串首尾空格。
- 字符串截断。
- 判断字符串是否符合邮箱格式。

所以，Feature 通常不是一个小函数，而是一组相关功能的集合。

---

## 2. User Story：用户视角的使用目标

**User Story 表示用户想完成什么事情。**

常见格式是：

```text
作为一个用户，我希望能够 xxx，以便 xxx。
```

例如：

```text
作为开发者，我希望能够使用字符串工具函数处理常见字符串场景，以便减少重复代码。
```

这里描述的是用户目标，而不是具体代码实现。

需要注意：

> **一个 User Story 不一定只对应一个小功能。**

因为一个用户目标往往需要多个系统能力共同支撑。

---

## 3. Functional Requirements：系统必须提供的具体能力

**Functional Requirements 表示系统必须具备哪些功能能力。**

继续以上面的 User Story 为例：

```text
作为开发者，我希望能够使用字符串工具函数处理常见字符串场景，以便减少重复代码。
```

它可能拆成多个 Functional Requirements：

```text
FR-001：系统必须提供 isEmpty 方法，用于判断字符串是否为空。
FR-002：系统必须提供 capitalize 方法，用于字符串首字母大写。
FR-003：系统必须提供 truncate 方法，用于字符串截断。
FR-004：系统必须正确处理 null、undefined、空字符串等边界情况。
FR-005：系统必须为工具函数提供单元测试覆盖。
```

所以，一个 User Story 对应多个 Functional Requirements 是正常的。

因为 User Story 讲的是用户目标，而 Functional Requirements 讲的是为了完成这个目标，系统必须具备哪些具体能力。

---

## 4. Tasks：开发者真正执行的步骤

**Tasks 表示为了实现需求，开发者具体要做哪些事情。**

例如某个 Functional Requirement 是：

```text
FR-002：系统必须提供 capitalize 方法，用于字符串首字母大写。
```

对应的 Tasks 可能是：

```text
T001：在 string-utils.ts 中新增 capitalize 函数。
T002：在统一导出文件中导出 capitalize。
T003：编写 capitalize 的单元测试。
T004：补充空字符串、单字符、普通字符串的测试用例。
T005：运行测试和 TypeScript 类型检查。
```

所以，一个 Requirement 对应多个 Tasks 也是正常的。

因为一个需求从实现到验收，通常不只是写一行代码，还包括：

- 写实现代码。
- 补充类型定义。
- 更新导出入口。
- 编写测试。
- 运行验证命令。
- 修复边界问题。

---

## 5. 四者之间的层级关系

可以用下面的结构理解：

```text
Feature
└── User Story 1
    ├── Functional Requirement 1
    │   ├── Task 1
    │   ├── Task 2
    │   └── Task 3
    ├── Functional Requirement 2
    │   ├── Task 4
    │   └── Task 5
    └── Functional Requirement 3
        ├── Task 6
        └── Task 7
```

也就是说：

```text
Feature 说明要做哪一块功能
User Story 说明用户为什么需要它、想达成什么目标
Functional Requirements 说明系统必须支持哪些具体能力
Tasks 说明开发者具体如何一步步实现
```

---

## 6. 生活例子：做一顿晚饭

如果用生活例子理解，可以这样类比。

### Feature

```text
做一顿晚饭
```

### User Story

```text
作为家人，我希望晚上能吃到一顿健康的晚饭，以便补充营养。
```

### Functional Requirements

```text
FR-001：必须有一道主菜。
FR-002：必须有一道青菜。
FR-003：必须有一份主食。
FR-004：必须在晚上 7 点前完成。
```

### Tasks

```text
T001：买鸡肉。
T002：洗菜。
T003：切菜。
T004：炒鸡肉。
T005：炒青菜。
T006：煮米饭。
T007：摆盘。
T008：清理厨房。
```

可以看到，`吃到一顿健康晚饭` 这个 User Story，确实会对应多个需求和多个任务。

软件开发也是一样。

---

## 7. 新手最容易混淆的点

### 误区一：把 User Story 当成一个函数

错误理解：

```text
一个 User Story = 一个函数
```

更准确的理解是：

```text
一个 User Story = 一个用户目标
```

一个用户目标可能需要多个函数、多个页面、多个接口、多个测试共同完成。

---

### 误区二：把 Requirement 和 Task 混在一起

Requirement 是“要什么”。

Task 是“怎么做”。

例如：

```text
Requirement:
系统必须支持判断字符串是否为空。

Task:
在 utils/string.ts 中实现 isEmpty 函数，并编写单元测试。
```

对比表：

| 层级                   | 关注点               | 示例                                       |
| ---------------------- | -------------------- | ------------------------------------------ |
| Feature                | 做哪一类功能         | 小贝字符串工具函数                         |
| User Story             | 用户想完成什么目标   | 开发者希望处理常见字符串场景，减少重复代码 |
| Functional Requirement | 系统必须提供什么能力 | 必须提供 `isEmpty` 方法                    |
| Task                   | 开发者具体做什么     | 新增 `isEmpty` 函数并编写测试              |

---

## 8. 推荐阅读顺序

新手阅读 Spec Kit 文档时，不建议一上来就看 `tasks.md`。

推荐顺序：

```text
1. 先看 Feature 名称
   明确整体要做什么。

2. 再看 User Stories
   理解用户为什么需要这个功能。

3. 再看 Functional Requirements
   明确系统必须支持哪些能力。

4. 最后看 Tasks
   理解开发时要一步步做哪些事。
```

如果一开始直接看 Tasks，会觉得非常碎，因为 Tasks 本来就是从需求拆出来的执行清单。

---

## 9. 在 Spec Kit 文件中的对应位置

一般可以这样对应：

| 内容                    | 常见文件                       | 作用                   |
| ----------------------- | ------------------------------ | ---------------------- |
| Feature                 | feature 目录名、`spec.md` 标题 | 当前功能主题           |
| User Story              | `spec.md`                      | 描述用户目标和验收场景 |
| Functional Requirements | `spec.md`                      | 描述系统必须满足的能力 |
| Technical Plan          | `plan.md`                      | 描述技术实现方案       |
| Tasks                   | `tasks.md`                     | 描述具体执行步骤       |
| Validation              | `quickstart.md`、测试任务      | 描述如何验证功能可用   |

可以记成：

```text
spec.md  管 WHAT 和 WHY
plan.md  管 HOW
tasks.md 管 DO
```

---

## 10. 最终记忆口诀

```text
Feature 是范围，决定这次做哪一块。
User Story 是目标，说明用户想达成什么。
Requirements 是能力，说明系统必须支持什么。
Tasks 是动作，说明开发者具体怎么落地。
```

所以，当你看到：

```text
一个 User Story 对应多个 Functional Requirements
一个 Functional Requirement 对应多个 Tasks
```

这不是文档混乱，而是正常的需求拆解方式。

Spec Kit 的目标就是把一个模糊的大功能，逐步拆成可以理解、可以实现、可以验证的小任务。
