# MCP Server 文章索引增量更新方案

## Context

当前 `services/mcp-server/scripts/build-index.ts` 是**全量重建**模式：每次运行都读取 `data/articles/` 下所有 Markdown 文件，分块、嵌入后通过 `LanceDB.fromDocuments()` 创建新表，覆盖旧向量库。当文章数量增多时，这种方式会重复嵌入未改动的文章，浪费本地 Ollama 算力且耗时。

本次目标：改造为**增量更新**，只处理新增、修改、删除的文章，保留未变化文章的向量记录。

## 推荐方案

### 1. 变更检测机制

新增一个索引状态文件 `data/index-state.json`，记录每个已索引文章的元数据：

```json
{
  "version": 1,
  "lastUpdatedAt": "2026-07-21T07:30:00.000Z",
  "articles": {
    "Calude Code -1 基础指令速查表.md": {
      "slug": "claude-code-basic-commands-cheatsheet",
      "mtimeMs": 1752728400000,
      "contentHash": "sha256:abc...",
      "chunkCount": 12
    }
  }
}
```

扫描 `data/articles/` 时，按以下规则判定：

- **新增**：状态文件中不存在该文件路径。
- **修改**：存在但 `contentHash` 不一致（优先）或 `mtimeMs` 发生变化。
- **删除**：状态文件中存在但磁盘上已不存在。
- **未变**：hash 与状态一致，跳过嵌入。

> 使用 `contentHash` 比 `mtime` 更可靠；`mtime` 可作为快速预检，避免频繁读取大文件。

### 2. LanceDB 增量操作

基于已确认的 LanceDB 0.19.1 API：

- 打开数据库：`const db = await lancedb.connect(DB_DIR)`
- 检查表存在：`const names = await db.tableNames();`
- 打开表：`const table = await db.openTable(TABLE_NAME)`
- 删除旧记录：`await table.delete("slug = 'xxx'")`
- 追加新记录：`await table.add(records, { mode: 'append' })`
- 首次创建：`await db.createTable(TABLE_NAME, records, { mode: 'create', existOk: true })`

处理流程：

1. 加载当前 `index-state.json`（不存在则视为空）。
2. 扫描文章目录，得到三组：`toAddOrUpdate`、`toDelete`、`unchanged`。
3. 若 `toAddOrUpdate` 非空：
   - 解析 Markdown frontmatter，提取 `title`、`slug`、`tags`。
   - 用 `RecursiveCharacterTextSplitter` 分块。
   - 用 `OllamaEmbeddings` 生成向量。
   - 对每个文章 slug，先 `table.delete("slug = '<slug>'")` 删除旧 chunk，再 `table.add(records, { mode: 'append' })` 写入新 chunk。
4. 若 `toDelete` 非空：
   - 对每个 slug 执行 `table.delete("slug = '<slug>'")`。
   - 从 `index-state.json` 移除对应条目。
5. 更新 `index-state.json`：写入新的 `mtimeMs`、`contentHash`、`chunkCount` 和 `lastUpdatedAt`。

### 3. 脚本与工具暴露

- 改造 `scripts/build-index.ts`：从全量重建改为增量更新。
- 保持 `npm run build-index` 命令不变。
- （可选）在 `src/articles.tool.ts` 新增一个 MCP Tool `rebuild_article_index`，允许 Claude Code 运行时触发增量更新；如需避免运行时触发，可保持仅脚本方式。本次方案以脚本为主，视实现情况再决定是否暴露 Tool。

### 4. 数据字段保持一致

向量表记录字段保持与现有实现一致，便于搜索工具无需改动：

```typescript
{
  vector: number[],
  text: string,
  title: string,
  slug: string,
  tags: string,
}
```

### 5. 错误与边界处理

- 若 LanceDB 表不存在且状态文件存在：视为状态损坏，给出警告并全量重建。
- 若某篇文章解析失败：记录错误，跳过该篇，不影响其他文章。
- 删除操作失败时：打印警告，状态文件不删除对应条目，下次可重试。
- 使用事务化的状态文件写入：先写临时文件，再原子重命名为 `index-state.json`。

## 关键文件

| 文件                                         | 修改说明                                                       |
| -------------------------------------------- | -------------------------------------------------------------- |
| `services/mcp-server/scripts/build-index.ts` | 全量重建改为增量更新，新增变更检测、状态维护、LanceDB 增删逻辑 |
| `services/mcp-server/data/index-state.json`  | 新增索引状态文件（运行后生成）                                 |
| `services/mcp-server/src/articles.tool.ts`   | 可选：新增 `rebuild_article_index` Tool；搜索逻辑无需改动      |
| `services/mcp-server/README.md`              | 更新为增量索引说明                                             |

## 验证方式

1. **类型检查**：在 `services/mcp-server` 目录执行 `npx tsc --noEmit`，确保无类型错误。
2. **功能验证**：
   - 首次运行 `npm run build-index`，应全量构建并生成 `data/index-state.json`。
   - 不改动文章再次运行，应提示"无变更"且不调用嵌入模型（或仅做快速预检）。
   - 修改一篇文章内容后运行，应只重新嵌入该文章，其他文章向量保留。
   - 新增一篇文章后运行，应只嵌入新增文章。
   - 删除一篇文章后运行，应从向量库和状态文件中移除该文章。
3. **搜索验证**：运行后调用 `search_articles` 或 `ask_knowledge_base`，确认新增/修改内容可被检索到，删除内容不再返回。

## 阶段进展

| 阶段                 | 状态      | 说明                                                |
| -------------------- | --------- | --------------------------------------------------- |
| 阶段 1：基础工具函数 | ✅ 已完成 | 新增 `hash.ts`、`index-state.ts`、`vector-store.ts` |
| 阶段 2：增量构建脚本 | ✅ 已完成 | 改造 `build-index.ts`，支持新增/修改/删除检测       |
| 阶段 3：Tool + 文档  | ✅ 已完成 | 新增 `rebuild_article_index` Tool，更新 README      |
| 阶段 4：验证         | ✅ 已完成 | 类型检查通过，新增/修改/删除/搜索场景均验证通过     |
