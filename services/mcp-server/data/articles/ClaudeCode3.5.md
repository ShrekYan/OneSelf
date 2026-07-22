---
title: 全方位介绍settings.json
slug: claude-code-settings-json-guide
date: 2024-06-01
tags: [Claude Code, 配置, settings.json]
---

# Claude Code -3.5 全方位介绍settings.json

一张表看懂所有配置项，随时 Ctrl+F 查阅。基于 `.claude/settings.json` 和 `settings.local.json` 的完整属性梳理。

## 配置文件概览

| 文件     | 位置                          | 作用             | 提交 Git |
| -------- | ----------------------------- | ---------------- | -------- |
| 全局配置 | `~/.claude/settings.json`     | 所有项目通用底线 | —        |
| 项目配置 | `.claude/settings.json`       | 团队共享项目规则 | ✅       |
| 本地配置 | `.claude/settings.local.json` | 个人偏好和凭证   | ❌       |

优先级：**local > project > global**

## 完整配置结构一览

```
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "claude-sonnet-4-6",
  "alwaysThinkingEnabled": true,
  "effortLevel": "medium",
  "language": "chinese",
  "includeCoAuthoredBy": false,
  "autoUpdates": true,
  "theme": "dark",
  "verbose": false,
  "forceLoginMethod": "claudeai",
  "skipDangerousModePermissionPrompt": false,
  "disableBypassPermissionsMode": false,
  "preferredNotifChannel": "iterm2_with_bell",
  "env": {},
  "permissions": {},
  "sandbox": {},
  "hooks": {},
  "enabledPlugins": {},
  "enableAllProjectMcpServers": false,
  "enabledMcpjsonServers": [],
  "disabledMcpjsonServers": []
}
```

下面逐项拆解。

## 一、基础配置

| 属性          | 类型    | 默认值   | 说明                                                                                  |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------- |
| `$schema`     | string  | —        | JSON Schema 地址，编辑器可据此提供自动补全和校验                                      |
| `model`       | string  | 系统默认 | 默认使用的模型 ID，填写模型 ID 字符串即可，也支持自定义模型（详见 env 配置）          |
| `language`    | string  | `"en"`   | 交互语言，如 `"chinese"`、`"english"`、`"japanese"`                                   |
| `theme`       | string  | 系统跟随 | 终端主题：`"dark"` / `"light"` / `"light-daltonized"` / `"dark-daltonized"`（仅全局） |
| `autoUpdates` | boolean | `true`   | 是否自动更新（仅全局）                                                                |
| `verbose`     | boolean | `false`  | 显示完整的 bash/命令输出（仅全局）                                                    |

## 二、思考与行为控制

| 属性                    | 类型    | 默认值     | 说明                                                                  |
| ----------------------- | ------- | ---------- | --------------------------------------------------------------------- |
| `alwaysThinkingEnabled` | boolean | `false`    | 是否始终开启思考模式（extended thinking），让 Claude 先推理再回答     |
| `effortLevel`           | string  | `"medium"` | 思考强度，控制 Claude 花多少算力"想"：`"low"` / `"medium"` / `"high"` |

### effortLevel 对比

| 值       | 行为               | 适用场景                 |
| -------- | ------------------ | ------------------------ |
| `low`    | 快速响应，思考较浅 | 简单修改、格式化、小 bug |
| `medium` | 平衡速度和深度     | 日常开发                 |
| `high`   | 深度推理，耗时更长 | 架构设计、复杂重构、难题 |

## 三、权限系统 permissions

这是 settings.json 中最核心的配置块。

```
"permissions": {
  "defaultMode": "acceptEdits",
  "allow": [],
  "ask": [],
  "deny": [],
  "additionalDirectories": []
}
```

### 3.1 defaultMode — 默认权限模式

| 值                  | 读文件 | 写文件  | 执行命令 | 适用场景                   |
| ------------------- | ------ | ------- | -------- | -------------------------- |
| `default`           | ✅     | ❓ 确认 | ❓ 确认  | 新手期                     |
| `acceptEdits`       | ✅     | ✅      | ❓ 确认  | 日常开发 ⭐                |
| `plan`              | ✅     | 🚫      | 🚫       | 只读探索                   |
| `dontAsk`           | ✅     | ✅      | ✅       | 高信任场景                 |
| `bypassPermissions` | ✅     | ✅      | ✅       | 仅 Docker 内，跳过所有检查 |

优先级：**deny > ask > allow > defaultMode**

### 3.2 allow / ask / deny — 权限规则列表

三条列表的规则格式一致，每条是一个**工具匹配模式**：

| 格式             | 示例                         | 匹配范围               |
| ---------------- | ---------------------------- | ---------------------- |
| 工具名           | `Read`                       | 所有读操作             |
| `工具(路径模式)` | `Edit(./src/**)`             | 仅 src 目录下的编辑    |
| `Bash(命令*)`    | `Bash(git log *)`            | `git log` 及其所有参数 |
| MCP 工具         | `mcp__pixso__design_to_code` | 特定 MCP 工具          |
| `WebFetch`       | `WebFetch`                   | 网页抓取               |
| `WebSearch`      | `WebSearch`                  | 网页搜索               |

**通配符 `*` 注意事项**：

- `Bash(ls *)` — 匹配 `ls -la`，**不匹配** `lsof`（空格分隔）

- `Bash(ls*)` — **会匹配** `lsof`（无空格，前缀匹配）

- 建议始终用 `命令 *`（带空格），避免命令注入

### 3.3 additionalDirectories — 扩展工作目录

```
"additionalDirectories": ["/shared-data", "../common-lib"]
```

允许 Claude 访问项目根目录之外的目录，支持绝对路径和相对路径。

### 3.4 权限规则速查模板

| 分类     | 推荐 allow                                                                                         | 推荐 ask                     | 推荐 deny                                             |
| -------- | -------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| 文件读取 | `Read`                                                                                             | —                            | `Read(./.env*)`、`Read(./secrets/**)`                 |
| 文件写入 | `Edit(./src/**)`、`Write(./src/**)`                                                                | —                            | `Edit(./.env*)`、`Edit(./secrets/**)`                 |
| Git      | `Bash(git status)`、`Bash(git diff *)`、`Bash(git log *)`、`Bash(git add *)`、`Bash(git commit *)` | `Bash(git push *)`           | `Bash(git push --force *)`、`Bash(git push -f *)`     |
| 开发命令 | `Bash(npm run dev)`、`Bash(npm run build)`、`Bash(npm run lint)`、`Bash(npm run test *)`           | `Bash(npm install *)`        | —                                                     |
| 系统命令 | `Bash(ls *)`、`Bash(cat *)`、`Bash(find *)`、`Bash(grep *)`、`Bash(mkdir *)`                       | —                            | `Bash(rm -rf *)`、`Bash(sudo *)`、`Bash(chmod 777 *)` |
| 网络命令 | —                                                                                                  | —                            | `Bash(curl *)`、`Bash(wget *)`                        |
| 数据库   | —                                                                                                  | `Bash(npx prisma migrate *)` | —                                                     |
| 进程管理 | —                                                                                                  | —                            | `Bash(killall *)`、`Bash(pkill *)`                    |
| 其他     | —                                                                                                  | —                            | `WebFetch`（按需）                                    |

### 3.5 权限相关开关

| 属性                                | 类型    | 默认值  | 说明                                                            |
| ----------------------------------- | ------- | ------- | --------------------------------------------------------------- |
| `skipDangerousModePermissionPrompt` | boolean | `false` | 设为 `true` 可跳过进入危险模式时的确认提示                      |
| `disableBypassPermissionsMode`      | boolean | `false` | 设为 `true` 可禁止使用 `bypassPermissions` 模式（企业安全策略） |

## 四、环境变量 env

```
"env": {
  "ANTHROPIC_AUTH_TOKEN": "your_token",
  "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
  "ANTHROPIC_MODEL": "claude-sonnet-4-6",
  "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-6",
  "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5",
  "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-7",
  "API_TIMEOUT_MS": "3000000",
  "MCP_TOOL_TIMEOUT": "30000",
  "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
}
```

| 变量                                       | 说明                     | 常用值                                                |
| ------------------------------------------ | ------------------------ | ----------------------------------------------------- |
| `ANTHROPIC_AUTH_TOKEN`                     | API 鉴权 Token           | `sk-ant-...` 或代理平台 Token                         |
| `ANTHROPIC_BASE_URL`                       | API 端点地址             | 官方：`https://api.anthropic.com`；第三方：见下方案例 |
| `ANTHROPIC_MODEL`                          | 覆盖默认模型             | 同 `model` 字段，优先级高于顶层 `model`               |
| `ANTHROPIC_DEFAULT_SONNET_MODEL`           | Sonnet 角色模型指定      | 任何兼容 Anthropic 协议的模型 ID                      |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL`            | Haiku 角色模型指定       | 同上                                                  |
| `ANTHROPIC_DEFAULT_OPUS_MODEL`             | Opus 角色模型指定        | 同上                                                  |
| `API_TIMEOUT_MS`                           | API 请求超时（毫秒）     | `"3000000"`（50 分钟）                                |
| `MCP_TOOL_TIMEOUT`                         | MCP 工具调用超时（毫秒） | `"30000"`（30 秒）                                    |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 禁用非必要网络请求       | `"1"` 开启                                            |
| `ANTHROPIC_MAX_TOKENS`                     | 单次请求最大 token 数    | `"100000"`                                            |

⚠️ 含 Token 的 env 配置只能放在 `settings.local.json`，绝对不能提交到 Git。

## 四-A、接入自定义大模型

Claude Code 支持通过 `env` 中的三个变量接入任何兼容 Anthropic API 协议的大模型服务，只需配置 Token、Base URL 和模型 ID 即可切换。

### 核心变量

| 变量                   | 作用                  | 必须 |
| ---------------------- | --------------------- | ---- |
| `ANTHROPIC_AUTH_TOKEN` | 第三方平台的 API Key  | ✅   |
| `ANTHROPIC_BASE_URL`   | 第三方平台的 API 端点 | ✅   |
| `ANTHROPIC_MODEL`      | 第三方平台的模型标识  | ✅   |

三个变量缺一不可，全部放在 `settings.local.json` 的 `env` 中。

### 案例：接入火山引擎（字节跳动）Ark 编码模型

以字节跳动火山引擎的 Ark Coding API 为例，完整配置如下：

```
// .claude/settings.local.json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_ark_api_key_here",
    "ANTHROPIC_BASE_URL": "https://ark.cn-beijing.volces.com/api/coding",
    "ANTHROPIC_MODEL": "ark-code-latest"
  },
  "permissions": {
    "allow": [
      "Read", "Write", "Edit", "Bash(*)",
      "mcp__pixso__design_to_code",
      "mcp__duckduckgo-search__search"
    ],
    "deny": [],
    "defaultMode": "acceptEdits"
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": []
}
```

**配置要点**：

- `ANTHROPIC_AUTH_TOKEN`：填写火山引擎控制台获取的 API Key

- `ANTHROPIC_BASE_URL`：`https://ark.cn-beijing.volces.com/api/coding`，注意这是火山引擎的编码专用端点，不是 Anthropic 官方地址

- `ANTHROPIC_MODEL`：`ark-code-latest`，这是火山引擎的模型标识，不是 Anthropic 原生模型名

### 案例：接入其他第三方平台

通用接入模式一致，只需替换三个变量：

| 平台           | `ANTHROPIC_BASE_URL`                                          | `ANTHROPIC_MODEL`      |
| -------------- | ------------------------------------------------------------- | ---------------------- |
| Anthropic 官方 | `https://api.anthropic.com`                                   | `claude-sonnet-4-6` 等 |
| 火山引擎 Ark   | `https://ark.cn-beijing.volces.com/api/coding`                | `ark-code-latest`      |
| 自建代理/中转  | 你的代理地址                                                  | 代理支持的模型 ID      |
| Azure Foundry  | 自动拼接 `https://{resource}.services.ai.azure.com/anthropic` | Azure 部署名           |

### 接入排查清单

配置完成后如果无法连接，按顺序检查：

1. **`ANTHROPIC_AUTH_TOKEN` 是否正确** — 复制时注意前后空格

2. **`ANTHROPIC_BASE_URL` 是否可达** — 终端执行 `curl -I <base_url>` 确认网络连通

3. **`ANTHROPIC_MODEL` 是否该平台支持** — 不同平台的模型 ID 不同，不能混用

4. **是否放在了 `settings.local.json`** — env 配置只对 local 文件生效

5. **`.gitignore` 是否包含 `settings.local.json`** — 避免 Token 泄露

## 五、沙箱 sandbox

沙箱在操作系统层面限制 Claude 的行为，比权限系统更底层。

```
"sandbox": {
  "enabled": true,
  "filesystem": {
    "allowWrite": ["./src", "./tests", "/tmp/build"],
    "denyWrite": ["/etc", "/usr/local/bin", "~/.ssh"],
    "denyRead": ["~/.aws/credentials", "~/.kube/config"],
    "allowRead": ["."]
  },
  "network": {
    "allowedDomains": ["github.com", "*.npmjs.org", "pypi.org"],
    "allowUnixSockets": ["/var/run/docker.sock"],
    "allowLocalBinding": true
  }
}
```

### 5.1 filesystem — 文件系统限制

| 属性         | 类型     | 说明                 |
| ------------ | -------- | -------------------- |
| `allowWrite` | string[] | 允许写入的目录白名单 |
| `denyWrite`  | string[] | 禁止写入的目录黑名单 |
| `allowRead`  | string[] | 允许读取的目录白名单 |
| `denyRead`   | string[] | 禁止读取的目录黑名单 |

### 5.2 network — 网络限制

| 属性                | 类型     | 说明                               |
| ------------------- | -------- | ---------------------------------- |
| `allowedDomains`    | string[] | 允许访问的域名白名单（支持通配符） |
| `allowUnixSockets`  | string[] | 允许连接的 Unix Socket             |
| `allowLocalBinding` | boolean  | 是否允许本地端口绑定               |

据官方数据，开启沙箱可减少约 **84%** 的权限弹窗。

## 六、钩子 hooks

Hooks 允许在特定事件发生时自动执行自定义逻辑，分为两种类型：`command`（执行脚本）和 `prompt`（注入提示词）。

```
"hooks": {
  "PreToolUse": [
    {
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Check if file path contains .env or secrets. If so, return 'deny'."
        }
      ]
    }
  ],
  "SessionStart": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/load-context.sh"
        }
      ]
    }
  ]
}
```

### 6.1 支持的钩子事件

| 事件               | 触发时机         | 典型用途             |
| ------------------ | ---------------- | -------------------- |
| `PreToolUse`       | 工具执行前       | 安全检查、参数校验   |
| `PostToolUse`      | 工具执行后       | 日志记录、结果验证   |
| `Notification`     | 发送通知时       | 自定义通知渠道       |
| `Stop`             | Agent 考虑停止时 | 完整性检查           |
| `SubagentStop`     | 子代理完成时     | 任务验证             |
| `UserPromptSubmit` | 用户提交输入时   | 上下文注入、输入验证 |
| `SessionStart`     | 会话开始时       | 加载上下文、设置环境 |
| `SessionEnd`       | 会话结束时       | 清理、日志归档       |
| `PreCompact`       | 上下文压缩前     | 保留关键信息         |

### 6.2 钩子结构

| 字段              | 类型   | 说明                                               |
| ----------------- | ------ | -------------------------------------------------- | ---------------- | ------ |
| `matcher`         | string | 匹配的工具名，用 `                                 | `分隔，如`"Write | Edit"` |
| `hooks[].type`    | string | `"command"`（执行脚本）或 `"prompt"`（注入提示词） |
| `hooks[].command` | string | type=command 时，要执行的命令                      |
| `hooks[].prompt`  | string | type=prompt 时，注入的提示词内容                   |

### 6.3 钩子可用环境变量

| 变量                  | 说明                                  |
| --------------------- | ------------------------------------- |
| `$CLAUDE_PROJECT_DIR` | 项目根目录                            |
| `$CLAUDE_PLUGIN_ROOT` | 插件目录                              |
| `$CLAUDE_ENV_FILE`    | SessionStart 专用：持久化环境变量文件 |
| `$CLAUDE_CODE_REMOTE` | 是否远程运行                          |

## 七、插件 enabledPlugins

```
"enabledPlugins": {
  "code-review@claude-plugins-official": false,
  "security-guidance@claude-plugins-official": true
}
```

| 格式                       | 说明                      |
| -------------------------- | ------------------------- |
| `"插件名@发布源": boolean` | `true` 启用，`false` 禁用 |

官方插件示例：

| 插件                                        | 说明         |
| ------------------------------------------- | ------------ |
| `code-review@claude-plugins-official`       | 代码审查插件 |
| `security-guidance@claude-plugins-official` | 安全指导插件 |

## 八、MCP 服务器配置

| 属性                         | 类型     | 默认值  | 说明                                             |
| ---------------------------- | -------- | ------- | ------------------------------------------------ |
| `enableAllProjectMcpServers` | boolean  | `false` | 是否自动启用 `.mcp.json` 中定义的所有 MCP Server |
| `enabledMcpjsonServers`      | string[] | `[]`    | 选择性启用的 MCP Server 名称列表                 |
| `disabledMcpjsonServers`     | string[] | `[]`    | 选择性禁用的 MCP Server 名称列表                 |

### 优先级

`disabledMcpjsonServers` > `enabledMcpjsonServers` > `enableAllProjectMcpServers`

即：即使全局启用了，被 disabled 列表命中的仍会被禁用。

### 示例

```
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["apifox", "context7"],
  "disabledMcpjsonServers": ["filesystem"]
}
```

## 九、其他配置

| 属性                    | 类型    | 默认值   | 说明                                              |
| ----------------------- | ------- | -------- | ------------------------------------------------- |
| `includeCoAuthoredBy`   | boolean | `true`   | git commit 是否添加 `Co-authored-by: Claude` 署名 |
| `forceLoginMethod`      | string  | —        | 限制登录方式：`"claudeai"` / `"console"`          |
| `preferredNotifChannel` | string  | 系统默认 | 通知渠道，如 `"iterm2_with_bell"`（仅全局）       |

## 十、settings.json vs settings.local.json 分配指南

| 配置项                              | settings.json | settings.local.json |
| ----------------------------------- | ------------- | ------------------- |
| `permissions.defaultMode`           | ✅ 团队统一   | ✅ 个人覆盖         |
| `permissions.allow`                 | ✅ 团队共识   | ✅ 个人放宽         |
| `permissions.deny`                  | ✅ 团队红线   | ⚠️ 谨慎覆盖         |
| `permissions.ask`                   | ✅ 团队策略   | ✅ 个人调整         |
| `permissions.additionalDirectories` | ✅ 项目级     | ✅ 个人目录         |
| `model`                             | ✅ 项目统一   | ✅ 个人切换         |
| `env`（含 Token）                   | ❌            | ✅ 仅本地           |
| `env`（非敏感）                     | ✅            | ✅                  |
| `hooks`                             | ✅ 项目级     | ✅ 个人             |
| `enabledPlugins`                    | ✅ 团队       | ✅ 个人             |
| `sandbox`                           | ✅ 项目级     | ✅                  |
| `enableAllProjectMcpServers`        | ✅            | ✅                  |
| `enabledMcpjsonServers`             | ✅            | ✅                  |
| `language`                          | ✅            | ✅                  |
| `alwaysThinkingEnabled`             | ✅            | ✅                  |
| `effortLevel`                       | ✅            | ✅                  |
| `theme` / `autoUpdates` / `verbose` | —             | ✅ 仅全局           |
| `skipDangerousModePermissionPrompt` | ✅            | ✅                  |
| `disableBypassPermissionsMode`      | ✅ 企业策略   | ✅                  |
| `includeCoAuthoredBy`               | ✅            | ✅                  |
| `forceLoginMethod`                  | —             | ✅ 仅全局           |

## 附录：CLI 快捷操作

```
# 查看当前所有配置
claude config list

# 读取单个配置
claude config get model

# 设置配置（项目级）
claude config set model "claude-sonnet-4-6"
claude config set defaultMode "acceptEdits"
claude config set enableAllProjectMcpServers true
# 追加列表型配置
claude config add enabledMcpjsonServers apifox
claude config add env DEV=1

# 移除列表项
claude config remove enabledMcpjsonServers apifox

# 全局配置（加 -g 或 --global）
claude config set -g theme dark
claude config set -g autoUpdates false
claude config set -g verbose true

# 交互式配置向导
claude config
```
