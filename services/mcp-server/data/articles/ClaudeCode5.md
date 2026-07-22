---
title: MCP实战指南：从协议原理到5大服务配置
slug: claude-code-mcp-guide
date: 2024-06-01
tags: [Claude Code, MCP, 工具集成]
---

# Claude Code MCP 实战指南：从协议原理到 5 大服务配置

MCP 不是什么新概念——它解决的是 AI 编程工具最核心的痛点：**如何让 LLM 真正连上你的工具链**。本文从 MCP 协议基础讲起，结合 Figma、Playwright、Context7、Pixso、Apifox 五大真实服务配置，手把手带你搭建完整的 Claude Code 工具生态。

## 一、MCP 是什么？为什么你需要它？

### 1.1 一句话定义

**MCP（Model Context Protocol）** 是一个开放标准协议，定义了 LLM 如何与外部系统通信。官方的比喻很精准——MCP 就是 **"AI 应用的 USB-C 接口"**。

在 USB-C 出现之前，每台设备都有专属充电线：iPhone 用 Lightning，安卓用 micro-USB，相机用私有接口。MCP 出现之前也一样：Google Drive 需要写一套集成代码，Slack 需要另一套，Figma 又是单独一套。MCP 统一了这些连接方式，一个协议搞定所有。

### 1.2 MCP 解决了什么问题？

没有 MCP 的 Claude Code：

```
你：帮我检查一下这个页面的交互流程
Claude：我没有浏览器，帮不了你
你：帮我看下 Apifox 里这个接口的字段
Claude：我访问不了你的 API 文档平台
你：帮我查下这个组件库的最新用法
Claude：我的知识有截止日期，可能不是最新的
```

有了 MCP 之后：

```
你：帮我用 Playwright 检查登录流程
Claude：✅ 已打开页面，点击登录按钮，输入账号密码...页面跳转成功

你：帮我查看 Apifox 中获取文章列表的接口详情
Claude：✅ 接口路径 /v1/article/list，支持分页查询，返回字段包括...

你：帮我查下 MobX 最新版本的推荐用法
Claude：✅ Context7 返回 MobX 6.x 的 observable 最佳实践...
```

**核心价值：MCP 把 Claude Code 从"只会写代码的文本模型"变成"能操作你工具链的编程搭档"。**

### 1.3 MCP 的三大能力

| 能力          | 说明             | 典型场景                         |
| ------------- | ---------------- | -------------------------------- |
| **Resources** | 访问外部数据源   | 读取数据库、文件系统、API 文档   |
| **Tools**     | 调用外部工具函数 | 浏览器操作、API 调用、设计稿解析 |
| **Prompts**   | 可复用的提示模板 | 带上下文的标准化提示词           |

## 二、MCP 架构与通信机制

### 2.1 核心架构

MCP 采用经典的 **Client-Server** 架构：

```
┌─────────────────────────────────────┐
│ MCP Host（Claude Code） │
│ │
│ ┌──────────┐ ┌──────────┐ │
│ │MCP Client│ │MCP Client│ │
│ └────┬─────┘ └────┬─────┘ │
└────────┼───────────────┼───────────┘
 │ │
 Transport Layer Transport Layer
    (stdio/HTTP)     (stdio/HTTP)
 │ │
┌────────▼───────┐ ┌─────▼──────────┐
│ MCP Server │ │ MCP Server │
│ (Playwright) │ │ (Apifox) │
└────────────────┘ └────────────────┘
```

关键点：

- **Host** 就是 Claude Code 自身

- 每个 MCP Server 对应一个独立的 MCP Client，1:1 连接

- 通信协议使用 **JSON-RPC 2.0**

- 支持 **stdio**（本地进程）和 **HTTP**（远程服务）两种传输方式

### 2.2 两种传输方式对比

| 维度           | stdio                | HTTP                   |
| -------------- | -------------------- | ---------------------- |
| **工作方式**   | 启动本地子进程       | 请求远程 HTTP 端点     |
| **配置关键字** | `command` + `args`   | `type: "http"` + `url` |
| **适用场景**   | npm 包安装的本地工具 | 云端托管的 SaaS 服务   |
| **网络要求**   | 无需外网             | 需要网络连接           |
| **典型代表**   | Playwright、Context7 | Figma MCP、Pixso MCP   |
| **启动速度**   | 首次需下载，后续缓存 | 即开即用               |

## 三、配置文件体系：三层作用域

MCP 配置有三个作用域，优先级从高到低：

### 3.1 Local（本地私有）

- **存储位置**：`~/.claude.json`（项目路径下）

- **用途**：个人实验、临时调试、含敏感 token 的服务

- **特点**：不提交 Git，仅自己可见

```
# CLI 添加方式
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

### 3.2 Project（项目共享）⭐ 推荐

- **存储位置**：项目根目录 `.mcp.json`

- **用途**：团队共享的工具配置

- **特点**：提交 Git，全员一致；首次使用需确认授权

```
# CLI 添加方式
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

### 3.3 User（用户全局）

- **存储位置**：`~/.claude.json`（全局区域）

- **用途**：跨项目通用的个人工具

- **特点**：所有项目都能用

### 3.4 优先级规则

**Local > Project > User**

同一服务名在多层配置时，高优先级覆盖低优先级。

### 3.5 .mcp.json 文件格式

```json
{
  "mcpServers": {
    "server-name": {
      // HTTP 方式
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": { "Authorization": "Bearer xxx" }
    },
    "another-server": {
      // stdio 方式
      "command": "npx",
      "args": ["-y", "some-mcp-server@latest"],
      "env": { "API_KEY": "your_key" }
    }
  }
}
```

**环境变量扩展**：`.mcp.json` 支持 `${VAR}` 语法引用环境变量，避免硬编码密钥：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 3.6 常用管理命令

```
# 查看所有 MCP 服务状态
/mcp

# 添加 HTTP 类型服务
claude mcp add --transport http <name> <url>

# 添加 stdio 类型服务
claude mcp add --transport stdio <name> -- npx -y <package>

# 删除服务
claude mcp remove <name>

# 重启所有 MCP 服务
claude mcp restart

# 重置项目级 MCP 授权选择
claude mcp reset-project-choices
```

## 四、实战：5 大 MCP 服务配置详解

以下是基于真实项目 `.mcp.json` 的完整配置，逐个拆解每个服务的用途、配置要点和实战用法。

### 完整配置总览

```json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--headless"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "pixso": {
      "type": "http",
      "url": "http://127.0.0.1:3667/mcp",
      "headers": {}
    },
    "apifox": {
      "command": "npx",
      "args": ["-y", "apifox-mcp-server@latest", "--project-id=8010949"],
      "env": {
        "APIFOX_ACCESS_TOKEN": "your_apifox_access_token_here"
      }
    }
  }
}
```

### 4.1 Figma MCP —— 设计稿直出代码

**服务类型**：HTTP（云端托管）

**解决痛点**：设计师出完稿，前端还得对着 Figma 手动量间距、猜颜色、抄文案？Figma MCP 让 Claude Code 直接读取设计稿的节点信息，生成代码。

**配置解析**：

```json
"figma": {
  "type": "http",
  "url": "https://mcp.figma.com/mcp"
}
```

- `type: "http"` — 云端服务，无需本地安装

- 无需 `env`，Figma MCP 通过 OAuth 认证（首次连接时 Claude Code 会引导授权）

**实战用法**：

```
帮我根据这个 Figma 设计稿生成登录页代码：
https://www.figma.com/design/xxxxx/Login-Page

要求：
- 750 设计稿宽度
- 字体、颜色、间距与设计稿一致
- 所有设计稿上的元素都必须存在
```

**注意事项**：

- 首次使用需通过 `/mcp` 完成 OAuth 授权

- 设计稿链接必须是你有权限访问的文件

### 4.2 Playwright MCP —— 浏览器自动化

**服务类型**：stdio（本地进程）

**解决痛点**：Claude Code 写完代码，怎么验证？手动开浏览器测？Playwright MCP 让 Claude Code 自己打开浏览器、点击按钮、截图对比，实现闭环验证。

**配置解析**：

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest", "--headless"]
}
```

- `command: "npx"` — 使用 npx 运行，无需全局安装

- `-y` — 自动确认安装，避免交互阻塞

- `@playwright/mcp@latest` — 始终使用最新版

- `--headless` — 无头模式，不弹出浏览器窗口（服务器/CIT 环境必需）

**实战用法**：

```
帮我使用 Playwright MCP 验证登录页面流程：
1. 打开 http://localhost:3000/login
2. 输入账号 admin@test.com
3. 输入密码 123456
4. 点击登录按钮
5. 截图确认跳转到首页
```

**进阶场景**：

```
帮我用 Playwright 对比当前页面和设计稿的差异
帮我验证 H5 页面在移动端视口下的交互是否正常
帮我截图记录当前页面的 UI 状态
```

**注意事项**：

- 首次调用会自动下载 Chromium，需要等待

- `--headless` 模式下无法调试视觉问题，开发阶段可去掉该参数

- 需要 `permissions.allow` 中配置 `mcp__playwright__*` 权限

### 4.3 Context7 MCP —— 第三方库上下文增强

**服务类型**：stdio（本地进程）

**解决痛点**：LLM 的知识有截止日期，对最新版本的库用法可能过时或幻觉。Context7 实时查询第三方库的官方文档，给 Claude Code 补充准确的上下文。

**配置解析**：

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

- 无需 API Key，开箱即用

- 查询结果来自库的官方文档源，不是二手博客

**实战用法**：

```
帮我通过 Context7 查询 React 19 的 useActionState 最新用法
帮我查下 MobX 6.x 中 observable 和 action 的推荐写法
帮我查下 NestJS 11 中新的事件监听装饰器怎么用
```

**最佳实践**：

- 涉及 **版本升级** 或 **新 API** 时，主动让 Claude Code 走 Context7 查询

- 配合 `@latest` 标签确保拿到最新文档

- 对于稳定不变的基础 API（如 `Array.map`），没必要调 Context7

### 4.4 Pixso MCP —— 国产设计稿工具集成

**服务类型**：HTTP（本地服务）

**解决痛点**：团队用 Pixso 管理设计稿时，需要 Claude Code 直接读取设计稿节点，生成前端代码。和 Figma MCP 类似，但对接的是 Pixso 生态。

**配置解析**：

```json
"pixso": {
  "type": "http",
  "url": "http://127.0.0.1:3667/mcp",
  "headers": {}
}
```

- `url: "http://127.0.0.1:3667/mcp"` — **注意这是本地地址**，不是云端服务

- 这意味着你需要先在本地启动 Pixso MCP 服务（通常通过 Pixso 客户端或插件启动）

- `headers: {}` — 当前无额外认证头，后续按需补充

**实战用法**：

```
使用 Pixso 的 MCP 服务，根据设计稿生成前端页面代码：
https://pixso.cn/app/design/HxbGTl-K7eLdXMJQUV3YCg?item-id=1:137

功能需求：
- 根据 750 设计稿宽度生成代码
- 字体、颜色、间距与设计稿一致

强制工作流程：
1. 打印完整节点树结构，每个节点显示尺寸/位置/颜色/文字
2. 对照树结构，列出所有需要实现的元素
3. 写完后，再次对照树结构逐一检查
```

**注意事项**：

- 使用前确保 Pixso MCP 本地服务已启动（端口 3667）

- 如果连接失败，先检查本地服务是否运行：`curl http://127.0.0.1:3667/mcp`

- 需要 `permissions.allow` 中配置 `mcp__pixso__*` 权限

### 4.5 Apifox MCP —— API 文档实时集成

**服务类型**：stdio（本地进程 + 环境变量鉴权）

**解决痛点**：前后端对接时，接口文档散落在 Apifox 平台上。传统做法是导出 JSON 文件、手动解析。Apifox MCP 让 Claude Code 直接查询接口列表和详情，甚至自动生成前端 service 代码。

**配置解析**：

```json
"apifox": {
  "command": "npx",
  "args": ["-y", "apifox-mcp-server@latest", "--project-id=8010949"],
  "env": {
    "APIFOX_ACCESS_TOKEN": "your_apifox_access_token_here"
  }
}
```

- `--project-id=8010949` — 指定 Apifox 项目 ID，只访问这个项目的接口数据

- `env.APIFOX_ACCESS_TOKEN` — **必须配置**，用于 Apifox API 鉴权

- ⚠️ **Token 安全**：真实 token 禁止提交到 Git，推荐使用环境变量替换：

```json
"env": {
  "APIFOX_ACCESS_TOKEN": "${APIFOX_ACCESS_TOKEN}"
}
```

然后在 `.claude/settings.local.json` 或系统环境变量中设置真实值。

**实战用法**：

**场景一：查看接口列表**

```
帮我查看 Apifox MCP 服务中的接口列表
```

**场景二：查询接口详情 + 生成代码**

```
帮我查看 Apifox MCP 中的获取文章列表接口详情以及对应的字段类型，
帮我在前端定义接口，给我方案和理由，让我审查
```

**场景三：批量生成 Service 层**

```
帮我查看 Apifox 中的用户模块所有接口，批量生成前端 service 类型定义和请求函数
```

**工作流总结**：

```
查看接口列表 → 查询接口详情 → 生成前端 service/API 类型定义
```

**注意事项**：

- Token 必须有对应项目的访问权限

- `--project-id` 参数是必填的，否则 MCP 不知道查哪个项目

- 如果接口列表返回为空，检查 token 权限和项目 ID 是否正确

## 五、settings.json 中的 MCP 权限配置

MCP 服务添加后，还需要在 `settings.json` 中配置权限，Claude Code 才能自动调用 MCP 工具，而不是每次都问你。

### 5.1 项目级配置（.claude/settings.json）

```json
{
  "permissions": {
    "allow": ["Read", "Bash(ls *)", "Bash(cat *)", "Bash(git status)", "Bash(git diff *)"],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Read(./.env*)",
      "Read(./secrets/**)"
    ],
    "ask": ["Bash(git push *)", "Bash(npm install *)"],
    "defaultMode": "acceptEdits"
  }
}
```

### 5.2 本地配置（.claude/settings.local.json）

MCP 工具权限建议放在本地配置中：

```json
{
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

关键配置项：

| 配置项                       | 说明                                         |
| ---------------------------- | -------------------------------------------- |
| `enableAllProjectMcpServers` | 一键启用 `.mcp.json` 中所有服务              |
| `mcp__{server}__{tool}`      | 精细控制某个 MCP 服务的某个工具权限          |
| `enabledMcpjsonServers`      | 指定启用的 MCP 服务白名单（空数组=全部启用） |

## 六、MCP 安全最佳实践

### 6.1 Token 管理

```
❌ 错误做法：直接把 token 写进 .mcp.json 并提交 Git
✅ 正确做法：
 - .mcp.json 用 ${ENV_VAR} 引用环境变量
 - 真实 token 放在 .claude/settings.local.json（不提交 Git）
 - 或放在系统环境变量中
```

### 6.2 权限最小化

```json
// 不要一股脑全开
"allow": ["Bash(*)", "mcp__*"]  // ❌ 太宽泛

// 按需开放
"allow": [
  "mcp__playwright__browser_navigate",
  "mcp__playwright__browser_click",
  "mcp__apifox__list_api_endpoints"
]  // ✅ 精确控制
```

### 6.3 高危命令防护

```json
"deny": [
  "Bash(rm -rf *)",    // 防误删
  "Bash(sudo *)",      // 防提权
  "Bash(curl *)",      // 防数据外泄
  "Read(./.env*)",     // 防敏感文件泄露
  "WebFetch"           // 防任意网络请求
]
```

### 6.4 .gitignore 必加项

```
.claude/settings.local.json
.mcp.json # 如果包含 token，不应提交
# 如果 .mcp.json 使用了环境变量替代，可以提交
```

## 七、常见问题排查

### Q1：MCP 服务连接失败

```
# 1. 检查服务状态
/mcp

# 2. 重启所有 MCP 服务
claude mcp restart

# 3. 重置授权（项目级服务首次使用需要确认）
claude mcp reset-project-choices
```

### Q2：stdio 类型服务启动慢

首次使用 `npx -y @xxx/mcp@latest` 时，需要下载 npm 包。后续会走缓存，速度正常。如果下载超时，可以手动预安装：

```
npm install -g @playwright/mcp@latest
npm install -g @upstash/context7-mcp@latest
npm install -g apifox-mcp-server@latest
```

### Q3：Pixso MCP 连接不上

```
错误：Error connecting to http://127.0.0.1:3667/mcp

排查步骤：
1. 确认 Pixso 客户端是否已启动
2. 确认 3667 端口是否被占用：lsof -i :3667
3. 手动测试连接：curl http://127.0.0.1:3667/mcp
```

### Q4：Apifox MCP 返回空数据

```
排查步骤：
1. 确认 project-id 是否正确
2. 确认 token 是否有该项目的访问权限
3. 在 Apifox 网页端手动检查项目是否有接口数据
```

### Q5：MCP 工具调不通，权限报错

在 `.claude/settings.local.json` 的 `permissions.allow` 中添加对应的 MCP 工具权限：

```json
"allow": [
  "mcp__playwright__browser_navigate",
  "mcp__playwright__browser_click",
  "mcp__playwright__browser_screenshot",
  "mcp__context7__resolve-library-id",
  "mcp__context7__get-library-docs",
  "mcp__apifox__list_api_endpoints",
  "mcp__apifox__get_api_endpoint_detail"
]
```

或者直接开启全部项目 MCP 服务：

```json
"enableAllProjectMcpServers": true
```

## 八、总结

MCP 是 Claude Code 从"代码补全工具"升级为"全栈编程搭档"的关键基础设施。配置好 MCP 之后，Claude Code 就能：

| 能力       | 对应 MCP 服务 | 效果                                  |
| ---------- | ------------- | ------------------------------------- |
| 读取设计稿 | Figma / Pixso | 设计稿 → 前端代码，告别手动量尺寸     |
| 浏览器验证 | Playwright    | 写完代码自动验证，形成闭环            |
| 查最新文档 | Context7      | 实时查询库用法，告别过时知识          |
| 对接 API   | Apifox        | 接口文档 → Service 代码，告别手动搬砖 |

**核心配置原则**：

1. **团队共享的服务放 `.mcp.json`**（提交 Git）

2. **敏感 token 放环境变量**，不要硬编码

3. **权限最小化**，按需开放 MCP 工具

4. **高危命令 deny**，关键操作 ask
