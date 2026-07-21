/**
 * 文件内容 hash 计算工具
 * 用于检测文章文件是否发生变更
 */

import { createHash } from 'crypto';
import { readFile } from 'fs/promises';

/**
 * 计算指定文件内容的 SHA-256 hash
 * @param filePath 文件绝对路径
 * @returns 小写 16 进制 hash 字符串
 */
export async function computeFileHash(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  return createHash('sha256').update(buffer).digest('hex');
}
