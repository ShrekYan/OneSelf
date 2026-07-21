import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OllamaEmbeddings } from '@langchain/ollama';
import { computeFileHash } from '../src/utils/hash.js';
import {
  loadIndexState,
  saveIndexState,
  type IndexState,
  type IndexedArticleMeta,
} from '../src/utils/index-state.js';
import {
  addRecords,
  createTable,
  deleteBySlug,
  openTable,
  TEXT_KEY,
  type VectorRecord,
} from '../src/utils/vector-store.js';

// 文章目录路径
const ARTICLES_DIR = path.join(import.meta.dirname, '../data/articles');

/**
 * 文章文件扫描结果
 */
interface ArticleFile {
  /** 文件名 */
  fileName: string;
  /** 文件绝对路径 */
  filePath: string;
  /** 文章 slug */
  slug: string;
  /** 文章标题 */
  title: string;
  /** 文章标签，逗号分隔 */
  tags: string;
  /** 正文内容（不含 frontmatter） */
  content: string;
  /** 文件最后修改时间 */
  mtimeMs: number;
  /** 文件内容 hash */
  contentHash: string;
}

/**
 * 扫描文章目录，读取所有 Markdown 文件元数据
 * @returns 文章文件列表
 */
async function scanArticles(): Promise<ArticleFile[]> {
  // 读取文章目录下的所有文件
  const entries = await fs.readdir(ARTICLES_DIR);
  // 过滤出 Markdown 文件
  const mdFiles = entries.filter(fileName => fileName.endsWith('.md'));
  // 初始化文章列表
  const articles: ArticleFile[] = [];

  for (const fileName of mdFiles) {
    const filePath = path.join(ARTICLES_DIR, fileName);
    const [raw, stats] = await Promise.all([
      fs.readFile(filePath, 'utf-8'),
      fs.stat(filePath),
    ]);

    const { data, content } = matter(raw);
    const contentHash = await computeFileHash(filePath);

    articles.push({
      fileName,
      filePath,
      slug: (data.slug as string) || fileName.replace('.md', ''),
      title: (data.title as string) || fileName,
      tags: Array.isArray(data.tags)
        ? (data.tags as string[]).join(',')
        : (data.tags as string) || '',
      content,
      mtimeMs: stats.mtimeMs,
      contentHash,
    });
  }

  return articles;
}

/**
 * 对比当前文章列表与索引状态，找出需要更新或删除的文章
 * @param files 当前扫描到的文章
 * @param state 当前索引状态
 * @returns 需要更新的文章和需要删除的 slug 列表
 */
function detectChanges(
  files: ArticleFile[],
  state: IndexState,
): { toUpdate: ArticleFile[]; toDelete: string[] } {
  const toUpdate: ArticleFile[] = [];

  for (const file of files) {
    const existing = state.articles[file.fileName];
    if (!existing || existing.contentHash !== file.contentHash) {
      toUpdate.push(file);
    }
  }

  const currentFileNames = new Set(files.map(file => file.fileName));
  const toDelete = Object.keys(state.articles).filter(
    fileName => !currentFileNames.has(fileName),
  );

  return { toUpdate, toDelete };
}

/**
 * 对单篇文章进行分块、嵌入并写入向量库
 * @param table 已打开或创建的向量表
 * @param article 文章信息
 * @param splitter 文本分割器
 * @param embeddings 嵌入模型
 * @returns 该文章生成的 chunk 数量
 */
async function indexArticle(
  table: NonNullable<Awaited<ReturnType<typeof openTable>>>,
  article: ArticleFile,
  splitter: RecursiveCharacterTextSplitter,
  embeddings: OllamaEmbeddings,
): Promise<number> {
  const chunks = await splitter.splitDocuments([
    new Document({
      pageContent: article.content,
      metadata: {
        title: article.title,
        slug: article.slug,
        tags: article.tags,
      },
    }),
  ]);

  const records: VectorRecord[] = await Promise.all(
    chunks.map(async chunk => {
      const vector = await embeddings.embedQuery(chunk.pageContent);
      return {
        vector,
        [TEXT_KEY]: chunk.pageContent,
        title: String(chunk.metadata.title ?? article.title),
        slug: String(chunk.metadata.slug ?? article.slug),
        tags: String(chunk.metadata.tags ?? article.tags),
      };
    }),
  );

  await deleteBySlug(table, article.slug);
  await addRecords(table, records);

  return records.length;
}

/**
 * 从向量库中删除指定文章的所有 chunk
 * @param table 已打开的向量表
 * @param fileName 状态文件中的键（文件名）
 * @param meta 索引元数据
 */
async function removeArticle(
  table: NonNullable<Awaited<ReturnType<typeof openTable>>>,
  fileName: string,
  meta: IndexedArticleMeta,
): Promise<void> {
  await deleteBySlug(table, meta.slug);
  console.log(`🗑️  已删除文章索引：${fileName}`);
}

/**
 * 构建或增量更新文章索引
 */
async function build(): Promise<void> {
  // 加载当前索引状态
  const state = await loadIndexState();
  // 扫描文章目录，获取所有 Markdown 文件元数据
  const files = await scanArticles();
  const { toUpdate, toDelete } = detectChanges(files, state);

  if (toUpdate.length === 0 && toDelete.length === 0) {
    console.log('📭 文章无变更，跳过索引更新');
    return;
  }

  console.log(
    `🔄 检测到 ${toUpdate.length} 篇新增/修改，${toDelete.length} 篇待删除`,
  );

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const embeddings = new OllamaEmbeddings({
    model: 'nomic-embed-text',
  });

  let table = await openTable();

  // 处理已删除的文章
  for (const fileName of toDelete) {
    const meta = state.articles[fileName];
    if (table) {
      await removeArticle(table, fileName, meta);
    }
    delete state.articles[fileName];
  }

  // 处理新增或修改的文章
  for (const article of toUpdate) {
    let chunkCount = 0;

    if (!table) {
      // 首次运行：先分割并嵌入第一篇文章，创建表
      const chunks = await splitter.splitDocuments([
        new Document({
          pageContent: article.content,
          metadata: {
            title: article.title,
            slug: article.slug,
            tags: article.tags,
          },
        }),
      ]);

      const records: VectorRecord[] = await Promise.all(
        chunks.map(async chunk => {
          const vector = await embeddings.embedQuery(chunk.pageContent);
          return {
            vector,
            [TEXT_KEY]: chunk.pageContent,
            title: String(chunk.metadata.title ?? article.title),
            slug: String(chunk.metadata.slug ?? article.slug),
            tags: String(chunk.metadata.tags ?? article.tags),
          };
        }),
      );

      table = await createTable(records);
      chunkCount = records.length;
    } else {
      chunkCount = await indexArticle(table, article, splitter, embeddings);
    }

    state.articles[article.fileName] = {
      slug: article.slug,
      mtimeMs: article.mtimeMs,
      contentHash: article.contentHash,
      chunkCount,
    };

    console.log(`📝 已更新文章索引：${article.title}（${chunkCount} 段）`);
  }

  await saveIndexState(state);
  console.log('🎉 增量索引更新完成');
}

build().catch(error => {
  console.error('❌ 索引构建失败：', error);
  process.exit(1);
});
