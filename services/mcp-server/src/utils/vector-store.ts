/**
 * LanceDB 向量库写操作封装
 * 提供打开/创建表、按 slug 删除 chunk、追加向量记录能力
 */

import path from 'path';
import { fileURLToPath } from 'url';
import * as lancedb from '@lancedb/lancedb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DB_DIR = path.resolve(__dirname, '../../data/vector-db');
export const TABLE_NAME = 'articles';
export const TEXT_KEY = 'text';

/**
 * 写入向量库的单条记录结构
 */
export interface VectorRecord extends Record<string, unknown> {
  /** 文本块向量 */
  vector: number[];
  /** 文本块原始内容 */
  [TEXT_KEY]: string;
  /** 文章标题 */
  title: string;
  /** 文章 slug，用于删除旧 chunk */
  slug: string;
  /** 文章标签，逗号分隔 */
  tags: string;
}

/**
 * 打开已存在的 articles 表
 * @returns 已打开的表；若表不存在返回 null
 */
export async function openTable(): Promise<lancedb.Table | null> {
  const db = await lancedb.connect(DB_DIR);
  const names = await db.tableNames();

  if (!names.includes(TABLE_NAME)) {
    return null;
  }

  return db.openTable(TABLE_NAME);
}

/**
 * 使用初始记录创建 articles 表
 * @param records 初始向量记录，必须非空
 * @returns 创建的表
 */
export async function createTable(
  records: VectorRecord[],
): Promise<lancedb.Table> {
  if (records.length === 0) {
    throw new Error('创建表时初始记录不能为空');
  }

  const db = await lancedb.connect(DB_DIR);
  return db.createTable(TABLE_NAME, records, {
    mode: 'create',
    existOk: true,
  });
}

/**
 * 删除指定 slug 的所有 chunk
 * @param table 已打开的表
 * @param slug 文章 slug
 */
export async function deleteBySlug(
  table: lancedb.Table,
  slug: string,
): Promise<void> {
  const escapedSlug = slug.replace(/'/g, "''");
  await table.delete(`slug = '${escapedSlug}'`);
}

/**
 * 向表中追加向量记录
 * @param table 已打开的表
 * @param records 要追加的记录
 */
export async function addRecords(
  table: lancedb.Table,
  records: VectorRecord[],
): Promise<void> {
  if (records.length === 0) {
    return;
  }

  await table.add(records, { mode: 'append' });
}
