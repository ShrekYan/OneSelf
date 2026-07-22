---
title: Hooks实战指南：让AI编程助手学会"自律"
slug: claude-code-hooks-guide
date: 2024-06-01
tags: [Claude Code, Hooks, 规则引擎]
---

# Claude Code Hooks 实战指南：让 AI 编程助手学会"自律"

你有没有遇到过这些情况：Claude Code 一不小心改了 `.env` 文件、执行了 `rm -rf`、或者代码改完忘了跑测试？

你可能在 CLAUDE.md 里写了"不要改 .env""改完代码要跑测试"，但 LLM 不是规则引擎——它"知道"规则，不代表每次都"遵守"规则。

**Hooks 就是 Claude Code 的规则引擎**：确定性地、每次必执行，不靠 AI 的"自觉"。

## 一、Hooks 解决什么问题

先看一个真实场景：

你在 CLAUDE.md 里写了：

```
- 永远不要修改 .env 文件
- 每次改完代码自动跑 prettier
- Bash 命令不允许 rm -rf /
```

然后 Claude Code 在一次长会话里：

1. 上下文压缩后"忘了"这些规则，修改了 `.env`

2. 改完代码没跑 prettier，commit 了一堆格式问题

3. 执行了 `rm -rf /tmp/build` 清理构建产物——虽然这次没出事，但下次呢？

**问题本质：CLAUDE.md 是"建议"，Hooks 是"规则"。** LLM 可能忽略建议，但不可能绕过规则。

| 特性     | CLAUDE.md            | Hooks                          |
| -------- | -------------------- | ------------------------------ |
| 执行方式 | LLM 自主决定是否遵守 | 系统强制执行，每次必触发       |
| 可靠性   | 依赖模型"自觉"       | 确定性保证                     |
| 能力     | 只能写文本指令       | 可以运行脚本、调 API、做判断   |
| 适用场景 | 通用规范、偏好设定   | 安全红线、自动化流程、质量门禁 |

## 二、Hooks 的生命周期——20+ 事件分层速查

按使用频率分三层：

### 高频事件（日常开发几乎必用）

| 事件               | 触发时机          | 核心用途                               |
| ------------------ | ----------------- | -------------------------------------- |
| `PreToolUse`       | 工具执行前        | 拦截危险命令、保护敏感文件、参数校验   |
| `PostToolUse`      | 工具执行后        | 自动格式化、运行测试、变更审计         |
| `Stop`             | Claude 完成回复时 | 质量门禁（测试是否通过、任务是否完成） |
| `Notification`     | Claude 发送通知时 | 桌面提醒、转发到 Slack/飞书            |
| `UserPromptSubmit` | 用户提交输入前    | 输入验证、注入上下文                   |

### 中频事件（特定场景很有用）

| 事件                             | 触发时机          | 核心用途                          |
| -------------------------------- | ----------------- | --------------------------------- |
| `SessionStart`                   | 会话启动/恢复时   | 初始化环境、压缩后重新注入上下文  |
| `SessionEnd`                     | 会话结束时        | 清理临时文件、记录统计            |
| `SubagentStart` / `SubagentStop` | 子代理启动/完成时 | 子任务分发监控与验收              |
| `PostToolUseFailure`             | 工具执行失败时    | 自动重试、错误上报                |
| `PermissionRequest`              | 权限弹窗时        | 自动审批/拒绝特定权限             |
| `PreCompact` / `PostCompact`     | 上下文压缩前后    | 压缩前保存关键信息/压缩后重新注入 |

### 低频但实用的事件

| 事件                                | 触发时机                                             |
| ----------------------------------- | ---------------------------------------------------- |
| `ConfigChange`                      | 配置文件变更时 — 审计/阻止未授权修改                 |
| `CwdChanged`                        | 工作目录切换时 — 自动加载 direnv 等环境变量          |
| `FileChanged`                       | 监听文件变化 — 监听 `.envrc`/`.env` 变更自动重载     |
| `InstructionsLoaded`                | CLAUDE.md/rules 加载时 — 追踪上下文加载情况          |
| `TaskCreated` / `TaskCompleted`     | 任务创建/完成时 — 生命周期追踪                       |
| `WorktreeCreate` / `WorktreeRemove` | worktree 创建/删除时                                 |
| `StopFailure`                       | API 错误导致停止时 — 错误恢复/降级处理               |
| `TeammateIdle`                      | agent team 成员空闲时 — 协调团队任务                 |
| `Setup`                             | `--init-only` 启动时 — CI 一次性初始化               |
| `PermissionDenied`                  | 工具调用被自动拒绝时 — 返回 `{retry: true}` 允许重试 |
| `UserPromptExpansion`               | 命令展开为 prompt 前 — 可拦截命令展开                |

## 三、四种 Hook 类型

Hooks 不只是跑 shell 命令，官方支持 4 种类型：

### 1. Command Hook（最常用）

运行 shell 命令，通过 stdin 接收 JSON 上下文，通过 exit code 和 stdout 返回决策。

```
{ "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write" }
```

**适用：** 确定性规则——格式化、拦截、日志记录。

### 2. Prompt Hook

把 hook 输入 + 你的 prompt 发给一个 Claude 模型（默认 Haiku），让模型做判断，返回 `{"ok": true/false, "reason": "..."}`。

```
{
  "type": "prompt",
  "prompt": "Check if all tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains to be done\"}."
}
```

**适用：** 需要理解语义的判断——任务是否完成、代码质量是否达标。

### 3. Agent Hook（实验性）

和 Prompt Hook 类似，但 spawn 一个子代理，可以读文件、搜索代码、运行命令来做更深入的验证。默认 60 秒超时，最多 50 次工具调用。

```
{
  "type": "agent",
  "prompt": "Verify that all unit tests pass. Run the test suite and check the results.",
  "timeout": 120
}
```

**适用：** 需要实际验证代码状态的场景。生产环境建议先用 command hook。

### 4. HTTP Hook

POST 事件数据到 HTTP 端点，适合接入审计服务、Webhook 等。

```
{
  "type": "http",
  "url": "http://localhost:8080/hooks/tool-use",
  "headers": { "Authorization": "Bearer $MY_TOKEN" },
  "allowedEnvVars": ["MY_TOKEN"]
}
```

**适用：** 团队审计、外部系统集成。

**选型速查：**

| 场景                 | 推荐类型 |
| -------------------- | -------- |
| 格式化 / lint / 拦截 | command  |
| 判断任务是否完成     | prompt   |
| 需要跑测试验证       | agent    |
| 团队审计 / 外部通知  | http     |

## 四、Hook 通信协议

理解 Hook 如何和 Claude Code 通信是写好 Hook 的基础。

### 输入：stdin 收到 JSON

每个 Hook 都通过 stdin 收到事件数据。例如 `PreToolUse` 事件：

```
{
  "session_id": "abc123",
  "cwd": "/Users/sarah/myproject",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

你的脚本解析这些字段做判断。`UserPromptSubmit` 收到 `prompt` 文本，`SessionStart` 收到 `source`（startup/resume/compact），不同事件的输入字段不同。

### 输出：exit code + stdout/stderr

| Exit Code | 含义   | 行为                                        |
| --------- | ------ | ------------------------------------------- |
| `0`       | 无异议 | 正常流程继续；stdout 内容注入 Claude 上下文 |
| `2`       | 阻止   | 动作被拦截，stderr 作为反馈发给 Claude      |
| 其他      | 出错   | 动作继续，stderr 显示为 hook error          |

### JSON 结构化输出（更精细的控制）

Exit code 只有"放行/阻止"两种状态。要更精细的控制，exit 0 并向 stdout 输出 JSON：

**PreToolUse 拦截并给理由：**

```
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep for better performance"
  }
}
```

`permissionDecision` 三种值：

- `"allow"`：跳过交互式权限弹窗

- `"deny"`：拦截工具调用，reason 反馈给 Claude

- `"ask"`：正常弹出权限确认

**⚠️ 重要：exit 2 和 JSON 输出不能混用！** Exit 2 时 Claude Code 忽略 JSON；要用 JSON 输出必须 exit 0。

## 五、实战案例：一份完整配置的逐行拆解

### 完整配置

```
{
  "permissions": {
    "allow": [
      "Read",
      "Bash(ls *)", "Bash(cat *)", "Bash(head *)", "Bash(tail *)",
      "Bash(wc *)", "Bash(find *)", "Bash(grep *)", "Bash(echo *)",
      "Bash(mkdir *)",
      "Bash(git status)", "Bash(git log *)", "Bash(git diff *)",
      "Bash(git branch *)", "Bash(git show *)",
      "Bash(node --version)", "Bash(npm --version)",
      "Bash(npx tsc --noEmit)"
    ],
    "deny": [
      "Bash(rm -rf *)", "Bash(sudo *)", "Bash(curl *)", "Bash(wget *)",
      "Read(./.env*)", "Read(./secrets/**)", "Read(./**/credentials*)",
      "Edit(./.env*)", "Edit(./secrets/**)",
      "WebFetch"
    ],
    "ask": [
      "Bash(git push *)", "Bash(npm install *)"
    ],
    "defaultMode": "acceptEdits"
  },
  "model": "ark-code-latest",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json,sys; d=json.load(sys.stdin); cmd=d.get('tool_input',{}).get('command',''); blocked=['rm -rf /','DROP TABLE','DROP DATABASE',':(){:|:&};:']; sys.exit(2) if any(b in cmd for b in blocked) else sys.exit(0)\""
          }
        ]
      },
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json,sys; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); sys.exit(2) if any(x in p for x in ['.env','package-lock.json','.git/']) else 0)\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/contracts/cli/post-edit-check.js",
            "onFailure": "notify"
          }
        ]
      }
    ]
  },
  "enabledPlugins": {
    "code-review@claude-plugins-official": false,
    "security-guidance@claude-plugins-official": true
  },
  "language": "chinese",
  "alwaysThinkingEnabled": true,
  "effortLevel": "medium"
}
```

### 逐层拆解

#### 第一层：Permissions — 静态权限规则

permissions 是 Claude Code 的**静态防线**——不执行任何脚本，纯规则匹配，零延迟：

- **allow**：白名单放行。只允许读文件和安全的 Bash 命令（`ls`、`cat`、`git status` 等）

- **deny**：黑名单拦截。`rm -rf`、`sudo`、`curl`、`wget` 一律禁止；`.env` 和 `secrets/` 目录既不能读也不能改

- **ask**：需要确认。`git push` 和 `npm install` 影响较大，每次都弹确认框

**permissions vs hooks 的分工：**

| 维度     | permissions                      | hooks                                                     |
| -------- | -------------------------------- | --------------------------------------------------------- |
| 判断方式 | 静态规则匹配（glob 模式）        | 动态脚本执行（可编程）                                    |
| 延迟     | 零延迟                           | 需要脚本执行时间                                          |
| 能力     | 只能按命令模式匹配               | 可以解析命令内容、检查文件路径、调 API                    |
| 例子     | `Bash(rm -rf *)` 拦截所有 rm -rf | 检查 `rm -rf /tmp/build` 是安全的，但 `rm -rf /` 必须拦截 |

**关键设计：** permissions 做粗粒度的静态拦截，hooks 做细粒度的动态判断。两者互补，不是替代关系。

#### 第二层：PreToolUse — 工具执行前的两道关卡

**关卡 1：Bash 危险命令检测**

```
{
  "matcher": "Bash",
  "hooks": [{
    "type": "command",
    "command": "python3 -c \"import json,sys; d=json.load(sys.stdin); cmd=d.get('tool_input',{}).get('command',''); blocked=['rm -rf /','DROP TABLE','DROP DATABASE',':(){:|:&};:']; sys.exit(2) if any(b in cmd for b in blocked) else sys.exit(0)\""
  }]
}
```

逐行拆解：

1. `matcher: "Bash"` — 只在 Claude 要执行 Bash 命令时触发

2. 从 stdin 读 JSON → 提取 `tool_input.command` 字段

3. 检查命令是否包含 4 种危险模式：
   - `rm -rf /` — 根目录删除

   - `DROP TABLE` / `DROP DATABASE` — 数据库破坏

   - `:(){:|:&};:` — fork bomb

4. 命中任何一个 → exit 2（拦截），Claude 收到拦截反馈

5. 都没命中 → exit 0（放行），走正常的 permission 流程

**为什么 permissions 里有 `Bash(rm -rf *)` 还要加这个 Hook？** 因为 permissions 只能做 glob 匹配——`Bash(rm -rf *)` 会拦截所有 `rm -rf` 开头的命令，包括 `rm -rf /tmp/build` 这种安全的清理操作。而 Hook 可以检查命令内容，只拦截真正危险的 `rm -rf /`。

**关卡 2：敏感文件保护**

```
{
  "matcher": "Edit|Write|MultiEdit",
  "hooks": [{
    "type": "command",
    "command": "python3 -c \"import json,sys; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); sys.exit(2) if any(x in p for x in ['.env','package-lock.json','.git/']) else 0)\""
  }]
}
```

1. `matcher: "Edit|Write|MultiEdit"` — 覆盖所有文件编辑工具（管道符表示"或"）

2. 提取 `tool_input.file_path`

3. 文件路径包含 `.env`、`package-lock.json`、`.git/` 任一 → exit 2 拦截

4. 否则 → exit 0 放行

**和 permissions 的 deny 规则配合：** deny 里的 `Edit(./.env*)` 是静态拦截，即使 Hook 放行了，deny 规则仍然生效。**双重保险。**

#### 第三层：PostToolUse — 编辑后的自动化校验

```
{
  "matcher": "Edit|Write|MultiEdit",
  "hooks": [{
    "type": "command",
    "command": "node .claude/contracts/cli/post-edit-check.js",
    "onFailure": "notify"
  }]
}
```

1. 文件编辑完成后自动触发

2. 运行 `post-edit-check.js` 做校验（TypeScript 类型检查、lint 等）

3. `"onFailure": "notify"` — Hook 执行失败时通知用户，而不是静默忽略

**`post-edit-check.js` 实现参考：**

```
const { execSync } = require('child_process');
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const filePath = input.tool_input?.file_path || '';

// 只检查 .ts/.tsx 文件
if (!filePath.match(/\.(ts|tsx)$/)) {
  process.exit(0);
}

try {
  execSync('npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
  process.exit(0);
} catch (e) {
  console.error(`TypeScript check failed after editing ${filePath}`);
  process.exit(0); // 不阻止，只是通知
}
```

#### 第四层：Plugins — 安全插件兜底

```
"enabledPlugins": {
  "code-review@claude-plugins-official": false,
  "security-guidance@claude-plugins-official": true
}
```

`security-guidance` 插件启用后，会在 Claude 的工具调用链中注入安全审查——它内部就是用 Hooks 实现的，每次工具调用前后跑一个独立模型做安全评估。这相当于在你手动配置的 Hooks 之外，再加一层官方维护的安全防线。

`code-review` 关掉是因为项目已有自定义的代码审查规则，避免重复。

## 六、Matcher 机制详解

Matcher 控制 Hook 何时触发，是精准配置的关键。

### 各事件的 Matcher 过滤字段

| 事件                             | Matcher 过滤什么   | 示例值                              |
| -------------------------------- | ------------------ | ----------------------------------- | -------------------- |
| `PreToolUse` / `PostToolUse`     | 工具名             | `Bash`、`Edit                       | Write`、`mcp\_\_.\*` |
| `SessionStart`                   | 会话启动来源       | `startup`、`resume`、`compact`      |
| `SessionEnd`                     | 会话结束原因       | `clear`、`resume`、`logout`         |
| `Notification`                   | 通知类型           | `permission_prompt`、`idle_prompt`  |
| `SubagentStart` / `SubagentStop` | 代理类型           | `Explore`、`Plan`、自定义代理名     |
| `ConfigChange`                   | 配置来源           | `user_settings`、`project_settings` |
| `Stop` / `UserPromptSubmit`      | **不支持 matcher** | 始终触发                            |

### `if` 字段：更精细的过滤（v2.1.85+）

Matcher 只能按工具名过滤。`if` 字段用权限规则语法，可以同时匹配工具名和参数：

```
{
  "matcher": "Bash",
  "hooks": [
    {
      "type": "command",
      "if": "Bash(git *)",
      "command": ".claude/hooks/check-git-policy.sh"
    }
  ]
}
```

只在 Bash 命令是 `git` 子命令时才触发 Hook，其他 Bash 命令忽略。`if` 只对工具事件有效（PreToolUse、PostToolUse 等）。

## 七、踩坑记录

### 坑 1：Stop Hook 有 8 次上限

Stop Hook 连续 8 次返回 block 后，Claude Code 会强制停止。防无限循环的安全机制。

**解法：** 检查 `stop_hook_active` 字段：

```
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0 # 已触发多次，允许停止
fi
```

### 坑 2：PostToolUse 无法撤销操作

工具已经执行完了才触发 PostToolUse。需要拦截的必须用 PreToolUse。

### 坑 3：PermissionRequest 在非交互模式不触发

用 `claude -p` 跑非交互模式时，`PermissionRequest` Hook 不触发。改用 `PreToolUse`。

### 坑 4：Hook 输出的 JSON 被 shell profile 污染

`~/.bashrc` 或 `~/.zshrc` 里的 `echo "Shell ready"` 会被 prepend 到 Hook 的 JSON 输出前面，导致解析失败。

**解法：** 用交互检测包裹：

```
if [[ $- == *i* ]]; then
  echo "Shell ready"
fi
```

### 坑 5：Hook allow 不能覆盖 deny 规则

PreToolUse Hook 返回 `"allow"` 可以跳过交互式权限弹窗，但如果 settings.json 里有对应的 deny 规则，工具调用仍然会被阻止。**Hook 可以收紧限制，但不能放松限制。** 这是一条安全底线——即使 Hook 代码有 bug，deny 规则仍然兜底。

### 坑 6：exit 2 和 JSON 输出不能混用

Exit 2 时 Claude Code 忽略 stdout 的 JSON；要用结构化 JSON 输出控制行为，必须 exit 0。

## 八、速查表

| 操作          | 命令/配置                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| 查看 Hook     | `/hooks`                                                                                                  |
| 禁用所有 Hook | `"disableAllHooks": true`                                                                                 |
| Hook 超时     | 默认 10 分钟（command），30 秒（prompt），60 秒（agent）                                                  |
| Exit 0        | 放行，stdout 注入上下文                                                                                   |
| Exit 2        | 阻止，stderr 反馈给 Claude                                                                                |
| Exit 其他     | 放行，stderr 显示为 hook error                                                                            |
| JSON 输出     | Exit 0 + stdout 写 JSON（不能和 Exit 2 混用）                                                             |
| matcher 语法  | 管道分隔：`Edit                                                                                           | Write`；正则：`mcp\_\_.\*` |
| `if` 字段     | 权限规则语法：`Bash(git *)`，仅工具事件可用                                                               |
| 环境变量      | `$CLAUDE_PROJECT_DIR` 指向项目根目录                                                                      |
| 调试          | `claude --debug-file /tmp/claude.log` 或 `/debug`                                                         |
| Hook 配置位置 | `~/.claude/settings.json`（全局）/ `.claude/settings.json`（项目）/ `.claude/settings.local.json`（本地） |
