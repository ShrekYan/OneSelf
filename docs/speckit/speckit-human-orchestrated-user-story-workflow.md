# Spec Kit 中人主导编排 User Story、AI 分步执行的最佳实践

## 背景

在使用 Spec Kit 进行 AI 辅助开发时，经常会遇到一个问题：

```text
一个 feature 中包含多个 User Story。
如果一次性让 AI 实现整个 feature，AI 容易需求稀释、平均用力、自动脑补，甚至跑偏。
```

因此，一个更稳定的方式是：

```text
人负责拆分、排序、编排 User Story；
AI 每次只执行一个 User Story。
```

这种方式可以显著降低 AI 的上下文压力，也能让每个阶段都更容易 review、验证和回滚。

---

## 核心结论

```text
一个 feature 里的 User Story 通常不是完全孤立的。
它们会共享业务目标、数据模型、页面结构、接口设计、技术约束和验收标准。

所以，人不能只把 User Story 丢给 AI 执行。
人需要先主导编排，明确故事之间的关系、顺序、边界和依赖。
```

最推荐的协作模式是：

```text
人负责拆分和编排，AI 负责单个 User Story 的实现。
```

---

## 为什么不能完全交给 AI 自己编排？

AI 的执行能力很强，但它不一定能稳定判断：

- 哪个 User Story 应该先做。
- 哪些 Story 之间存在依赖。
- 哪些设计需要在 P1 阶段先定下来。
- 哪些内容属于当前 Story，哪些属于后续 Story。
- 哪些代码可以复用，哪些不能重复实现。
- 哪些需求是明确的，哪些需求应该先 clarify。
- 已完成 Story 的边界不能被后续 Story 随意改动。

如果不加约束，AI 很容易出现以下问题：

```text
US1 实现了一套接口；
US2 又重新设计另一套接口；
US3 又补了一套不一致的数据结构。
```

最终结果就是：

- 多个 Story 风格不一致。
- 数据模型重复。
- 接口命名不统一。
- 已完成逻辑被误改。
- 后续集成成本变高。

---

## 人要主导什么？

人主导的重点不是每一行代码怎么写，而是负责更高层的编排。

需要提前想清楚：

```text
1. 这个 feature 的边界是什么？
2. 哪些 User Story 属于这个 feature？
3. 哪个是 P1，哪个是 P2/P3？
4. 哪些 Story 之间有依赖关系？
5. 哪些共享设计必须先定下来？
6. 哪些内容不能让 AI 自己猜？
7. 每次只让 AI 执行哪个 Story？
8. 执行完如何记录状态，给下一个 Story 使用？
9. 哪些已完成内容不能被后续 Story 随意重构？
10. 每个 Story 的完成标准是什么？
```

这就是人类主导编排的价值。

---

## Feature 内 User Story 的常见相关性

以 `文章收藏` feature 为例：

```text
Feature: 文章收藏

US1: 登录用户可以收藏文章。
US2: 登录用户可以取消收藏文章。
US3: 登录用户可以查看我的收藏列表。
```

这三个 User Story 不是完全独立的。

它们共享：

```text
1. 收藏数据模型。
2. 用户 ID 和文章 ID 的关联规则。
3. 登录态判断规则。
4. 收藏状态展示规则。
5. API 命名风格。
6. 错误提示规则。
7. 权限边界。
8. 测试数据。
9. 前端页面状态管理方式。
10. 后端唯一约束和重复收藏处理方式。
```

如果每次只让 AI 看当前 Story，而不给它全局约束，AI 可能会做出不一致的实现。

例如：

```text
US1: 实现 favoriteArticle()
US2: 又实现 toggleFavorite()
US3: 又设计 favorites API
```

这样后续就会出现接口重复、语义混乱、职责不清的问题。

---

## 最重要的动作：先定公共底座

在开始逐个执行 User Story 前，人应该先确定这个 feature 的共享设计。

例如 `文章收藏` feature 可以先确定：

```text
共享设计：

1. 收藏关系使用 userId + articleId 唯一约束。
2. 收藏和取消收藏使用两个明确接口，不使用 toggle 接口。
3. 前端文章详情页只展示一个收藏按钮。
4. 未登录用户点击收藏时统一跳转登录页或提示登录。
5. 收藏列表独立放在个人中心下。
6. 所有接口依赖 HttpOnly Cookie 登录态。
7. 收藏失败时不改变当前 UI 状态，并展示错误提示。
8. 后续 Story 必须复用已完成的数据模型和接口约定。
```

这些共享设计应该写入：

```text
spec.md
plan.md
progress.md
```

这样即使每次清空上下文，下一次 AI 重新执行时，也能通过读取文档恢复关键上下文。

---

## 人和 AI 的分工

### 人负责

```text
1. 定义 feature 边界。
2. 拆分 User Story。
3. 排列优先级。
4. 判断 Story 依赖关系。
5. 确认共享设计。
6. 决定哪些需求需要 clarify。
7. 控制每次执行范围。
8. Review AI 的实现结果。
9. 判断是否继续推进下一个 Story。
10. 决定是否拆分 feature。
```

### AI 负责

```text
1. 读取 spec.md、plan.md、tasks.md、progress.md。
2. 理解当前 User Story 的范围。
3. 按当前 Story 修改代码。
4. 复用已有实现和共享设计。
5. 补充必要测试。
6. 运行 lint、test、tsc 等验证命令。
7. 输出修改说明。
8. 更新 progress.md。
```

一句话总结：

```text
人做产品经理 + 架构师 + 任务编排器；
AI 做执行力强的开发助手。
```

---

## 推荐工作流

### 第 0 步：人先做编排

在让 AI 执行前，先明确：

```text
1. Feature 的核心目标。
2. Feature 的边界。
3. 不做什么。
4. User Story 列表。
5. User Story 的优先级。
6. User Story 的依赖关系。
7. 共享数据模型。
8. 共享接口设计。
9. 共享页面结构。
10. 验收标准。
```

---

### 第 1 步：AI 只实现 P1 Story

给 AI 的指令应该类似：

```text
请读取 spec.md、plan.md、tasks.md、progress.md。
本次只实现 User Story 1，不要实现 User Story 2/3。
不要修改无关文件。
不要重构不属于当前 Story 的逻辑。
实现完成后运行检查，并更新 progress.md。
```

---

### 第 2 步：人 review P1

人需要检查：

```text
1. 是否只实现了 P1？
2. 是否越界实现了后续 Story？
3. 是否符合共享设计？
4. 是否有重复实现？
5. 是否影响后续 Story？
6. 是否通过测试和类型检查？
7. progress.md 是否记录清楚？
```

---

### 第 3 步：新上下文执行 P2 Story

即使清空上下文，也要让 AI 先读取文档：

```text
请先读取：
1. spec.md
2. plan.md
3. tasks.md
4. progress.md

本次只实现 User Story 2。
必须复用 User Story 1 已完成的设计和代码。
不要重做 User Story 1。
不要修改 progress.md 中标记为已完成且不属于当前 Story 的逻辑。
```

---

### 第 4 步：继续执行 P3 / 后续 Story

后续每个 Story 都重复这个节奏：

```text
读取上下文文档 → 只执行当前 Story → 验证 → 更新 progress.md → 人 review → 进入下一 Story
```

---

## 推荐目录结构

建议每个 feature 目录维护一个执行状态文件：

```text
specs/xxx-feature/
├── spec.md
├── plan.md
├── tasks.md
└── progress.md
```

其中：

```text
spec.md      描述做什么和为什么。
plan.md      描述技术方案和约束。
tasks.md     描述任务拆分。
progress.md  描述执行状态和跨上下文交接信息。
```

---

## progress.md 推荐模板

```markdown
# Feature Progress

## Feature

[Feature 名称]

## Global Scope

本 feature 只解决：[核心目标]

不包含：

- [排除项 1]
- [排除项 2]

## Shared Decisions

- [共享设计决策 1]
- [共享设计决策 2]
- [共享设计决策 3]

## Completed Stories

### US1: [Story 名称]

状态：已完成

已实现内容：

- [内容 1]
- [内容 2]

修改文件：

- [文件路径 1]
- [文件路径 2]

验证结果：

- [检查命令和结果]

注意事项：

- [后续 Story 需要知道的约束]

## Current Story

### US2: [Story 名称]

状态：待执行

本次范围：

- [当前 Story 要做的内容]

不做：

- [明确排除的内容]

## Do Not

- 不要重做已完成 Story。
- 不要修改无关文件。
- 不要引入未确认的新依赖。
- 不要改变已确认的数据模型。
- 不要实现后续 Story 的内容。

## Open Questions

- [待确认问题 1]
- [待确认问题 2]
```

---

## 每次给 AI 的推荐提示词

### 执行某个 Story 前

```text
请先读取当前 feature 目录下的：
1. spec.md
2. plan.md
3. tasks.md
4. progress.md

本次只实现 User Story X：[Story 名称]。

要求：
- 只做当前 Story。
- 复用已完成 Story 的设计和代码。
- 不要重做已完成 Story。
- 不要实现后续 Story。
- 不要修改无关文件。
- 如果发现当前 Story 依赖不清楚，先提出问题，不要自行脑补。
- 实现完成后运行必要检查。
- 最后更新 progress.md。
```

### 执行完成后

```text
请总结：
1. 本次完成了哪个 User Story。
2. 修改了哪些文件。
3. 新增了哪些能力。
4. 哪些检查已经通过。
5. 哪些内容留给后续 Story。
6. progress.md 是否已更新。
```

---

## 是否可以每次清空上下文？

可以。

而且这是一种比较适合 AI 协作的方式。

推荐模式：

```text
一个 User Story = 一个会话 = 一次验证 = 一个 commit
```

但是前提是：

```text
不要清空上下文后直接让 AI 跑下一个 Story。
```

必须让 AI 重新读取：

```text
spec.md
plan.md
tasks.md
progress.md
```

这样可以避免 AI 失忆，也可以避免它重复实现或破坏前一个 Story。

---

## 什么时候适合一个 Story 一个会话？

适合以下场景：

```text
1. Feature 有多个 User Story。
2. 每个 Story 可以独立验收。
3. 每个 Story 修改范围相对清晰。
4. 希望降低 AI 上下文压力。
5. 希望每次都能 review 和 commit。
6. 希望减少大批量改动带来的风险。
```

不适合以下场景：

```text
1. Story 之间无法独立交付。
2. 当前 feature 的共享设计还没有确定。
3. P1 没有完成就强行实现 P2/P3。
4. 没有 progress.md 记录状态。
5. 人没有 review 上一个 Story 就继续推进。
```

---

## 常见错误

### 错误 1：只拆 Story，不定共享设计

```text
问题：
每个 Story 都让 AI 自己设计接口和数据结构。

后果：
多个 Story 实现风格不一致，后续集成困难。
```

正确做法：

```text
先明确共享数据模型、接口命名、页面结构、权限规则，再逐个执行 Story。
```

---

### 错误 2：每次新上下文只给当前 Story

```text
问题：
AI 看不到已完成内容和全局边界。

后果：
重复实现、误删逻辑、改坏前一个 Story。
```

正确做法：

```text
每次都让 AI 读取 spec.md、plan.md、tasks.md、progress.md。
```

---

### 错误 3：一个 Story 里塞太多需求

```text
问题：
单个 Story 变成一个小模块。

后果：
AI 仍然会被稀释，任务不可控。
```

正确做法：

```text
一个 Story 最好 3 ~ 5 条需求，最多 7 条。
```

---

### 错误 4：P1 没有完成就做 P2/P3

```text
问题：
基础能力还没稳定，后续 Story 开始叠加复杂度。

后果：
后续返工概率高。
```

正确做法：

```text
先让 P1 独立可用、可测、可演示，再做 P2/P3。
```

---

## 最佳实践规则

建议项目内采用以下规则：

```text
1. 一个 feature 可以包含多个 User Story，但每次只让 AI 执行一个 User Story。
2. 人必须先确认 feature 边界、Story 顺序、依赖关系和共享设计。
3. 每个 Story 执行前，AI 必须读取 spec.md、plan.md、tasks.md、progress.md。
4. 每个 Story 执行时，不允许实现后续 Story。
5. 每个 Story 执行完成后，必须更新 progress.md。
6. 每个 Story 执行完成后，必须进行人工 review。
7. 每个 Story 最好单独 commit。
8. 如果发现 Story 之间依赖混乱，先暂停实现，重新拆分 feature 或 clarify。
```

---

## 一句话总结

```text
Spec Kit + AI 的稳定协作方式，不是让 AI 一次性吃完整个 feature，
而是由人先主导 feature 的拆分、排序和依赖编排，
再让 AI 按 User Story 一次只执行一个可验收切片。
```

最终模式：

```text
人负责方向、边界、顺序和验收；
AI 负责按文档执行当前 Story。
```

这就是更成熟、更稳定的 Spec Kit 使用方式。
