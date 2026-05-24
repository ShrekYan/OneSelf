# `when_to_use` 与 `#include` 机制辨析

> 本文档用于澄清 Claude Code 中 `when_to_use`/`triggers` 与 `#include` 的职责边界。
> 结论：两者是正交机制，**无法互相替代**。

---

## 1. 问题的起源

疑问：能否在 Skill/Agent 中配置 `when_to_use: ["开发组件"]`，并**去掉 `#include`**，达到用户说"开发组件"时**自动加载**所有前端规范的效果？

**答案：不能。** 两者的机制层级完全不同。

---

## 2. 官方定义（来源：Claude Code Docs）

### 2.1 `when_to_use` / `description`

`when_to_use` 是 Skill 的 **YAML Frontmatter** 字段，用于描述 Skill 的调用场景。

```yaml
---
name: frontend-code-review
description: 前端代码质量审查
when_to_use: 当用户要求审查代码、检查 PR、分析代码质量时调用
---
```

> The `when_to_use` field provides **additional context for when Claude should invoke the skill**, such as trigger phrases or example requests.

- **作用阶段**：运行时（用户交互阶段）
- **核心功能**：**触发判断** — 用户说什么话时，应该调用这个 Skill
- **适用对象**：**仅 Skill**（`.claude/skills/**/SKILL.md`）
- **是否加载内容**：**否**，仅影响"要不要调用这个文件"

### 2.2 `triggers`

`triggers` 是 Agent 的 **YAML Frontmatter** 字段，作用与 `when_to_use` 类似。

```yaml
---
name: frontend-developer
triggers:
  - 开发前端页面
  - 创建组件
  - 写前端
---
```

- **作用阶段**：运行时（用户交互阶段）
- **核心功能**：**触发判断** — 用户输入匹配时，自动调用这个 Agent
- **适用对象**：**仅 Agent**（`.claude/agents/*.md`）
- **是否加载内容**：**否**，仅影响"要不要调用这个文件"

### 2.3 `#include`

`#include` 是文件正文中的**预处理器指令**，用于在文件被加载时，将目标文件的内容**物理嵌入**到当前上下文中。

```markdown
---
name: frontend-developer
triggers:
  - 开发前端页面
---

#include: ../rules/typescript-common.md
#include: ../skills/h5-frontend-developer/rules/frontend-css-scss.md
```

- **作用阶段**：预处理期（上下文构建阶段）
- **核心功能**：**内容嵌入** — 把引用的文件内容合并到当前文件
- **适用对象**：**Agent 和 Skill 通用**
- **是否影响触发**：**否**，与触发逻辑完全无关

---

## 3. 核心区别对比

| 维度             | `when_to_use` / `triggers`                  | `#include`               |
| ---------------- | ------------------------------------------- | ------------------------ |
| **解决的问题**   | 什么时候调用我                              | 调用我时带什么内容       |
| **作用阶段**     | 运行时（用户交互时）                        | 预处理期（上下文构建时） |
| **适用对象**     | Skill 用 `when_to_use`，Agent 用 `triggers` | Agent 和 Skill 通用      |
| **是否嵌入内容** | ❌ 否，只影响调用判断                       | ✅ 是，物理合并文件内容  |
| **类比**         | 门铃怎么响                                  | 进门拿什么装备           |
| **能否互相替代** | ❌ **不能**                                 | ❌ **不能**              |

---

## 4. 为什么不能互相替代

### 4.1 用户的假设

```
用户说："开发组件"
        ↓
when_to_use / triggers 匹配成功
        ↓
Skill / Agent 被唤起
        ↓
❓ 自动把 typescript 规范、css 规范、hooks 规范都加载进来
```

### 4.2 现实情况

```
用户说："开发组件"
        ↓
when_to_use / triggers 匹配成功
        ↓
只有这一个 Skill / Agent 文件本身被加载进上下文
        ↓
如果文件里没写 #include，相关规范 = 不存在于上下文中
```

### 4.3 根本原因

Claude Code 的调用流程是：

```
用户输入
   ↓
匹配 triggers / when_to_use
   ↓
确定调用哪个文件（单文件）
   ↓
读取该文件
   ↓
遇到 #include → 把引用的文件内容物理塞进来
   ↓
合并后的完整上下文给 AI
```

**不存在这样的流程：**

```
用户输入"开发组件"
   ↓
匹配到"前端开发"这个场景
   ↓
自动加载 frontend-typescript.md + frontend-css-scss.md + ...
   ↓
合并使用
```

**结论**：Claude Code 没有"触发词 → 规范集合"的映射机制。触发词只能唤起**单个文件**。

---

## 5. 项目中的正确使用姿势

### 5.1 Agent（如 `frontend-developer.md`）

```yaml
---
name: frontend-developer
triggers: # ← 触发判断：用户说什么话时调用我
  - 开发前端页面
  - 创建组件
---
#include: ../rules/typescript-common.md      # ← 内容嵌入：调用我时带什么规范
#include: ../skills/h5-frontend-developer/rules/frontend-css-scss.md
#include: ../skills/h5-frontend-developer/rules/frontend-api-design.md
```

### 5.2 Skill（如 `commit.md`）

```yaml
---
name: commit
description: Git 提交信息生成
when_to_use: 当用户需要生成 commit message、提交代码时 # ← 触发判断
---
# 内容直接写在文件里，或继续用 #include 嵌入其他内容
```

---

## 6. 常见误区

| 误区                                 | 纠正                                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `when_to_use` 和 `triggers` 作用相同 | 作用相似（都是触发判断），但**适用对象不同**：Skill 用 `when_to_use`，Agent 用 `triggers` |
| 配置了触发词，相关规范会自动加载     | 触发词只唤起**单个文件**，规范内容必须通过 `#include` 显式嵌入                            |
| 可以用 `when_to_use` 替代 `#include` | **不能替代**。一个是"叫不叫人"，一个是"带什么装备"，正交关系                              |

---

## 7. 总结

> **能否用 `when_to_use`/`triggers` 达到和 `#include` 相同的效果？**

**绝对不能。**

- `when_to_use` / `triggers` = **触发器**，控制"什么情况下调用我"
- `#include` = **内容预加载**，控制"调用我时上下文中包含什么"

若要减少重复 `#include` 的维护成本，只能通过**聚合入口文件**或**扁平化引用**等工程化手段，但无法通过触发机制来绕过。

---

_文档版本：v1.0_
_归档日期：2026-05-15_
