/**
 * 安全写入 Pixso DSL 工具
 * 解决 Bash 引号转义问题
 */

import * as fs from 'fs';
import { logger } from './logger';

/**
 * 写入结果
 */
export interface WriteResult {
  success: boolean;
  bytesWritten: number;
  error?: string;
}

/**
 * 将 DSL 对象安全写入临时文件
 * @param dsl DSL 对象
 * @param filePath 输出文件路径
 */
export async function writeDslSafely(dsl: unknown, filePath: string): Promise<WriteResult> {
  try {
    const content = JSON.stringify(dsl, null, 2);
    await fs.promises.writeFile(filePath, content, 'utf8');

    // 验证写入：只检查文件大小，不重复读取整个文件
    const stat = await fs.promises.stat(filePath);
    if (stat.size === 0) {
      logger.error(`Write failed: file is empty after writing: ${filePath}`);
      return {
        success: false,
        bytesWritten: 0,
        error: 'File is empty after writing',
      };
    }

    logger.debug(`Write completed: ${filePath}, ${stat.size} bytes`);
    return {
      success: true,
      bytesWritten: stat.size,
    };
  } catch (error) {
    logger.error(`Write failed: ${filePath}`, error instanceof Error ? error : String(error));
    return {
      success: false,
      bytesWritten: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 检查文件是否为有效 JSON
 */
export async function validateDslFile(filePath: string): Promise<{ valid: boolean; error?: string }> {
  try {
    if (!(await checkFileExists(filePath))) {
      return { valid: false, error: 'File does not exist' };
    }
    const content = await fs.promises.readFile(filePath, 'utf8');
    if (content.trim().length === 0) {
      return { valid: false, error: 'File is empty' };
    }
    JSON.parse(content);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 检查文件是否存在
 */
async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}
