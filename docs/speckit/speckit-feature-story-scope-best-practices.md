# Spec Kit Feature 与 User Story 粒度最佳实践

## 背景

在使用 Spec Kit 编写 `spec.md` 时，如果一个 feature 放入过多 User Story，或者一个 User Story 放入过多需求，AI 很容易出现以下问题：

- 需求被稀释，核心 P1 场景不突出。
- AI 自动脑补未定义规则。
- plan 和 tasks 变得过大，执行阶段容易跑偏。
- 多个业务目标混在一起，导致实现边界不清。
- 后续 review、clarify、implement 的成本明显增加。

因此，需要控制 feature、User Story、Functional Requirements 的粒度。

---

## 核心结论

```text
一个 Spec Kit feature：
- 最佳：1 ~ 3 个 User Story
- 可接受上限：5 个 User Story
- 超过 5 个：建议拆分 feature

一个 User Story：
- 最佳：3 ~ 5 个用户需求 / Functional Requirements
- 可接受上限：7 个用户需求 / Functional Requirements
- 超过 7 个：建议拆分 User Story 或拆分 feature

一个 feature 的总需求数：
- 最佳：8 ~ 15 条 Functional Requirements
- 可接受上限：20 条 Functional Requirements
- 超过 20 条：建议拆分 feature
```

如果目标是让 AI 执行更稳定，建议采用更严格的规则：

```text
推荐上限：
- 一个 feature 最多 3 个 User Story
- 一个 User Story 最多 5 个用户需求
- 一个 feature 总需求最多 15 条
```

---

## 官方原则

Spec Kit 模板没有硬性规定一个 feature 必须放多少个 User Story，但它强调：

> User Story 应该是按优先级排序的用户旅程，并且每个 User Story 都必须可以独立开发、独立测试、独立部署、独立演示。

也就是说，判断粒度是否合适的关键不是数量本身，而是：

```text
每个 User Story 是否是一个独立的用户价值切片？
```

如果只实现 P1 User Story，也应该能形成一个最小可交付版本。

---

## 推荐数量标准

### 1. 一个 feature 放多少个 User Story？

| User Story 数量 | 建议       | 说明                    |
| --------------- | ---------- | ----------------------- |
| 1 个            | 很好       | 小功能，AI 最稳定       |
| 2 ~ 3 个        | 最佳       | 覆盖核心流程和少量增强  |
| 4 ~ 5 个        | 可接受上限 | 需要边界非常清楚        |
| 6 个以上        | 不推荐     | AI 容易稀释、脑补、跑偏 |
| 10 个以上       | 基本错误   | 应拆成多个 feature      |

建议项目规则：

```text
一个 Spec Kit feature 最多包含 5 个 User Story，推荐 1 ~ 3 个。
```

---

### 2. 一个 User Story 放多少个用户需求？

这里的用户需求主要指 `Functional Requirements`，也就是：

```text
FR-001: 系统必须 ...
FR-002: 用户必须可以 ...
```

推荐标准：

| 需求数量 | 建议       | 说明                   |
| -------- | ---------- | ---------------------- |
| 1 ~ 2 条 | 偏少       | 可能只是一个简单动作   |
| 3 ~ 5 条 | 最佳       | 能完整表达一个用户目标 |
| 6 ~ 7 条 | 可接受上限 | 需要检查是否过大       |
| 8 条以上 | 不推荐     | 通常应拆分 User Story  |

建议项目规则：

```text
一个 User Story 最多包含 7 条用户需求，推荐 3 ~ 5 条。
```

---

### 3. 一个 User Story 放多少个 Acceptance Scenario？

Acceptance Scenario 是验收场景，通常使用 Given / When / Then 表达：

```text
Given [初始状态]
When [用户动作]
Then [预期结果]
```

推荐标准：

```text
一个 User Story：
- 最佳：2 ~ 4 个 Acceptance Scenario
- 上限：5 个 Acceptance Scenario
- 超过 5 个：检查是否拆分 User Story
```

---

## 推荐配比

最稳定的结构如下：

```text
1 个 feature
  ├── 1 个 P1 用户故事
  │     ├── 3 ~ 5 个 Functional Requirements
  │     └── 2 ~ 4 个 Acceptance Scenarios
  ├── 1 个 P2 用户故事
  │     ├── 2 ~ 4 个 Functional Requirements
  │     └── 1 ~ 3 个 Acceptance Scenarios
  └── 1 个 P3 用户故事
        ├── 1 ~ 3 个 Functional Requirements
        └── 1 ~ 2 个 Acceptance Scenarios
```

也就是：

```text
一个 feature 总需求数最好控制在 8 ~ 15 条以内。
```

---

## 硬性约束建议

如果希望最大程度避免 AI 跑偏，可以在项目中采用以下硬性规则：

```text
Spec Kit feature 粒度规则：

1. 一个 feature 最多包含 5 个 User Story，推荐 1 ~ 3 个。
2. 一个 feature 只能有 1 个 P1 User Story。
3. 一个 User Story 最多包含 7 个 Functional Requirements，推荐 3 ~ 5 个。
4. 一个 User Story 最多包含 5 个 Acceptance Scenarios，推荐 2 ~ 4 个。
5. 一个 feature 的 Functional Requirements 总数最多 20 条，推荐 8 ~ 15 条。
6. 如果超过上述限制，必须拆分 feature。
```

更适合 AI 稳定执行的严格版本：

```text
AI 稳定执行推荐规则：

1. 一个 feature 最多 3 个 User Story。
2. 一个 User Story 最多 5 个 Functional Requirements。
3. 一个 User Story 最多 4 个 Acceptance Scenarios。
4. 一个 feature 总 Functional Requirements 最多 15 条。
5. 一个 feature 只能解决 1 个核心业务目标。
```

---

## 复杂度判断公式

可以用下面的简单公式判断 feature 是否过大：

```text
feature 复杂度 = User Story 数量 × 平均需求数量
```

判断标准：

| 复杂度  | 判断           |
| ------- | -------------- |
| 1 ~ 8   | 很稳           |
| 9 ~ 15  | 正常           |
| 16 ~ 25 | 偏大，需要谨慎 |
| 25 以上 | 应拆分 feature |

示例：

```text
3 个 User Story × 每个 4 个需求 = 12
```

这是比较理想的范围。

```text
5 个 User Story × 每个 6 个需求 = 30
```

这个 feature 明显偏大，AI 很容易开始平均用力，导致核心场景不聚焦。

---

## 什么情况下必须拆 feature？

满足以下任意一条，就建议拆分：

| 条件                                           | 处理建议         |
| ---------------------------------------------- | ---------------- |
| User Story 超过 5 个                           | 拆 feature       |
| Functional Requirements 总数超过 20 条         | 拆 feature       |
| 一个 User Story 超过 7 条需求                  | 拆 User Story    |
| 一个 feature 出现多个核心业务目标              | 拆 feature       |
| P1 Story 不能单独交付价值                      | 重新切 story     |
| Story 之间强依赖，不能独立测试                 | 重新切分         |
| 描述中频繁出现“并且还要”                       | 拆分需求或 story |
| 涉及多个业务域，例如登录、用户资料、消息、权限 | 拆 feature       |
| AI 需要猜大量规则                              | 先执行 clarify   |

---

## 好的 feature 示例

### Feature: 文章收藏

```text
User Story 1 P1：
登录用户可以在文章详情页收藏文章。

需求：
1. 用户可以点击收藏按钮收藏当前文章。
2. 收藏成功后按钮状态变为已收藏。
3. 重复点击不会创建重复收藏记录。
4. 未登录用户点击收藏时提示登录。
5. 收藏失败时显示错误提示。

User Story 2 P2：
登录用户可以取消已收藏文章。

需求：
1. 用户可以点击已收藏按钮取消收藏。
2. 取消成功后按钮状态变为未收藏。
3. 取消失败时保留原状态并提示错误。

User Story 3 P3：
登录用户可以查看我的收藏文章列表。

需求：
1. 用户可以进入我的收藏列表。
2. 列表展示收藏文章标题、摘要、收藏时间。
3. 空列表时展示空状态。
4. 点击文章进入详情页。
```

这个 feature 的规模：

```text
User Story 数量：3 个
Functional Requirements 数量：12 条
```

属于理想范围。

---

## 过大的 feature 示例

### Feature: 用户中心

```text
User Story：
1. 用户可以登录。
2. 用户可以注册。
3. 用户可以修改资料。
4. 用户可以上传头像。
5. 用户可以修改密码。
6. 用户可以查看收藏。
7. 用户可以查看评论。
8. 用户可以管理文章。
9. 用户可以查看消息。
```

这个 feature 有 9 个 User Story，明显过大。

应该拆成：

```text
Feature: 用户登录
Feature: 用户注册
Feature: 编辑个人资料
Feature: 上传头像
Feature: 修改密码
Feature: 我的收藏
Feature: 我的评论
Feature: 我的文章
Feature: 消息通知
```

---

## 命名建议

好的 feature 名称应该是一个明确的业务动作：

```text
收藏文章
发布评论
上传头像
重置密码
创建文章
编辑文章
```

不建议使用过大的模块名：

```text
用户中心
文章系统
评论模块
后台管理
博客完整功能
```

原因是模块名容易让 AI 自行补全范围，导致需求膨胀。

---

## 推荐模板

以后编写 Spec Kit feature 时，可以先按下面模板控制范围：

```markdown
# Feature: [一个具体业务动作]

## Scope

- 本 feature 只解决：[一句话说明核心目标]
- 不包含：[明确排除的内容]

## Users

- [用户角色 1]
- [用户角色 2，可选]

## User Stories

### User Story 1 - [核心用户旅程] (Priority: P1)

作为 [用户角色]，我希望 [完成一个具体动作]，以便 [获得具体价值]。

Functional Requirements：

1. [需求 1]
2. [需求 2]
3. [需求 3]

Acceptance Scenarios：

1. Given [初始状态], When [用户动作], Then [预期结果]
2. Given [初始状态], When [用户动作], Then [预期结果]

### User Story 2 - [增强用户旅程] (Priority: P2)

作为 [用户角色]，我希望 [完成一个具体动作]，以便 [获得具体价值]。

Functional Requirements：

1. [需求 1]
2. [需求 2]

Acceptance Scenarios：

1. Given [初始状态], When [用户动作], Then [预期结果]

## Out of Scope

- [不做什么]
- [不做什么]

## Success Criteria

- [可衡量结果 1]
- [可衡量结果 2]
```

---

## 最终建议

项目内推荐采用以下标准：

```text
一个 feature 最佳 1 ~ 3 个 User Story，最多 5 个。
一个 User Story 最佳 3 ~ 5 个用户需求，最多 7 个。
一个 User Story 最佳 2 ~ 4 个验收场景，最多 5 个。
一个 feature 总需求数最佳 8 ~ 15 条，最多 20 条。
```

如果以 AI 稳定执行为第一目标，采用更严格标准：

```text
一个 feature 最多 3 个 User Story。
一个 User Story 最多 5 个用户需求。
一个 feature 总需求最多 15 条。
```
