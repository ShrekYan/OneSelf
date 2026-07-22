---
title: 集成 YAPI MCP：给自建 YAPI 装上 AI 生产力引擎
slug: claude-code-yapi-mcp-integration
date: 2024-06-01
tags: [Claude Code, YAPI, MCP, API集成]
---

面向前端团队的实战笔记：把公司内网自建的开源 YAPI 通过社区维护的 [lzsheng/Yapi-MCP](https://github.com/lzsheng/Yapi-MCP) 接入 Claude Code，配合项目内的 `api-parser` Agent，实现"从内网接口文档到前端 Service 代码"的全链路自动化。

## 一、我们的背景

不同于外部 SaaS 化的接口平台，我们公司的接口管理体系有几个特点：

1. **YAPI 是自建的**：我们使用的是社区开源、内网私有化部署的 [YApi](https://github.com/YMFE/yapi)。所有接口文档都在公司内网，不能暴露到公网。

2. **YAPI 官方已停止维护**：这意味着任何"外挂能力"都得从社区找方案，不能指望官方给出 AI 集成。

3. **前端要频繁与接口对齐**：金融类移动端 H5 项目，接口数量多、迭代快，人肉复制 JSON 到 `service` 目录，效率低且容易出错。

在这样的背景下，我们的目标是：**不改动 YAPI 本身，只在开发者一侧接入 AI**，让 Claude Code 能直接读到内网 YAPI，并把接口自动落到项目 `src/service/` 目录里。

社区里目前比较活跃、能对接自建 YAPI 的 MCP 服务器是 [lzsheng/Yapi-MCP](https://github.com/lzsheng/Yapi-MCP)（npm 包名 `yapi-auto-mcp`），它同时支持 **stdio** 和 **SSE** 两种模式，多项目 Token 也是原生支持的，非常契合我们的诉求。

📌 **顺带一提：Apifox 也提供了官方 MCP 服务（付费）**

国内的 [Apifox](https://apifox.com/) 已经推出了官方 MCP Server，可以直接在 Cursor / Claude Code 里读写 Apifox 的接口文档，体验和稳定性都比社区方案好，但属于**商业化收费能力**（需要开通对应套餐）。如果团队本身用的就是 Apifox 而不是自建 YAPI，可以优先评估官方方案；本文之所以选社区方案，是因为我们的接口数据必须留在内网自建 YAPI 上，不能迁移到公网 SaaS。

## 二、整体架构

```
┌──────────────┐    自然语言    ┌──────────────────┐    MCP 协议    ┌──────────────┐
│  开发者电脑   │ ────────────▶ │   Claude Code    │ ────────────▶ │ 内网自建 YAPI │
│ （IDE / CLI）│                │  + api-parser    │ （stdio/SSE）  │ （HTTP API）   │
└──────────────┘                │     Agent        │                └──────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │ yapi-    │  │ Skills:  │  │         │
              │ auto-mcp │  │ core /   │  │         │
              │(lzsheng) │  │ normalizer│  │         │
              └──────────┘  │ /template│  │         │
                            │ /yapi-mcp│  │         │
                            └──────────┘  └──────────┘
                                   │
                                   │ 生成 / 追加
                                   ▼
                           ┌──────────────────┐
                           │   src/service/   │
                           │ ├─ interface/    │
                           │ └─ interfaceField/│
                           └──────────────────┘
```

三层职责：

- **社区 MCP Server（`yapi-auto-mcp`）**：桥接内网 YAPI 平台，暴露搜索 / 查询 / 保存等 MCP 工具。

- **项目内 api-parser Agent**：负责编排"识别 → 拉取 → 归一化 → 生成 → 校验"，并对社区 MCP 的能力做**白名单裁剪**。

- **Skills 能力包**：`api-parser-core / normalizer / template / yapi-mcp` 各司其职，由 Agent frontmatter `skills:` 预加载。

## 三、准备工作：用户级 MCP 配置

社区 MCP 项目 [`lzsheng/Yapi-MCP`](https://github.com/lzsheng/Yapi-MCP) 已发布到 npm，包名为 `yapi-auto-mcp`。推荐用 `npx` 方式接入，避免每台开发机单独安装。

我们把它写入 **用户级** `~/.claude/mcp.json`（多项目共享同一份内网 YAPI 凭据，避免 Token 提交到仓库）。有两种等价写法：

### 方式一：命令行参数（配置直观）

```json
{
  "mcpServers": {
    "yapi-auto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "yapi-auto-mcp",
        "--stdio",
        "--yapi-base-url=https://yapi.内网域名.com",
        "--yapi-token=28:xxxxxxxxxxxxxxxx,29:yyyyyyyyyyyyyyyy",
        "--yapi-cache-ttl=10",
        "--yapi-log-level=info"
      ]
    }
  }
}
```

### 方式二：环境变量（凭据与配置分离）

```json
{
  "mcpServers": {
    "yapi-auto-mcp": {
      "command": "npx",
      "args": ["-y", "yapi-auto-mcp", "--stdio"],
      "env": {
        "YAPI_BASE_URL": "https://yapi.内网域名.com",
        "YAPI_TOKEN": "28:xxxxxxxxxxxxxxxx,29:yyyyyyyyyyyyyyyy",
        "YAPI_CACHE_TTL": "10",
        "YAPI_LOG_LEVEL": "info"
      }
    }
  }
}
```

关键配置说明（源自项目 README）：

| 参数 / 环境变量    | 说明                                                     | 备注                                |
| ------------------ | -------------------------------------------------------- | ----------------------------------- |
| `--yapi-base-url`  | 自建 YAPI 的基础 URL                                     | 内网域名，直接填即可                |
| `--yapi-token`     | 项目 Token，格式 `projectId:token`，多项目用英文逗号分隔 | 从 YAPI 项目设置 → Token 配置里拿到 |
| `--stdio`          | 启用 stdio 模式                                          | Claude Code / Cursor 场景必须开启   |
| `--yapi-cache-ttl` | 查询缓存时效（分钟）                                     | 默认 10                             |
| `--yapi-log-level` | 日志级别：debug / info / warn / error / none             | 默认 info                           |

💡 **多项目 Token**：如果同时对接多个 YAPI 项目，用逗号拼接：`28:tokenA,29:tokenB`。Token 在 YAPI 项目设置页可以直接生成。

### 内网环境的两个细节

1. **npx 首次拉包**：`npx -y yapi-auto-mcp` 第一次运行会去 npm 拉包。如果开发机不能访问公网 npm，请配置公司 npm 私服镜像，或采用 README 中的**方式三：本地开发模式**（`git clone` → `pnpm install` → `node dist/cli.js --stdio`），在内网离线运行。

2. **SSE 模式的备选**：如果团队有统一部署 MCP 网关的需求，也可以启动 SSE 模式（默认端口 3388），Claude Code 一侧用 `"url": "http://localhost:3388/sse"` 接入，方便远程调试。

## 四、社区 MCP 的能力 vs 我们的白名单

`yapi-auto-mcp` 提供的 MCP 工具（截取自 README）：

| 工具                                      | 能力                         | 我们的策略        |
| ----------------------------------------- | ---------------------------- | ----------------- |
| `mcp__yapi-auto-mcp__yapi_list_projects`  | 列出可访问的 YAPI 项目       | ✅ 允许           |
| `mcp__yapi-auto-mcp__yapi_get_categories` | 拉取项目分类与接口列表       | ✅ 允许           |
| `mcp__yapi-auto-mcp__yapi_search_apis`    | 按名称 / 路径 / 标签搜索接口 | ✅ 允许           |
| `mcp__yapi-auto-mcp__yapi_get_api_desc`   | 获取接口详情（参数 / 响应）  | ✅ 允许           |
| `mcp__yapi-auto-mcp__yapi_save_api`       | **创建 / 更新** YAPI 接口    | ⛔ **本项目禁用** |

社区 MCP 本身是双向的，`yapi_save_api` 可以直接写回 YAPI。但在我们的项目里，为了防止 AI 误改接口定义、影响后端和其他前端，我们**只允许单向消费**——只读拉取，不写回。

这个约束是在 `.claude/agents/api-parser.md` 的 `tools:` 白名单里写死的：

```
tools: Read, Write, Edit, Glob, Bash,
       mcp__yapi-auto-mcp__yapi_list_projects,
       mcp__yapi-auto-mcp__yapi_get_categories,
       mcp__yapi-auto-mcp__yapi_search_apis,
       mcp__yapi-auto-mcp__yapi_get_api_desc
```

`yapi_save_api` 根本没出现在这个列表里，Agent 想调也调不到，从工具层堵死了误操作路径。

## 五、项目内的 api-parser Agent

`.claude/agents/api-parser.md` 是本项目专属的 API 解析 Agent，几个关键设计：

```yaml
---
name: api-parser
description: API 文档解析与前端服务代码自动生成，支持 Markdown/Swagger/YAPI/Apifox 多源解析
model: inherit
skills:
  - api-parser-core
  - api-parser-template
  - api-parser-normalizer
  - api-parser-yapi-mcp
---
```

- **多源解析**：不只 YAPI，还支持 Markdown 表格、Swagger、Apifox、Postman、自然语言描述——YAPI MCP 只是数据源之一。

- **Skills 预加载**：`skills:` 会在 Agent 启动时把 4 个能力包一起装入上下文，运行时不再需要额外 Read。

- **写死的红线**：
  - ❌ 禁止引入 TypeScript，全部使用纯 JavaScript

  - ❌ 禁止修改项目现有代码风格（必须 4 空格缩进）

  - ❌ 禁止删除任何现有导入或方法

## 六、一次完整的 YAPI → Service 生成流程

以"根据一条内网 YAPI 链接生成 service"为例。

### 6.1 输入源识别

开发者只需要说一句：

"根据 YAPI 链接 `https://yapi.内网域名.com/project/28/interface/api/66` 生成 service"

`api-parser-yapi-mcp` Skill 中定义了链接解析规则：

- 标准格式：`/project/{projectId}/interface/api/{apiId}`

- 直接提取 `projectId=28, apiId=66`，**不再向用户二次确认**。

### 6.2 拉取接口详情

Agent 直接调用：

```
yapi_get_api_desc({ projectId: 28, apiId: 66 })
```

MCP Server 会拿着我们配的 Token 去内网 YAPI 拿数据，返回原始字段：`title / path / method / req_query / req_body_other / req_params / catid / res_body` 等。

### 6.3 数据归一化

按 `api-parser-normalizer` 定义的映射规则，把 YAPI 原始字段翻译成项目中间格式：

| YAPI 字段        | 中间格式字段 | 说明                                |
| ---------------- | ------------ | ----------------------------------- |
| `title` / `name` | `apiName`    | 接口中文名，作为方法注释            |
| `path`           | `path`       | 接口路径，用于方法命名与模块分组    |
| `method`         | `method`     | 代码生成阶段统一强制为 `POST`       |
| `req_query`      | `params`     | Query 参数                          |
| `req_body_other` | `params`     | JSON Schema 解析 `properties`       |
| `req_params`     | `params`     | 路径参数                            |
| `catid` / 分类名 | `module`     | 模块分组兜底（优先级低于 URL 前缀） |

中间输出结构示例：

```json
{
  "source": "yapi-mcp",
  "projectId": 28,
  "apis": [
    {
      "apiId": 66,
      "apiName": "查询用户信息",
      "path": "/v1/user/info",
      "method": "POST",
      "module": "user",
      "params": [{ "name": "userId", "type": "string", "required": true, "desc": "用户ID" }]
    }
  ]
}
```

### 6.4 模块分组与代码生成

- **模块分组**：按 URL 前缀自动归组（`/v1/account/*` → `account`）；用户显式指定时优先使用；已有模块则**追加**，不会重建。

- **文件产物**：
  - `src/service/interface/{module}.js` —— 接口方法定义

  - `src/service/interfaceField/{module}.js` —— 默认参数定义

  - `src/service/index.js` —— 仅在新增模块时更新聚合导出

### 6.5 生成代码自检清单

Agent 生成后会对照项目规范逐项自检：

- 使用 4 空格缩进

- 方法名小驼峰、服务名大驼峰 + `Service`

- 参数默认值：字符串 `''`、数字 `undefined`、布尔 `undefined`、数组 `[]`、对象 `{}`

- 每个方法带 `@param` 和 `@returns {Promise<*>}` JSDoc

- 统一 `http.post()`，即使 YAPI 里写的是 GET

- `primitive: false` 默认选项

- 使用 `Object.assign(defaultParams, params)` 合并参数

- 导入路径使用相对路径 `./../http/index` 和 `./../interfaceField/xxx`

- 使用 `export default xxxService`

## 七、四类常见使用姿势

`api-parser-yapi-mcp` Skill 定义了 5 类触发场景，日常最常用的是这 4 种：

### 7.1 单接口生成（已知链接）

"根据 YAPI 链接 `https://yapi.内网域名.com/project/28/interface/api/66` 生成 service"

链接自动解析，一步到位。

### 7.2 按分类批量生成

"从 YAPI 项目 28 的账户分类下批量生成 service"

流程：

1. `yapi_get_categories({ projectId: 28 })` 获取分类结构。

2. 与用户确认要处理的分类范围（避免误处理）。

3. 遍历该分类下的接口 ID，逐个调用 `yapi_get_api_desc`。

4. 分类名兜底作为模块名（可与用户确认后覆盖）。

### 7.3 关键字搜索

"在 YAPI 中搜索用户登录相关接口并生成代码"

1. `yapi_search_apis({ nameKeyword: '用户登录', limit: 20 })`。

2. 把命中列表回吐给用户勾选。

3. 对确认的接口逐个拉详情、生成代码。

## 八、安全与合规红线

给 AI 开放内网 YAPI，本质是让它触达团队接口资产。`api-parser-yapi-mcp` Skill 定死了几条硬约束：

**必须做到：**

- ✅ 每次调用 MCP 前明确告知用户将拉取哪些接口

- ✅ 拉取结果只用于本次任务，不做二次缓存到项目文件之外

- ✅ 涉及 `token / password / idCard` 等敏感字段示例值，在生成注释里脱敏

**绝对禁止：**

- ❌ 未经用户同意批量拉取整个项目

- ❌ 拉取与本次任务无关的接口

- ❌ 调用 `yapi_save_api` 反向写回 YAPI（工具白名单已从源头堵死）

- ❌ Agent 越权修改 YAPI 原始定义（即使用户要求，也应引导到 YAPI 控制台手动完成）

**错误兜底：**

| 场景                       | 处理方式                                          |
| -------------------------- | ------------------------------------------------- |
| MCP 工具不可用 / 超时      | 回退提示用户手动粘贴接口 JSON                     |
| Token 无权限访问项目       | 提示用户检查 YAPI Token 配置（多项目 Token 拼接） |
| 接口 ID 不存在             | 明确报错并终止流程，不臆测参数                    |
| 返回字段缺失（如无 body）  | 生成空默认参数 `{}`，注释中标注"YAPI 未提供定义"  |
| npx 拉包失败（内网无外网） | 回退到本地部署 MCP，或改走公司 npm 私服           |

## 九、我们踩过的几个坑

1. **内网 npm 拉包失败**：初期直接用 `npx -y yapi-auto-mcp`，公司开发机默认走公司代理，`npx` 拉包时反倒失败。解决：切换到公司 npm 私服，或用 README 里的**本地开发模式**离线部署。

2. **YAPI 官方停止维护**：社区 MCP 直接对接的是 YAPI 的 HTTP API，只要自建 YAPI 版本没大幅魔改，接口协议基本稳定。真出问题时，可以在 MCP 侧打 `--yapi-log-level=debug` 抓请求。

3. **社区 MCP 有写能力**：`yapi_save_api` 存在意味着理论上 AI 可以改 YAPI。**必须**通过 Agent 的 `tools:` 白名单删掉，或者干脆用只读 Token。**双保险都要上**。

## 十、落地收益

把开源自建 YAPI + 社区 MCP + 项目 Agent 三件套串起来后，日常收益是可以量化的：

1. **零复制粘贴**：从 YAPI 到 Service 全流程 AI 托管。

2. **规范一致**：4 空格缩进、JSDoc、默认参数、`http.post()`、模块分组，全部由 Agent 自检强制。

3. **模块化增量**：新接口自动追加到已有模块文件，避免"每次都新建重复方法"。

4. **安全可控**：只读 Token + 工具白名单 + Skill 硬约束三层保险，内网 YAPI 数据不会被误写。

5. **可扩展**：MCP 是协议化的，未来接入 Apifox / Swagger / 内部接口平台，都是同一套 Agent 编排。

## 十一、写在最后

社区维护的开源项目往往是解决"官方停止维护"这类困境的关键抓手。像 [lzsheng/Yapi-MCP](https://github.com/lzsheng/Yapi-MCP) 这样的项目，本质上是给"已停止维护但被广泛使用的老工具"续了一条 AI 时代的命——只要接口协议还在，社区就能补齐 MCP 层，让 AI 直接消费它。

我们要做的，就是在自己项目里把这块"社区能力"**约束好、用起来**：

- 一份用户级 `~/.claude/mcp.json` 配置，把内网 YAPI 接入 Claude Code

- 一个 `.claude/agents/api-parser.md` Agent，把社区 MCP 的能力裁剪成"只读消费"

- 四个精心拆分的 Skills（`core / normalizer / template / yapi-mcp`），把项目规范固化进 AI 工作流

三层叠加，就能让"内网接口文档 → 前端 Service 代码"这条链路从人工 30 分钟压缩到 30 秒，而且更规范、更安全。

## 附录：相关文件与链接

| 类型         | 文件 / 链接                                                        | 作用                             |
| ------------ | ------------------------------------------------------------------ | -------------------------------- |
| 社区 MCP     | [github.com/lzsheng/Yapi-MCP](https://github.com/lzsheng/Yapi-MCP) | 本文使用的 YAPI MCP 服务器       |
| YAPI 平台    | [github.com/YMFE/yapi](https://github.com/YMFE/yapi)               | 开源接口管理平台（官方已停维护） |
| 商业方案参考 | [Apifox 官方 MCP](https://apifox.com/)                             | 国内 Apifox 官方 MCP（付费）     |
| MCP 配置     | `~/.claude/mcp.json`                                               | 用户级 MCP Server 配置           |
| Agent 定义   | `.claude/agents/api-parser.md`                                     | api-parser Agent 定义            |
| YAPI 接入    | `.claude/skills/api-parser-yapi-mcp/SKILL.md`                      | YAPI MCP 接入规范                |
| 解析核心     | `.claude/skills/api-parser-core/SKILL.md`                          | API 解析核心逻辑                 |
| 数据归一化   | `.claude/skills/api-parser-normalizer/SKILL.md`                    | 多源 API 数据归一化              |
| 代码模板     | `.claude/skills/api-parser-template/SKILL.md`                      | Service 代码生成模板             |
| Service 目录 | `src/service/interface/` / `src/service/interfaceField/`           | 生成产物落地目录                 |
