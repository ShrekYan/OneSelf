/**
 * 大文件分块读取 - 用于处理 Pixso 返回的超大 DSL JSON
 * 使用流式读取避免一次性加载占用过多内存
 */

import * as fs from 'fs';
import * as readline from 'readline';
import { getConfig } from './config';
import { logger } from './logger';

/**
 * 大文件读取选项
 */
export interface LargeFileReadOptions {
  /** 最大文件大小限制（字节），默认从配置读取 */
  maxSizeBytes?: number;
  /** 文件编码，默认 utf8 */
  encoding?: BufferEncoding;
}

/**
 * 流式读取大文件
 * @param filePath 文件路径
 * @param options 读取选项
 * @returns 完整文件内容
 */
export async function readLargeFile(
  filePath: string,
  options: LargeFileReadOptions = {}
): Promise<string> {
  const config = getConfig();
  const {
    maxSizeBytes = config.maxFileSizeBytes,
    encoding = 'utf8',
  } = options;

  logger.debug(`Starting readLargeFile: ${filePath}, maxSizeBytes=${maxSizeBytes}`);

  // 先检查文件是否存在
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch {
    throw new Error(`File not found or not readable: ${filePath}`);
  }

  // 检查文件大小
  const stats = await fs.promises.stat(filePath);
  if (stats.size > maxSizeBytes) {
    throw new Error(
      `File too large (${Math.round(stats.size / 1024 / 1024)} MB), ` +
      `exceeds limit of ${Math.round(maxSizeBytes / 1024 / 1024)} MB`
    );
  }

  return new Promise((resolve, reject) => {
    let content = '';

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding }),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      content += line + '\n';
    });

    rl.on('close', () => {
      logger.debug(`Completed readLargeFile: ${filePath}, ${content.length} chars`);
      resolve(content);
    });

    rl.on('error', (err) => {
      rl.close();
      logger.error(`readLargeFile error: ${filePath}`, err);
      reject(err);
    });
  });
}

/**
 * 检查文件是否存在且可访问
 */
export async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取文件大小（字节）
 */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.size;
  } catch {
    return -1;
  }
}
