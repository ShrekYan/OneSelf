---
title: 权限系统完全指南：从原理到实战配置
slug: claude-code-permission-system-guide
date: 2024-06-01
tags: [Claude Code, 权限系统, security]
---

# Claude Code 权限系统完全指南：从原理到实战配置

你的 AI 编程助手到底能不能自动删文件？能不能悄悄 `git push`？这篇文章带你彻底搞懂 Claude Code 的权限体系，并给出一份可直接落地的"黄金配置"。

## 一、权限系统到底在干嘛？

Claude Code 的权限系统本质上是一个**三层拦截模型**，每一次 Claude 想执行操作，都要依次过三道关卡：

**请求发出** → **deny 层** → **ask 层** → **allow 层** → **默认行为**

| 拦截层       | 匹配条件          | 结果             |
| ------------ | ----------------- | ---------------- |
| **deny 层**  | 在 deny 名单里？  | 直接拒绝         |
| **ask 层**   | 在 ask 名单里？   | 弹窗确认         |
| **allow 层** | 在 allow 名单里？ | 自动通过         |
| **默认行为** | 都不在            | 根据当前模式决定 |

**优先级：deny > ask > allow > 默认行为** — 永远是 deny 优先。

关键原则：

- **deny 是硬拦截**：一旦匹配，绝无通融，哪怕你同时在 allow 里也写了——deny 优先级最高

- **ask 是软拦截**：不会拒绝你，但会暂停下来让你确认，适合有风险但有时确实要做的操作

- **allow 是白名单**：匹配到就放行，不需要任何交互

- **都不匹配时**：交给当前权限模式的默认行为处理

这套机制让 Claude Code 在"高效自动化"和"安全可控"之间找到了平衡点——高频操作不卡顿，危险操作有兜底。

## 二、五种权限模式：从"保姆模式"到"全自动"

Claude Code 内置了五种权限模式，通过 `defaultMode` 字段配置。不同模式决定了"三层拦截都没命中时"的兜底行为：

| 模式                     | 读文件  | 写文件     | 执行命令 | 适用场景                             |
| ------------------------ | ------- | ---------- | -------- | ------------------------------------ |
| **default**（默认）      | ✅ 自动 | ❓ 确认    | ❓ 确认  | 新手期，建立信任                     |
| **acceptEdits** ⭐       | ✅ 自动 | ✅ 自动 ✨ | ❓ 确认  | 日常开发主力模式                     |
| **plan**                 | ✅ 自动 | 🚫 禁止    | 🚫 禁止  | 探索不熟悉的代码库，只出方案不动手   |
| **dontAsk**              | ✅ 自动 | ✅ 自动    | ✅ 自动  | 熟练后的高信任场景，但不跳过安全检查 |
| **bypassPermissions** ⚠️ | ✅ 全部 | ✅ 全部    | ✅ 全部  | 仅限 Docker 容器内，相当于 sudo      |

### 模式选择建议

| 你的状态           | 推荐模式            | 理由                                    |
| ------------------ | ------------------- | --------------------------------------- |
| 刚接触 Claude Code | `default`           | 先观察它怎么工作，建立直觉              |
| 日常开发           | `acceptEdits`       | 写代码不卡，跑命令有确认，性价比最高    |
| 在陌生项目里调研   | `plan`              | 只看不改，避免误操作                    |
| 熟悉后想提速       | `dontAsk`           | 配合精细的 allow/deny，实现自动化流水线 |
| Docker CI 环境     | `bypassPermissions` | 容器内无敏感数据，全放行没问题          |

**个人推荐**：大部分时间用 `acceptEdits`，配合精心配置的 allow/deny 名单，体验最好。

## 三、配置文件层级：谁说了算？

Claude Code 的权限配置分布在三个层级，越具体的优先级越高：

| 层级 | 文件位置                      | 作用                   | 提交 Git  |
| ---- | ----------------------------- | ---------------------- | --------- |
| 全局 | `~/.claude/settings.json`     | 所有项目通用的底线要求 | —         |
| 项目 | `.claude/settings.json`       | 团队共享的项目专属规则 | ✅ 建议   |
| 本地 | `.claude/settings.local.json` | 个人偏好，不影响队友   | ❌ 不建议 |

**优先级：local > project > global** — 越具体的配置，优先级越高。

**核心逻辑**：

- **项目级 settings.json** 写团队共识的规则，提交到仓库后全组统一执行

- **settings.local.json** 放你自己的 token、MCP 开关等个人配置，`.gitignore` 里排除

- **全局配置** 管你所有项目的最低底线

## 四、项目级 settings.json 配置实战

下面是一份经过生产验证的 `.claude/settings.json` 配置，逐项拆解：

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(head *)",
      "Bash(tail *)",
      "Bash(wc *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Bash(echo *)",
      "Bash(mkdir *)",
      "Bash(git status)",
      "Bash(git log *)",
      "Bash(git diff *)",
      "Bash(git branch *)",
      "Bash(git show *)",
      "Bash(node --version)",
      "Bash(npm --version)",
      "Bash(npx tsc --noEmit)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Read(./.env*)",
      "Read(./secrets/**)",
      "Read(./**/credentials*)",
      "Edit(./.env*)",
      "Edit(./secrets/**)",
      "WebFetch"
    ],
    "ask": ["Bash(git push *)", "Bash(npm install *)"],
    "defaultMode": "acceptEdits"
  },
  "model": "ark-code-latest",
  "hooks": {},
  "enabledPlugins": {
    "code-review@claude-plugins-official": false,
    "security-guidance@claude-plugins-official": true
  },
  "language": "chinese",
  "alwaysThinkingEnabled": true,
  "effortLevel": "medium"
}
```

### 4.1 allow：让它丝滑跑起来

| 规则                                          | 设计意图                               |
| --------------------------------------------- | -------------------------------------- |
| `Read`                                        | 读任何文件，这是最基础的操作，必须放行 |
| `Bash(ls/cat/head/tail/wc/find/grep/echo *)`  | 只读类系统命令，不会改任何东西         |
| `Bash(mkdir *)`                               | 创建目录，不危险                       |
| `Bash(git status/log/diff/branch/show *)`     | Git 查看类操作，只看不推               |
| `Bash(node --version)`, `Bash(npm --version)` | 环境检查                               |
| `Bash(npx tsc --noEmit)`                      | 类型检查，只读不写                     |

**原则**：把高频、无副作用、日常反复执行的操作都放进 allow，减少交互打断。

### 4.2 deny：绝对红线

| 规则                           | 设计意图                                 |
| ------------------------------ | ---------------------------------------- |
| `Bash(rm -rf *)`               | 递归删除，一旦误执行不可挽回             |
| `Bash(sudo *)`                 | 提权操作，不应由 AI 自动触发             |
| `Bash(curl *)`, `Bash(wget *)` | 对外请求，可能泄露数据或触发外部副作用   |
| `Read(./.env*)`                | 环境变量文件含密钥，不该被随意读取       |
| `Read(./secrets/**)`           | secrets 目录同理                         |
| `Read(./**/credentials*)`      | 凭证文件，跨目录拦截                     |
| `Edit(./.env*)`                | 环境文件只读不写，防止篡改               |
| `Edit(./secrets/**)`           | secrets 目录禁止编辑                     |
| `WebFetch`                     | 禁止 Claude 自行抓取网页，避免不可控行为 |

**原则**：deny 是最后一道防线，宁可误杀也不放过。`rm -rf`、`sudo`、凭证访问这类操作，**任何场景下都不应该由 AI 自主执行**。

### 4.3 ask：让我知道一声

| 规则                  | 设计意图                                   |
| --------------------- | ------------------------------------------ |
| `Bash(git push *)`    | 推代码到远程，影响别人，必须确认           |
| `Bash(npm install *)` | 安装依赖会改 `package-lock.json`，影响团队 |

**原则**：ask 里的操作"有时要做，但不能偷偷做"。弹窗确认的成本很低，误操作的代价很高。

### 4.4 其他配置项

| 配置项                  | 值                        | 说明                                    |
| ----------------------- | ------------------------- | --------------------------------------- |
| `model`                 | `ark-code-latest`         | 项目默认使用的模型                      |
| `hooks`                 | `{}`                      | 生命周期钩子，当前未配置                |
| `enabledPlugins`        | `security-guidance: true` | 开启安全指导插件，关闭 code-review 插件 |
| `language`              | `chinese`                 | 中文交互                                |
| `alwaysThinkingEnabled` | `true`                    | 始终开启思考模式，让 Claude 先想再答    |
| `effortLevel`           | `medium`                  | 思考强度中等，平衡速度和深度            |

## 五、本地 settings.local.json：你的私人配置

本地配置主要放两类东西：**敏感凭证** 和 **个人偏好**。

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_auth_token_here",
    "ANTHROPIC_BASE_URL": "your_base_url_here",
    "ANTHROPIC_MODEL": "ark-code-latest"
  },
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(*)",
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

### 5.1 环境变量：token 和 baseUrl

| 变量                   | 说明                                   |
| ---------------------- | -------------------------------------- |
| `ANTHROPIC_AUTH_TOKEN` | 模型鉴权 Token，**绝对不能提交到 Git** |
| `ANTHROPIC_BASE_URL`   | 自定义 API 端点，适合用代理或自建服务  |
| `ANTHROPIC_MODEL`      | 覆盖项目级模型配置                     |

### 5.2 本地权限：更宽松的个人规则

注意本地配置的权限比项目级更宽松：

- `Bash(*)`：本地放行所有命令——因为你在本地更信任自己的环境

- `Write`, `Edit`：本地允许写入和编辑——开发时需要频繁修改文件

- MCP 工具权限：`mcp__pixso__design_to_code`、`mcp__duckduckgo-search__search`

**这不矛盾**：项目级配置是团队共识的"下限"，本地配置是你个人的"上限"。优先级 local > project，所以本地更宽松时，以本地为准。

### 5.3 MCP 相关开关

| 配置项                       | 说明                                         |
| ---------------------------- | -------------------------------------------- |
| `enableAllProjectMcpServers` | 是否启用 `.mcp.json` 中定义的所有 MCP Server |
| `enabledMcpjsonServers`      | 选择性启用的 MCP Server 列表                 |

## 六、两份配置的关系与协作

项目级 `settings.json` 和本地 `settings.local.json` 不是替代关系，而是**互补关系**：

**settings.json（项目级）**

- 团队共识的权限底线

- deny 名单：所有人都要遵守的红线

- ask 名单：团队统一的确认策略

- ✅ 提交 Git，团队共享

**settings.local.json（本地）**

- 个人环境变量（Token、BaseURL）

- 个人偏好的宽松权限

- MCP 工具的个人授权

- ❌ 不提交 Git，仅本地生效

**合并规则：**

- `permissions`：local 覆盖 project（同名 key 替换）

- `env`：仅 local 生效

- 其他配置：local 优先，无则 fallback 到 project

**实操建议**：

1. **先定项目级**：团队讨论出 deny 和 ask 名单，写入 `settings.json` 并提交

2. **再补本地**：每个人按自己的环境补上 token、MCP 开关，写入 `settings.local.json`

3. **确保 `.gitignore` 包含**：`settings.local.json`，避免 token 泄露

## 七、权限配置的常见坑

### 坑 1：allow 和 deny 同时匹配

```json
// ❌ 错误示例
{
  "allow": ["Bash(rm *)"],
  "deny": ["Bash(rm -rf *)"]
}
```

`Bash(rm -rf /tmp/cache)` 同时命中 allow 和 deny，但因为 **deny 优先级最高**，最终被拒绝。这是正确行为——但别依赖这个，最好直接从 allow 里删掉 `Bash(rm *)`。

### 坑 2：通配符范围过大

```json
// ⚠️ 危险示例
"allow": ["Bash(*)"]    // 放行所有命令，等于没有权限系统
"deny": ["Bash(*)"]     // 禁止所有命令，Claude 什么都做不了
```

通配符 `*` 要谨慎使用，尽量精确到具体命令和参数。

### 坑 3：敏感文件路径匹配

```json
// ✅ 正确写法：覆盖多种 .env 变体
"deny": [
  "Read(./.env*)",          // 匹配 .env、.env.local、.env.production
  "Read(./secrets/**)",     // 匹配 secrets 目录下所有文件
  "Read(./**/credentials*)" // 匹配任意层级的 credentials 文件
]
```

### 坑 4：把 Token 写进了项目级配置

```json
// ❌ 绝对不要这样做
// .claude/settings.json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-ant-real-token-here"
  }
}
```

Token 只能放 `settings.local.json`，且必须加入 `.gitignore`。

## 八、一套完整的权限配置模板

综合上面的分析，给出一套可直接复用的模板：

### 项目级 .claude/settings.json

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit(./src/**)",
      "Write(./src/**)",
      "MultiEdit(./src/**)",
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(npx tsc --noEmit)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git log *)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(mkdir *)"
    ],
    "ask": ["Bash(git push *)", "Bash(npm install *)", "Bash(npx prisma migrate *)"],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(curl *)",
      "Read(./.env*)",
      "Read(./secrets/**)",
      "Edit(./.env*)",
      "WebFetch"
    ],
    "defaultMode": "acceptEdits"
  }
}
```

### 本地 .claude/settings.local.json

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_auth_token_here",
    "ANTHROPIC_BASE_URL": "your_base_url_here",
    "ANTHROPIC_MODEL": "ark-code-latest"
  },
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(*)",
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

### .gitignore 补充

```bash
# Claude Code 本地配置（含 Token）
.claude/settings.local.json
```

## 九、总结

Claude Code 的权限系统设计思路非常清晰：

1. **三层拦截**（deny → ask → allow → 默认行为）保证了安全性和灵活性的平衡

2. **五种模式**覆盖了从"刚上手"到"全自动"的所有场景

3. **三级配置**（global → project → local）实现了团队共识和个人偏好的分离

记住这几个核心原则：

- **deny 优先**：红线一旦划定，不可逾越

- **高频放行，低频确认**：allow 里放日常操作，ask 里放关键节点

- **敏感信息只放本地**：Token、密钥永远不进 Git

- **模式选 `acceptEdits`**：对开发者来说性价比最高

配好权限，Claude Code 才能真正做到"该快的时候丝滑，该慢的时候谨慎"。
