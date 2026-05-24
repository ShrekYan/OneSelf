# Spec Kit 宪法配置与 Claude Code 规则的区别

## 背景问题

在使用 Spec Kit 后，项目中会同时存在两类规则：

```text
.specify/memory/constitution.md
CLAUDE.md / .claude/rules / .claude/agents / .claude/skills
```

它们看起来都在约束 Claude 的行为，因此容易产生疑问：

> Spec Kit 宪法配置和 Claude Code 的规则到底有什么区别？是否重复？是否可以只保留其中一个？

结论是：**二者不是重复关系，而是分工不同、互相补充。**

---

## 一句话总结

> **Spec Kit 宪法管 feature 规划是否合规，Claude Code 规则管 Claude 实际执行是否合规。**

也可以理解为：

```text
Spec Kit 宪法 = 规划前置门禁
Claude Code 规则 = 实现执行规范
```

---

## Spec Kit 宪法是什么？

Spec Kit 宪法通常指：

```text
.specify/memory/constitution.md
```

它是 Spec Kit 工作流中的项目原则文件，主要用于约束 feature 在需求、计划、任务拆分阶段是否符合团队规则。

它更偏向：

- 需求治理
- 规划治理
- 交付标准
- 架构原则
- 质量门禁

它关注的是：**一个 feature 在进入实现前，文档、计划和任务是否合格。**

---

## Claude Code 规则是什么？

Claude Code 规则通常来自：

```text
CLAUDE.md
.claude/rules/*.md
.claude/agents/*.md
.claude/skills/*.md
项目记忆 memory
系统/开发者指令
```

它主要约束 Claude 在实际对话、写代码、修改文件、运行命令、提交代码时的行为。

它更偏向：

- 代码怎么写
- 文件怎么改
- 命令怎么执行
- 什么时候使用 Agent
- 什么时候需要用户确认
- 项目规范如何落到代码
- 安全底线如何执行

它关注的是：**Claude 在实现阶段是否按照项目规范正确执行。**

---

## 核心区别对比

| 对比项       | Spec Kit 宪法                       | Claude Code 规则                                                    |
| ------------ | ----------------------------------- | ------------------------------------------------------------------- |
| 常见位置     | `.specify/memory/constitution.md`   | `CLAUDE.md`、`.claude/rules/`、`.claude/agents/`、`.claude/skills/` |
| 主要作用     | 约束 spec、plan、tasks 的生成和检查 | 约束 Claude 实际写代码和执行操作                                    |
| 关注阶段     | 需求、规划、任务拆分阶段            | 实现、修改、验证、提交阶段                                          |
| 关注对象     | feature 是否符合团队原则            | 代码和操作是否符合项目规范                                          |
| 偏向         | 产品治理 + 工程流程                 | 工程执行 + AI 行为                                                  |
| 生命周期     | 长期有效                            | 长期有效                                                            |
| 是否替代对方 | 不能替代 Claude Code 规则           | 不能替代 Spec Kit 宪法                                              |

---

## 类比理解

可以用项目管理和施工过程来类比：

```text
Spec Kit 宪法 = 项目立项和研发流程章程
Claude Code 规则 = AI 工程师的工作手册
```

也可以用建筑来类比：

```text
Spec Kit 宪法 = 建筑项目审批规范
Claude Code 规则 = 施工人员现场操作规范
```

Spec Kit 宪法决定项目在开工前是否符合原则；Claude Code 规则决定施工时是否按规范操作。

---

## Spec Kit 宪法主要管什么？

Spec Kit 宪法适合写“所有 feature 在规划阶段都必须遵守”的原则。

例如：

```text
每个 feature 必须有明确用户价值。
每个 feature 必须有可验证的验收标准。
每个 feature 必须明确范围边界和 Non-Goals。
涉及外部接口的 feature 必须提供契约文档。
涉及数据结构变化的 feature 必须提供 data-model.md。
用户故事必须按优先级排序。
所有 feature 必须先完成 spec / plan / tasks，再进入实现。
安全相关 feature 必须在 plan 阶段说明风险和防护策略。
```

这些规则的目标是让 Spec Kit 生成的文档更加可靠，避免还没写代码就已经方向不清晰。

---

## Claude Code 规则主要管什么？

Claude Code 规则适合写“Claude 实际执行任务时必须遵守”的规则。

例如：

```text
修改文件前必须先读取文件。
优先使用 Read / Edit / Glob / Grep 等专用工具。
不要主动提交 git，除非用户明确要求。
不要执行危险 git 操作，除非用户明确确认。
TypeScript 禁止不必要的 any。
函数参数和返回值必须显式声明类型。
前端页面必须遵守项目目录拆分规范。
前端状态管理必须遵守 MobX 使用约定。
禁止把 Token 存入 localStorage。
后端 Service 不直接暴露数据库原始错误。
提交前运行 lint 和类型检查。
```

这些规则的目标是让最终代码和操作过程符合项目规范。

---

## 示例：新增登录功能

假设要开发一个“登录功能”。

### Spec Kit 宪法会关心

```text
这个 feature 有没有明确用户价值？
有没有用户故事？
有没有验收标准？
有没有安全要求？
是否定义了接口契约？
是否定义了数据模型？
是否需要测试任务？
任务是否拆分清楚？
```

它影响的是这些文档：

```text
spec.md
plan.md
tasks.md
contracts/auth.md
data-model.md
quickstart.md
```

### Claude Code 规则会关心

```text
Token 能不能存 localStorage？不能。
Cookie 是否要 HttpOnly？要。
密码是否使用安全哈希算法？要。
前端 API 是否走统一请求封装？要。
后端 DTO 是否需要校验？要。
错误信息是否允许暴露内部堆栈？不能。
日志是否能打印完整 Token？不能。
```

它影响的是最终写出来的代码和执行过程。

---

## 二者如何配合？

推荐工作流如下：

```text
1. 用户提出 feature 需求
2. Spec Kit 根据宪法生成和检查 spec.md
3. Spec Kit 根据宪法生成和检查 plan.md
4. Spec Kit 根据宪法生成 tasks.md
5. Claude Code 根据 tasks.md 开始实现
6. Claude Code 在实现过程中遵守 CLAUDE.md 和 .claude/rules
7. 完成后执行验证、提交或交付
```

也就是说：

```text
Spec Kit 宪法负责让 feature 在开工前方向正确。
Claude Code 规则负责让 feature 在实现时行为正确。
```

---

## 谁的优先级更高？

可以粗略理解为：

```text
用户当前明确指令
  ↓
系统/开发者安全规则
  ↓
当前 Spec Kit feature 文档
  ↓
Spec Kit 宪法
  ↓
CLAUDE.md / .claude 项目规则
  ↓
Claude 默认习惯
```

但实际不是简单的固定排序，需要看冲突类型。

### 当前 feature 范围问题

如果用户明确说：

```text
不要添加单元测试
```

那么本次 feature 就不应该添加单元测试，即使项目里有测试相关规范。

### 安全底线问题

如果某个需求暗示：

```text
把 Token 存到 localStorage
```

即使 spec 没写清楚，Claude Code 安全规则仍然应该阻止。

### 流程治理问题

如果团队要求所有需求必须先生成 spec 和 plan，再实现，那么这个原则适合放在 Spec Kit 宪法中作为流程门禁。

---

## 如何判断规则应该放哪里？

可以用下面的问题判断。

### 放到 Spec Kit 宪法

如果这条规则回答的是：

> 一个 feature 在进入实现前，需求、计划、任务必须满足什么条件？

那么适合放到：

```text
.specify/memory/constitution.md
```

典型例子：

```text
必须有验收标准。
必须有 Non-Goals。
涉及接口必须有 contracts。
涉及数据必须有 data-model。
必须先 plan 后 implement。
```

### 放到 Claude Code 规则

如果这条规则回答的是：

> Claude 写代码、改文件、运行命令、使用工具时必须怎么做？

那么适合放到：

```text
CLAUDE.md
.claude/rules/
.claude/agents/
.claude/skills/
```

典型例子：

```text
禁止 any。
使用 CSS Modules。
使用 @/ 别名。
禁止 localStorage 存 Token。
后端 DTO 必须校验。
提交前必须运行 lint。
```

---

## 常见误区

### 误区 1：有了 Spec Kit 宪法，就不需要 Claude Code 规则

这是错误的。

Spec Kit 宪法主要影响规划文档，不会完整替代实现阶段的代码规范。

### 误区 2：有了 Claude Code 规则，就不需要 Spec Kit 宪法

这也是错误的。

Claude Code 规则主要约束实现过程，但不能保证每个 feature 在规划阶段都有清晰需求、验收标准和任务拆分。

### 误区 3：二者内容完全不能重复

不完全正确。

某些重要原则可以在两个地方都有体现，但侧重点不同。

例如“安全优先”：

- 在 Spec Kit 宪法中，它体现为“安全相关 feature 必须在 plan 中说明风险”。
- 在 Claude Code 规则中，它体现为“禁止 Token 存 localStorage、禁止日志打印敏感信息”。

---

## 最佳实践

### Spec Kit 宪法保持高层、稳定、流程化

适合写：

- feature 必须具备哪些文档。
- plan 阶段必须检查哪些原则。
- tasks 阶段必须如何组织任务。
- 哪些质量门禁必须通过。

不建议写太细的代码实现规则。

### Claude Code 规则保持具体、可执行、项目化

适合写：

- 具体技术栈规则。
- 具体目录结构规则。
- 具体编码规范。
- 具体安全限制。
- 具体工具使用方式。
- 具体 Agent 触发规则。

不建议把每个 feature 的临时需求都写进 `.claude`。

---

## 最终结论

Spec Kit 宪法和 Claude Code 规则都很重要，但它们解决的问题不同。

```text
Spec Kit 宪法：
管 feature 规划是否合规，偏需求治理和流程门禁。

Claude Code 规则：
管 Claude 实际执行是否合规，偏代码实现和操作规范。
```

最推荐的理解方式是：

> **Spec Kit 宪法保证“开工前方向正确”，Claude Code 规则保证“开工后执行正确”。**
