# 个人文章 RAG 知识库 + MCP Server 本地部署方案

## 方案目标

将个人 Markdown 文章构建成本地可运行的 RAG（检索增强生成）知识库，通过 MCP Server 暴露给外部大模型调用。

## 核心原则

- **大模型**：使用已购买的外部模型服务（OpenAI / Claude / 智谱 / Kimi / DeepSeek 等）。
- **其他全部本地**：Embedding、向量数据库、MCP Server 均部署在本地。
- **流程编排**：使用 **LangChain.js**，把读文档、切块、Embedding、建索引串成 Pipeline，便于学习和扩展。
- **检索执行**：MCP 工具中的语义搜索使用原生 **@lancedb/lancedb** API，减少对 LangChain 封装细节的依赖。
- **一套技术栈**：尽量使用 TypeScript / Node.js，降低学习成本。
- **低成本、可扩展**：文章数据量小，本地免费方案完全够用；后续文章增多时只需追加索引。

---

## 一、整体架构

```text
┌─────────────────────────────────────────┐
│         外部大模型（你已购买）            │
│   Claude / OpenAI / 智谱 / Kimi 等      │
└─────────────┬───────────────────────────┘
              │ 通过网络调用
              ▼
┌─────────────────────────────────────────┐
│        MCP Server（本地 stdio 运行）      │
│  ┌─────────────────────────────────┐    │
│  │ search_articles                 │    │
│  │ ask_knowledge_base              │    │
│  │ hello / read_file / list_files  │    │
│  │ weather_query                   │    │
│  └─────────────────────────────────┘    │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│         LangChain.js Pipeline           │
│  DocumentLoader → Splitter → Embedding  │
│              （仅索引构建阶段使用）        │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      本地 Embedding 模型（Ollama）        │
│      nomic-embed-text / bge-m3          │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      本地向量数据库（LanceDB）            │
│      存储文章切分后的向量索引             │
└─────────────────────────────────────────┘
```

---

## 二、技术选型

| 组件               | 推荐方案                    | 选择理由                                             |
| ------------------ | --------------------------- | ---------------------------------------------------- |
| **流程编排**       | **LangChain.js**            | 封装文档加载、切块、Embedding、建索引，适合学习      |
| **Embedding 模型** | Ollama + `nomic-embed-text` | 免费、本地运行、安装简单、占用资源低                 |
| **向量数据库**     | LanceDB                     | 纯本地文件存储，Node.js 直接读写，无需安装数据库服务 |
| **向量检索**       | `@lancedb/lancedb` 原生 API | 直接控制查询逻辑，减少封装黑盒                       |
| **MCP Server**     | 现有 `services/mcp-server/` | 复用项目已有基础，避免重复建设                       |
| **大模型**         | 外部已购买服务              | 只负责最终生成答案，不占用本地 GPU                   |
| **开发语言**       | TypeScript / Node.js        | 与现有项目保持一致，新手只需学一套技术栈             |

### 可选替代方案

| 组件           | 替代方案                       | 适用场景                         |
| -------------- | ------------------------------ | -------------------------------- |
| Embedding 模型 | `bge-m3`（通过 Ollama）        | 中文检索效果要求更高时           |
| 向量数据库     | Chroma                         | Python 生态更熟悉时              |
| 大模型         | 任意兼容 OpenAI API 格式的服务 | 通用，只需替换 baseUrl 和 apiKey |

---

## 三、环境准备

### 1. 安装 Ollama

访问官网下载安装：https://ollama.com

安装完成后拉取 Embedding 模型：

```bash
ollama pull nomic-embed-text
```

验证模型可用：

```bash
ollama run nomic-embed-text
```

### 2. 准备文章数据

将 Markdown 文章放入统一目录：

```text
services/mcp-server/data/articles/
├── react-19-features.md
├── nestjs-prisma-guide.md
├── mobx-best-practices.md
└── ...
```

每篇文章建议包含 frontmatter：

```markdown
---
title: React 19 新特性
slug: react-19-features
date: 2024-06-01
tags: [React, 前端]
---

正文内容...
```

### 3. 安装 Node.js 依赖

项目已在 `services/mcp-server/package.json` 中声明依赖，直接安装即可：

```bash
cd services/mcp-server
npm install
```

关键依赖说明：

| 依赖                        | 作用                          |
| --------------------------- | ----------------------------- |
| `@langchain/core`           | LangChain 核心类型与 Document |
| `@langchain/ollama`         | Ollama Embedding 模型封装     |
| `@langchain/textsplitters`  | 文本切块器                    |
| `@langchain/community`      | LanceDB VectorStore 封装      |
| `@lancedb/lancedb`          | LanceDB 原生 Node.js 客户端   |
| `@modelcontextprotocol/sdk` | MCP Server SDK                |
| `gray-matter`               | 解析 Markdown frontmatter     |
| `zod`                       | 工具参数校验                  |
| `tsx`                       | TypeScript 执行器             |

---

## 四、目录结构

```text
services/mcp-server/
├── src/
│   ├── server.ts                   # MCP Server 入口：注册所有工具
│   ├── stdio.ts                    # Stdio 传输入口
│   ├── articles.tool.ts            # 文章 RAG 工具（原生 LanceDB 检索）
│   └── utils/                      # 其他工具辅助函数
├── scripts/
│   └── build-index.ts              # 构建文章向量索引（LangChain.js 版）
├── data/
│   ├── articles/                   # 原始 Markdown 文章
│   └── vector-db/                  # LanceDB 向量数据库文件
├── package.json
├── tsconfig.json
└── README.md
```

> 注意：本项目使用 ES Module（`"type": "module"`），TypeScript 配置为 `NodeNext` 模块解析，因此源码中导入需使用 `.js` 扩展名。

---

## 五、实现方案

当前实现采用**混合方案**：

- **索引构建**使用 LangChain.js 的 Pipeline（加载 → 切块 → Embedding → 写入 LanceDB）。
- **检索阶段**使用 `@lancedb/lancedb` 原生 API 直接查询向量表，便于理解底层逻辑并减少封装依赖。

### 1. 索引构建脚本

`services/mcp-server/scripts/build-index.ts`：

```typescript
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OllamaEmbeddings } from '@langchain/ollama';
import { LanceDB } from '@langchain/community/vectorstores/lancedb';

const ARTICLES_DIR = path.join(import.meta.dirname, '../data/articles');
const DB_DIR = path.join(import.meta.dirname, '../data/vector-db');

/**
 * 加载 Markdown 文件为 LangChain Document
 */
async function loadDocuments(): Promise<Document[]> {
  const files = await fs.readdir(ARTICLES_DIR);
  const documents: Document[] = [];

  for (const file of files.filter(f => f.endsWith('.md'))) {
    const raw = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf-8');
    const { data, content } = matter(raw);

    documents.push(
      new Document({
        pageContent: content,
        metadata: {
          title: data.title || file,
          slug: data.slug || file.replace('.md', ''),
          tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags || '',
        },
      }),
    );
  }

  return documents;
}

async function build() {
  // 1. 加载文档
  const documents = await loadDocuments();

  // 2. 切块：每 500 字符一段，重叠 50 字符
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const chunks = await splitter.splitDocuments(documents);

  // 3. 使用本地 Ollama Embedding 模型
  const embeddings = new OllamaEmbeddings({
    model: 'nomic-embed-text',
  });

  // 4. 存入 LanceDB
  await LanceDB.fromDocuments(chunks, embeddings, {
    uri: DB_DIR,
    tableName: 'articles',
  });

  console.log(`🎉 LangChain 索引构建完成，共 ${chunks.length} 段`);
}

build().catch(error => {
  console.error('❌ 索引构建失败：', error);
  process.exit(1);
});
```

执行构建：

```bash
cd services/mcp-server
npx tsx scripts/build-index.ts
```

> 若使用 `npm run build-index`，请确认 `package.json` 中的脚本路径与实际文件一致（当前实际文件位于 `scripts/build-index.ts`，而非 `src/scripts/build-index.ts`）。

### 2. MCP Server 工具实现

`services/mcp-server/src/articles.tool.ts`：

```typescript
import path from 'path';
import { fileURLToPath } from 'url';
import { Document } from '@langchain/core/documents';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';
import { OllamaEmbeddings } from '@langchain/ollama';
import * as lancedb from '@lancedb/lancedb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.resolve(__dirname, '../data/vector-db');

const TABLE_NAME = 'articles';
const TEXT_KEY = 'text';

interface LanceRow {
  vector: number[];
  [TEXT_KEY]: string;
  score: number;
  [key: string]: unknown;
}

/**
 * 创建嵌入模型
 */
function createEmbeddings(): OllamaEmbeddings {
  return new OllamaEmbeddings({
    model: 'nomic-embed-text',
  });
}

/**
 * 语义搜索文章片段
 */
async function searchArticles(query: string, topK: number): Promise<Document[]> {
  const embeddings = createEmbeddings();
  const queryEmbedding = await embeddings.embedQuery(query);

  const db = await lancedb.connect(DB_DIR);
  const table = await db.openTable(TABLE_NAME);

  const rows = (await table.query().nearestTo(queryEmbedding).limit(topK).toArray()) as LanceRow[];

  return rows.map(row => {
    const metadata: Record<string, unknown> = {};
    Object.keys(row).forEach(key => {
      if (key !== 'vector' && key !== 'score' && key !== TEXT_KEY) {
        metadata[key] = row[key];
      }
    });

    return new Document({
      pageContent: row[TEXT_KEY],
      metadata,
    });
  });
}

/**
 * 注册文章 RAG 相关 MCP 工具
 */
export function registerArticleTools(server: McpServer) {
  // 工具 1：语义搜索文章
  server.registerTool(
    'search_articles',
    {
      description: '搜索文章',
      inputSchema: {
        query: z.string().describe('搜索关键词或问题'),
        topK: z.number().default(5).describe('返回最相关的片段数量'),
      },
    },
    async ({ query, topK }) => {
      const results = await searchArticles(query, topK);

      return {
        content: results.map(r => ({
          type: 'text' as const,
          text: `【${r.metadata.title}】\n${r.pageContent}`,
        })),
      };
    },
  );

  // 工具 2：直接基于知识库问答
  server.registerTool(
    'ask_knowledge_base',
    {
      description: '向知识库提问',
      inputSchema: {
        question: z.string().describe('用户的问题'),
      },
    },
    async ({ question }) => {
      const results = await searchArticles(question, 5);
      const context = results.map(r => `【${r.metadata.title}】\n${r.pageContent}`).join('\n\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `已检索到以下参考资料，请结合这些内容回答用户问题：\n\n${context}\n\n用户问题：${question}`,
          },
        ],
      };
    },
  );
}
```

### 3. 在 server.ts 中注册

`services/mcp-server/src/server.ts`：

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerArticleTools } from './articles.tool.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'my-mcp',
    version: '0.1.0',
  });

  registerArticleTools(server);

  // 其他工具：hello / read_file / list_files / weather_query
  // ...

  return server;
}
```

### 4. 混合实现说明

| 阶段     | 使用库                                              | 原因                                   |
| -------- | --------------------------------------------------- | -------------------------------------- |
| 索引构建 | `@langchain/community` 的 `LanceDB.fromDocuments`   | 自动完成切块、Embedding、建表          |
| 检索查询 | `@lancedb/lancedb` 原生 `table.query().nearestTo()` | 直接控制查询逻辑，便于学习底层向量检索 |

LangChain.js 在索引阶段负责：

| 步骤        | 你写的代码                            | LangChain.js 负责        |
| ----------- | ------------------------------------- | ------------------------ |
| 读 Markdown | `fs.readFile` + `gray-matter`         | 把结果包成 `Document`    |
| 切块        | 配置 `RecursiveCharacterTextSplitter` | 自动按语义和长度切分     |
| Embedding   | 创建 `OllamaEmbeddings`               | 自动调用 Ollama 生成向量 |
| 存向量库    | `LanceDB.fromDocuments`               | 自动建表、写向量         |

---

## 六、运行与测试

### 1. 确保 Ollama 已启动

```bash
ollama serve
```

### 2. 构建索引

```bash
cd services/mcp-server
npx tsx scripts/build-index.ts
```

### 3. 启动 MCP Server

```bash
npm run stdio
```

启动后 stdio 模式下 stdout 只输出 MCP 协议消息，看到 stderr 的连接日志即表示正常。

### 4. 在 Claude Code 中配置

项目根目录 `.mcp.json` 已追加：

```json
{
  "mcpServers": {
    "my-mcp": {
      "command": "npx",
      "args": ["tsx", "/Users/yanjinqiang/WebstormProjects/claude/services/mcp-server/src/stdio.ts"]
    }
  }
}
```

> 路径请替换为实际项目路径。修改配置后必须重启 Claude Code 才能生效。

### 5. 验证

在 Claude Code 中让它调用 `hello` 工具，输入名字，应返回：

```text
Hello, {name}! 欢迎使用 MCP 服务。
```

也可以让它调用 `search_articles`，查询文章关键词，验证 RAG 链路是否通畅。

---

## 七、上线方案（可选）

后续若想让外部厂商或他人调用，可采用以下方式：

| 方案                 | 说明                                   | 成本         |
| -------------------- | -------------------------------------- | ------------ |
| **个人电脑长期开机** | 适合个人使用                           | 电费         |
| **内网穿透**         | 使用 frp / ngrok / cpolar 暴露本地服务 | 低           |
| **轻量云服务器**     | 阿里云/腾讯云 2 核 4G                  | 约 100 元/月 |
| **NAS 运行**         | 在 NAS 上部署 Docker                   | 已有设备     |

### 生产环境注意事项

1. **SSE 模式**：将 MCP Server 从 Stdio 切换为 SSE，暴露 HTTP 接口。
2. **鉴权**：增加 API Key 校验，防止未授权访问。
3. **HTTPS**：使用 Nginx 或云厂商负载均衡配置 SSL 证书。
4. **备份**：定期备份 `data/vector-db/` 目录。
5. **监控**：记录调用日志，关注 Ollama 和 MCP Server 的运行状态。

---

## 八、避坑指南

| 问题                             | 原因                                    | 解决方案                                                                       |
| -------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| Ollama 连接失败                  | 服务未启动                              | 先执行 `ollama serve`                                                          |
| 索引构建很慢                     | 本地 CPU 生成 Embedding                 | 正常现象，文章量大时约几分钟                                                   |
| 搜索结果不相关                   | 切块过大或模型不匹配                    | 调整 `RecursiveCharacterTextSplitter` 的 `chunkSize`，或换 `bge-m3`            |
| 向量库表已存在                   | 重复执行构建脚本                        | LangChain 版会自动覆盖                                                         |
| 大模型编造答案                   | 检索结果不足或提示词问题                | 增加 `topK`，或在提示词中强制要求基于参考资料回答                              |
| 新增文章后搜索不到               | 索引未更新                              | 重新执行 `build-index.ts`                                                      |
| `npm run build-index` 找不到文件 | `package.json` 脚本路径与实际文件不一致 | 使用 `npx tsx scripts/build-index.ts` 执行，或修正 `package.json` 中的脚本路径 |

---

## 九、后续优化方向

1. **增量更新**：只对新文章或修改过的文章重建索引。
2. **混合检索**：结合关键词搜索和向量搜索，提升召回率。
3. **重排序（Rerank）**：对检索结果进行二次排序，提高相关性。
4. **多模型 Embedding**：根据文章语言选择更合适的中文 Embedding 模型。
5. **Web 管理后台**：开发一个简单的管理界面，方便上传、删除、预览文章。

---

## 十、关键资源

- Ollama 官网：https://ollama.com
- LanceDB 文档：https://lancedb.github.io/lancedb/
- MCP 协议文档：https://modelcontextprotocol.io
- LangChain.js 文档：https://js.langchain.com/

---

_文档生成时间：2026-07-21_
_适用项目：claude Monorepo 博客项目_
