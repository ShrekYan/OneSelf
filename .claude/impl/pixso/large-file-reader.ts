/**
 * 大文件分块读取 - 用于处理 Pixso 返回的超大 DSL JSON
 * 使用流式读取避免一次性加载占用过多内存
 */

import * as fs from 'fs';
import * as readline from 'readline';

/**
 * 大文件读取选项
 */
export interface LargeFileReadOptions {
  /** 最大文件大小限制（字节），默认 1GB */
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
  const {
    maxSizeBytes = 1024 * 1024 * 1024, // 默认 1GB
    encoding = 'utf8',
  } = options;

  // 先检查文件是否存在
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // 检查文件大小
  const stats = fs.statSync(filePath);
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
      resolve(content);
    });

    rl.on('error', (err) => {
      rl.close();
      reject(err);
    });
  });
}

/**
 * 检查文件是否存在且可访问
 */
export function checkFileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取文件大小（字节）
 */
export function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return -1;
  }
}
