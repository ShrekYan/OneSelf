/**
 * 安全写入 Pixso DSL 工具
 * 解决 Bash 引号转义问题
 */

import * as fs from 'fs';

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
export function writeDslSafely(dsl: unknown, filePath: string): WriteResult {
  try {
    const content = JSON.stringify(dsl, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');

    // 验证写入
    const stat = fs.statSync(filePath);
    if (stat.size === 0) {
      return {
        success: false,
        bytesWritten: 0,
        error: 'File is empty after writing',
      };
    }

    // 验证 JSON 可解析
    const readBack = fs.readFileSync(filePath, 'utf8');
    JSON.parse(readBack);

    return {
      success: true,
      bytesWritten: stat.size,
    };
  } catch (error) {
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
export function validateDslFile(filePath: string): { valid: boolean; error?: string } {
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'File does not exist' };
    }
    const content = fs.readFileSync(filePath, 'utf8');
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
