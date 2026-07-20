# Claude Code Command 调用 Agent 方法总结

> 归档用途：记录 Claude Code 中通过自定义 command 唤起 Agent 的机制、适用场景与项目实践。
>
> 相关文件：`.claude/commands/frontend-code-review.md`

---

## 1. 核心概念

在 Claude Code 中，command 本质上是一段 prompts，存放在 `.claude/commands/<name>.md`。

当用户输入 `/<name>` 时，Claude Code 会加载对应文件内容，并让主 Claude 按照内容执行。若希望 command 把任务交给专门的 Agent，应在 command 文件内指示主 Claude 使用 `Agent` 工具进行调用。

---

## 2. 调用 Agent 的方式

### Command 内指示主 Claude 调用 Agent

在 command markdown 正文中，直接写明主 Claude 必须使用 `Agent` 工具，并指定 `subagent_type`、`description`、`prompt` 等参数。

**典型结构：**

```markdown
---
name: frontend-code-review
description: 前端代码审查指南
---

# Frontend Code Review

你是命令分发器，不是审查员本身。

## Instructions

### 1. Delegate to Agent

你的唯一任务：使用 `Agent` 工具调用 `frontend-code-reviewer`。

| 参数            | 值                                                           |
| --------------- | ------------------------------------------------------------ |
| `subagent_type` | `frontend-code-reviewer`                                     |
| `description`   | 前端代码审查                                                 |
| `prompt`        | "用户审查需求：$ARGUMENTS\n\n请严格按照你的系统提示词执行。" |

执行要求：

- 这是你必须做的第一件事，也是唯一的事。
- 在调用 Agent 前，禁止读取任何代码文件。
- 禁止自行审查代码。
- 禁止先解释再调用。
```

**特点：**

- 主 Claude 只做命令解析和 Agent 调用，不执行业务逻辑。
- 可以精确控制传给 Agent 的 `prompt`，包括 `$ARGUMENTS` 的拼接方式。
- 与 `.claude/commands/` 目录结构完全兼容。
- 适合"用户输入命令 → 唤起专家 Agent"的场景。

---

## 3. 项目实践：`frontend-code-review.md`

本项目采用该方式，原因：

1. 用户主动输入 `/frontend-code-review <目标>` 是明确的命令触发，主 Claude 作为分发器最自然。
2. 需要把 `$ARGUMENTS` 精确传递给 `frontend-code-reviewer` Agent。
3. 项目已有 `.claude/commands/` 结构，无需迁移。
4. 可以严格约束主 Claude：禁止在 Agent 调用前读取代码或输出分析。

**调用链路：**

```
用户输入 /frontend-code-review apps/web/src/pages/Home
        ↓
Claude Code 加载 .claude/commands/frontend-code-review.md
        ↓
主 Claude 按文件指示调用 Agent 工具
        ↓
frontend-code-reviewer Agent 执行审查
        ↓
返回审查结果给主会话
```

---

## 4. 关键参数说明

调用 `Agent` 工具时，常用参数：

| 参数            | 说明                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| `subagent_type` | 子 Agent 类型，可以是内置（`Explore`、`Plan`、`general-purpose`）或自定义 `.claude/agents/*.md` 中定义的 name |
| `description`   | 简短描述，显示在任务列表中                                                                                    |
| `prompt`        | 传给 subagent 的完整任务指令                                                                                  |

`$ARGUMENTS` 会被替换为用户输入 command 时后面的全部文本。

---

## 5. 注意事项

1. **禁止主 Claude 越权执行**
   若 command 的目的是调用 Agent，必须在文件开头强制约束：调用 Agent 前不得读取代码、不得分析、不得解释。

2. **Agent 类型必须存在**
   `subagent_type` 必须对应一个已定义的 agent，否则调用会失败。自定义 agent 放在 `.claude/agents/<name>.md` 或 `~/.claude/agents/<name>.md`。

3. **参数转义**
   在 `prompt` 中引用 `$ARGUMENTS` 时，注意换行和引号，确保最终传给 Agent 的 prompt 格式正确。

---

## 6. 参考文件

- 改造后的 command：`.claude/commands/frontend-code-review.md`
- 分类模板：`.template/commands/01-code-quality-dev-flow.md`
- 自定义 subagent 示例：`.claude/agents/frontend-code-reviewer.md`

---

## 7. 官方文档参考

- [Claude Code Commands](https://docs.anthropic.com/en/docs/claude-code/commands)
- [Claude Code Subagents](https://docs.anthropic.com/en/docs/claude-code/subagents)
