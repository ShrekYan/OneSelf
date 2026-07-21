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
 * 加载所有文章文件
 * @returns
 */
async function loadDocuments() {
  // 读取文章目录下的所有文件
  const files = await fs.readdir(ARTICLES_DIR);
  // 过滤出所有Markdown文件
  const documents: Document[] = [];
  // 读取所有文章文件
  for (const file of files.filter(f => f.endsWith('.md'))) {
    // 读取文件内容
    const raw = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf-8');
    // 解析Markdown内容
    const { data, content } = matter(raw);
    // 创建文档
    documents.push(
      new Document({
        pageContent: content,
        metadata: {
          title: data.title || file,
          slug: data.slug || file.replace('.md', ''),
          tags: Array.isArray(data.tags)
            ? data.tags.join(',')
            : data.tags || '',
        },
      }),
    );
  }
  return documents;
}

async function build() {
  // 加载所有文章文件
  const documents = await loadDocuments();
  // 文本分割器 ，将文档分割为多个段落 ，每个段落的字符数为500，重叠为50
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  // 分割文档
  const chunks = await splitter.splitDocuments(documents);

  //使用本地 Ollama Embedding 模型
  const embeddings = new OllamaEmbeddings({
    model: 'nomic-embed-text',
  });

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
