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
├── data/
│   ├── articles/           # Markdown 文章源文件
│   ├── vector-db/          # LanceDB 向量库（自动生成）
│   └── index-state.json    # 索引状态文件（自动生成）
├── scripts/
│   └── build-index.ts      # 文章向量索引构建脚本
├── src/
│   ├── articles.tool.ts    # 文章搜索/重建索引工具
│   ├── server.ts           # 工具注册（新增工具改这里）
│   ├── stdio.ts            # stdio 入口
│   └── utils/              # 工具函数
└── package.json
```

## 文章索引（增量更新）

文章向量索引用于支持 `search_articles` 和 `ask_knowledge_base` 工具。

### 构建索引

```bash
npm run build-index
```

该命令会扫描 `data/articles/` 下的 Markdown 文件，并根据 `data/index-state.json` 中记录的状态进行**增量更新**：

- **新增文章**：首次生成向量并写入 LanceDB。
- **修改文章**：重新分块、嵌入后，先删除旧 chunk，再写入新 chunk。
- **未变文章**：跳过，不重复嵌入。
- **已删除文章**：从向量库和状态文件中移除。

### 运行时重建索引

在 Claude Code 中可调用 `rebuild_article_index` 工具触发增量重建，效果与 `npm run build-index` 相同。

## 新增工具

编辑 `src/server.ts`，在 `createServer()` 内调用 `server.registerTool(...)`。

文章相关工具统一在 `src/articles.tool.ts` 中注册。

## 验证

在 Claude Code 中让它调用 `hello` 工具，输入名字，应返回 `Hello, {name}! 欢迎使用 MCP 服务。`
