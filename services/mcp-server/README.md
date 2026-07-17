# MCP Server（本地 stdio 模式）

本地 MCP 服务，通过 stdio 接入 Claude Code。

## 快速开始

```bash
cd services/mcp-server
npm install
npm run stdio   # 手工测试，能启动无错误即可，Ctrl+C 退出
```

启动后 stdio 模式不会有输出（除了 stderr 的连接日志），属正常现象。真正的调用由 Claude Code 完成。

## 接入 Claude Code

已在项目根 `.mcp.json` 追加：

```json
"my-mcp": {
  "command": "npx",
  "args": [
    "tsx",
    "/Users/yanjinqiang/WebstormProjects/claude/services/mcp-server/src/stdio.ts"
  ]
}
```

**修改配置后必须重启 Claude Code 才能生效。**

## 目录结构

```
services/mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts   # 工具注册（新增工具改这里）
│   └── stdio.ts    # stdio 入口
```

## 新增工具

编辑 `src/server.ts`，在 `createServer()` 内调用 `server.registerTool(...)`。

## 验证

在 Claude Code 中让它调用 `hello` 工具，输入名字，应返回 `Hello, {name}! 欢迎使用 MCP 服务。`
