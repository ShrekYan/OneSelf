/**
 * 索引状态管理工具
 * 维护 data/index-state.json，记录每篇文章的索引元数据
 */

import { readFile, rename, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE_PATH = path.resolve(__dirname, '../../data/index-state.json');
const TEMP_STATE_FILE_PATH = `${STATE_FILE_PATH}.tmp`;

export const INDEX_STATE_VERSION = 1;

/**
 * 单篇文章的索引元数据
 */
export interface IndexedArticleMeta {
  /** 文章 slug，用于向量库中删除旧 chunk */
  slug: string;
  /** 文件最后修改时间戳 */
  mtimeMs: number;
  /** 文件内容 SHA-256 hash */
  contentHash: string;
  /** 该文章被切分成的 chunk 数量 */
  chunkCount: number;
}

/**
 * 索引状态文件结构
 */
export interface IndexState {
  /** 状态文件版本号 */
  version: number;
  /** 最后一次更新时间 ISO 8601 */
  lastUpdatedAt: string;
  /** 以文件名为键的已索引文章集合 */
  articles: Record<string, IndexedArticleMeta>;
}

/**
 * 创建空索引状态
 * @returns 空索引状态对象
 */
export function createEmptyIndexState(): IndexState {
  return {
    version: INDEX_STATE_VERSION,
    lastUpdatedAt: '',
    articles: {},
  };
}

/**
 * 读取索引状态文件
 * @returns 当前索引状态，文件不存在时返回空状态
 */
export async function loadIndexState(): Promise<IndexState> {
  try {
    const raw = await readFile(STATE_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as IndexState;

    return {
      version: parsed.version ?? INDEX_STATE_VERSION,
      lastUpdatedAt: parsed.lastUpdatedAt ?? '',
      articles: parsed.articles ?? {},
    };
  } catch (error) {
    if (isFileNotFoundError(error)) {
      return createEmptyIndexState();
    }
    throw error;
  }
}

/**
 * 原子化保存索引状态文件
 * 先写入临时文件，再重命名为目标文件，避免写入中断导致状态损坏
 * @param state 要保存的索引状态
 */
export async function saveIndexState(state: IndexState): Promise<void> {
  const stateWithTimestamp: IndexState = {
    ...state,
    lastUpdatedAt: new Date().toISOString(),
  };

  await writeFile(
    TEMP_STATE_FILE_PATH,
    JSON.stringify(stateWithTimestamp, null, 2),
    'utf-8',
  );
  await rename(TEMP_STATE_FILE_PATH, STATE_FILE_PATH);
}

/**
 * 判断错误是否为文件不存在
 * @param error 捕获到的错误对象
 * @returns 是否文件不存在错误
 */
function isFileNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  );
}
