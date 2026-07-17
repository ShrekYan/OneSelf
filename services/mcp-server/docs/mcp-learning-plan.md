# MCP 新手学习计划

> 本计划面向 MCP（Model Context Protocol）初学者，从最简单的"Hello World"开始，逐步构建能服务实际项目的 MCP Server。
>
> 学习原则：**先跑通，再理解，最后扩展**。

---

## 学习目标

完成本计划后，你将能够：

1. 理解 MCP 的核心概念（Server / Client / Tool / Resource / Prompt）
2. 独立开发一个基于 TypeScript 的 MCP Server
3. 为 MCP Server 添加读取文件、调用 API、查询项目代码等实用能力
4. 理解 MCP 安全边界，避免开放危险操作
5. 将 MCP 与自己的博客项目（前端 + 后端）结合，打造项目专属助手

---

## 前置知识

开始学习前，建议你已经掌握：

- TypeScript 基础语法
- Node.js 基本操作（npm install、npm run、require/import）
- 简单的 HTTP / API 概念
- 对 AI 大模型有基本使用经验（如 Claude、ChatGPT）

如果你还不熟悉以上某一项，建议先花 1-2 天补基础。

---

## 学习路径总览

| 阶段   | 主题                   | 预计时间 | 难度       | 关键产出                  |
| ------ | ---------------------- | -------- | ---------- | ------------------------- |
| 阶段 0 | 理解 MCP 基础概念      | 1-2 小时 | ⭐         | 建立直觉                  |
| 阶段 1 | Hello World MCP Server | 2-3 小时 | ⭐         | 第一个可运行的 MCP Server |
| 阶段 2 | 本地文件读取器         | 半天     | ⭐⭐       | 能读本地文件和目录        |
| 阶段 3 | 工具集合（计算类）     | 半天     | ⭐⭐       | 多 Tool 工具箱            |
| 阶段 4 | 接入外部 API           | 1-2 天   | ⭐⭐⭐     | 天气/时间查询 Server      |
| 阶段 5 | 接入项目代码库         | 2-3 天   | ⭐⭐⭐⭐   | 博客项目专属代码助手      |
| 阶段 6 | 有副作用的工具         | 3-5 天   | ⭐⭐⭐⭐⭐ | 可自动改代码/执行命令     |

---

## 阶段 0：理解 MCP 基础概念

### 目标

不急着写代码，先建立对 MCP 的直觉。

### 核心概念

- **MCP Server**：暴露能力的程序，提供 Tool、Resource、Prompt
- **MCP Client**：调用 Server 的程序，通常是 AI 应用（如 Claude Code、Claude Desktop）
- **Tool（工具）**：模型可以调用的函数，例如 `read_file`、`search_code`
- **Resource（资源）**：可以被读取的数据源，例如文件、数据库记录
- **Prompt（提示词）**：预定义的提示模板

### 典型交互流程

```
用户提问
   ↓
Client 把问题发给大模型
   ↓
大模型判断需要调用某个 Tool
   ↓
Client 通过 MCP 协议调用 Server
   ↓
Server 执行 Tool 并返回结果
   ↓
大模型根据结果组织最终回答
   ↓
返回给用户
```

### 学习资源

- 官方 MCP 文档：https://modelcontextprotocol.io
- 阅读 `services/mcp-server/package.json`，确认使用的 SDK 版本
- 查看 `services/mcp-server/src/index.ts`，了解项目当前结构

### 阶段 0 产出

- 能用一句话解释 MCP 是什么
- 能区分 Tool、Resource、Prompt 三者
- 知道自己项目用的是哪个 MCP SDK

---

## 阶段 1：Hello World MCP Server

### 目标

开发第一个能运行的 MCP Server，暴露一个 `hello` 工具。

### 功能描述

- Tool 名：`hello`
- 输入参数：`name`（字符串）
- 返回值：`"你好，{name}！"`

### 需要掌握的技能

1. MCP Server 初始化
2. Tool 注册
3. 请求分发处理
4. 返回文本内容

### 参考代码结构

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'hello-server', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'hello',
        description: '向指定名字打招呼',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '要打招呼的名字',
            },
          },
          required: ['name'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async request => {
  if (request.params.name === 'hello') {
    const { name } = request.params.arguments as { name: string };
    return {
      content: [{ type: 'text', text: `你好，${name}！` }],
    };
  }
  throw new Error('未知工具');
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

### 测试方式

1. 使用 MCP Inspector 调试
2. 在 Claude Desktop 中配置并调用
3. 在 Claude Code 中通过配置 `.mcp.json` 使用

### 阶段 1 产出

- 一个可独立运行的 MCP Server
- 能在 MCP Inspector 或 Claude 客户端中成功调用 `hello` 工具
- 理解 Tool 的定义、参数校验、返回值格式

---

## 阶段 2：本地文件读取器

### 目标

扩展 MCP Server，增加读取本地文件和目录的能力。

### 功能描述

- Tool 名：`read_file`
  - 输入：`path`（文件绝对路径）
  - 输出：文件文本内容
- Tool 名：`list_files`
  - 输入：`dir`（目录绝对路径）
  - 输出：该目录下的文件列表

### 需要掌握的技能

1. 多个 Tool 的注册和请求分发
2. Node.js 文件系统操作（`fs/promises`）
3. 错误处理：文件不存在、路径不是文件、权限不足
4. 路径安全校验：禁止访问规定目录之外的文件

### 安全要点

- 必须校验路径，防止 `../../../etc/passwd` 等越界访问
- 只允许读取白名单目录下的文件
- 返回清晰的错误信息，不暴露内部路径结构

### 阶段 2 产出

- 一个能安全读取本地文件的 MCP Server
- 能在 Claude 中通过自然语言要求"读取某个文件"
- 理解文件类 Tool 的安全边界

---

## 阶段 3：工具集合（纯计算类）

### 目标

做一个"工具箱"式的 MCP Server，让模型根据问题自动选择工具。

### 功能描述

- `add(a, b)`：两数相加
- `count_words(text)`：统计中/英文文本字数
- `format_json(json)`：格式化 JSON 字符串
- `to_uppercase(text)`：文本转大写

### 需要掌握的技能

1. 参数类型设计（数字、字符串、对象、数组）
2. 返回结构化结果
3. 让 Tool 职责单一、命名清晰
4. 为每个 Tool 编写清晰的 `description`，帮助模型理解何时调用

### 阶段 3 产出

- 一个包含 4 个以上工具的工具箱 Server
- 能通过自然语言触发不同工具
- 理解 Tool 的 `description` 对模型决策的重要性

---

## 阶段 4：接入外部 API

### 目标

让 MCP Server 调用真实的外部 HTTP API，例如天气查询。

### 功能描述

- Tool 名：`get_weather`
  - 输入：`city`（城市名）
  - 输出：该城市当前天气信息

### 推荐使用的公开 API

- 和风天气、OpenWeatherMap、心知天气等
- 如果暂时没有 API Key，也可以用免费的 HTTP Bin 或自定义 Mock 服务

### 需要掌握的技能

1. 在 MCP Server 中发起 HTTP 请求（推荐 `axios` 或原生 `fetch`）
2. 管理环境变量和 API Key（`.env` 文件）
3. 把 API 返回的 JSON 整理成模型易读的文本
4. 处理网络超时、API 限流、返回异常

### 安全要点

- API Key 不能硬编码，必须通过环境变量注入
- 不直接把 API 原始错误返回给模型
- 对用户输入的城市名做基本校验

### 阶段 4 产出

- 一个能回答"北京今天天气怎么样"的 MCP Server
- 学会环境变量管理
- 理解外部 API 集成模式

---

## 阶段 5：接入项目代码库

### 目标

为你的博客项目打造一个专属 MCP Server，让它能读懂项目代码。

### 功能描述

- `search_code(keyword)`：在项目源码中搜索关键词
- `read_module_doc(moduleName)`：读取指定模块的 README 或文档
- `list_api_endpoints()`：扫描后端 Controller，列出所有 API 接口
- `get_project_structure()`：返回项目目录结构

### 需要掌握的技能

1. 遍历项目文件系统
2. 读取并解析 TypeScript / JSON 配置文件
3. 简单的正则匹配或 AST 解析
4. 将项目特定知识封装成 Tool

### 与本项目的结合点

你的项目是 Monorepo 博客系统，可以重点关注：

- `apps/web/src/`：前端页面、组件、API
- `services/backend/src/`：后端接口、Service、DTO
- `services/auth-service/src/`：认证服务
- `packages/shared-logging/`：共享日志包

### 阶段 5 产出

- 一个能服务博客项目的 MCP Server
- 能通过自然语言查询项目结构、搜索代码、读取模块文档
- 理解"项目专属知识"如何增强 AI 能力

---

## 阶段 6：有副作用的工具

### 目标

让 MCP Server 不仅能读，还能安全地写和执行命令。

### 功能描述

- `write_file(path, content)`：写入文件
- `run_shell_command(command)`：执行白名单内的 shell 命令
- `git_commit(message)`：自动提交当前变更
- `create_branch(name)`：创建 Git 分支

### 安全要点（非常重要）

> 这一阶段风险最高，必须严格限制。

- 写文件必须限制在白名单目录
- 执行命令必须使用白名单，禁止 `rm -rf`、`>` 重定向等危险操作
- 所有危险操作需要二次确认或显式授权
- 绝对不要在生产环境或包含敏感数据的机器上随意开放

### 需要掌握的技能

1. 安全的文件写入（路径校验、备份、原子写入）
2. 受控的命令执行（白名单 + 参数校验）
3. Git 命令自动化
4. 日志审计和错误回滚

### 阶段 6 产出

- 一个具备有限写能力的开发助手 MCP Server
- 能在安全范围内自动改代码、跑命令、提交 Git
- 理解 MCP 的安全边界和责任

---

## 推荐学习顺序（结合当前项目）

因为你已经在做 `services/mcp-server`，建议按以下顺序推进：

| 顺序 | 案例              | 与你的项目关联                         |
| ---- | ----------------- | -------------------------------------- |
| 1    | Hello World       | 先让 Server 跑起来                     |
| 2    | 读取本地文件      | 为读项目代码做准备                     |
| 3    | 天气/时间 API     | 学会调用外部服务                       |
| 4    | 搜索项目代码      | 直接服务你的博客项目                   |
| 5    | 调用后端 API      | 让 AI 能操作你自己的 auth/backend 服务 |
| 6    | 自动生成/修改代码 | 高阶能力，最后做                       |

---

## 学习检查清单

每完成一个阶段，检查自己是否达成：

- [ ] 能独立解释该阶段的核心概念
- [ ] 代码能在本地成功运行
- [ ] 能在 MCP Inspector 或 Claude 客户端中成功调用
- [ ] 理解该阶段的安全边界
- [ ] 能向他人讲解这个 Tool 是怎么工作的

---

## 下一步行动

1. 打开 `services/mcp-server/src/index.ts`，查看当前代码结构
2. 确认 `package.json` 中使用的 MCP SDK 版本
3. 从阶段 1 开始，先写一个 `hello` Tool
4. 跑通后告诉我，我带你进入阶段 2

---

## 附录：常用资源

- MCP 官方文档：https://modelcontextprotocol.io
- MCP TypeScript SDK：https://github.com/modelcontextprotocol/typescript-sdk
- MCP Inspector（调试工具）：通过 npm 全局安装 `mcp-inspector`
- Claude Code MCP 配置：`.mcp.json`

---

_本计划会根据学习进度持续更新。_
