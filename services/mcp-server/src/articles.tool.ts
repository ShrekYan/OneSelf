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
 * @returns 嵌入模型实例
 */
function createEmbeddings(): OllamaEmbeddings {
  return new OllamaEmbeddings({
    model: 'nomic-embed-text',
  });
}

/**
 * 搜索文章
 * @param query 搜索查询
 * @param topK 返回的文档数量
 * @returns 文档列表
 */
async function searchArticles(
  query: string,
  topK: number,
): Promise<Document[]> {
  // 创建嵌入模型
  const embeddings = createEmbeddings();
  // 对查询进行嵌入
  const queryEmbedding = await embeddings.embedQuery(query);
  // 连接数据库量数据库
  const db = await lancedb.connect(DB_DIR);
  // 打开表
  const table = await db.openTable(TABLE_NAME);
  // 查询表
  const rows = (await table
    .query()
    // 查询最相关的文档
    .nearestTo(queryEmbedding)
    // 限制返回的文档数量
    .limit(topK)
    .toArray()) as LanceRow[];

  // 转换为文档列表
  return rows.map(row => {
    const metadata: Record<string, unknown> = {};
    Object.keys(row).forEach(key => {
      // 过滤掉向量、分数和文本字段
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

export function registerArticleTools(server: McpServer) {
  // 注册搜索文章工具
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

  // 注册向知识库提问工具
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
      const context = results
        .map(r => `【${r.metadata.title}】\n${r.pageContent}`)
        .join('\n\n');

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
