/**
 * Pixso MCP 调用入口 - 整合错误处理、大文件读取、DSL 解析
 */

import { classifyError, ClassifiedError, shouldRetry, getRetryDelay, formatUserMessage } from './error-handler';
import { readLargeFile, checkFileExists } from './large-file-reader';
import { scaleDimensions, validateDsl, calculateScale } from './dsl-parser';

// 导出所有模块
export * from './error-handler';
export * from './large-file-reader';
export * from './dsl-parser';

/**
 * Pixso 调用结果
 */
export interface PixsoResult {
  success: boolean;
  dsl?: unknown;
  error?: ClassifiedError;
  userMessage: string;
}

/**
 * 处理 MCP 返回结果，包括错误处理和大文件读取
 */
export async function processPixsoResult(
  mcpResult: unknown,
  errorMessage?: string
): Promise<PixsoResult> {
  // 如果 MCP 直接返回成功结果
  if (!errorMessage && mcpResult) {
    return {
      success: true,
      dsl: mcpResult,
      userMessage: '✅ 成功获取 Pixso 设计',
    };
  }

  // 分类错误
  const error = classifyError(errorMessage || 'Unknown error');

  // 特殊处理 token 超限 - 读取本地文件
  if (error.type === 'tokenExceeded' && error.context?.localFilePath) {
    const filePath = error.context.localFilePath;

    if (!checkFileExists(filePath)) {
      return {
        success: false,
        error,
        userMessage: formatUserMessage({
          ...error,
          message: `文件不存在: ${filePath}`,
        }),
      };
    }

    try {
      const content = await readLargeFile(filePath);
      const dsl = JSON.parse(content);

      const validation = validateDsl(dsl);
      if (!validation.valid) {
        return {
          success: false,
          error,
          userMessage: `## ❌ DSL 解析失败\n\n${validation.errors.join('\n')}`,
        };
      }

      return {
        success: true,
        dsl,
        userMessage: `✅ 成功从本地文件读取 Pixso 设计 (${Math.round(Buffer.byteLength(content, 'utf8') / 1024)} KB)`,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error,
        userMessage: `## ❌ 读取本地文件失败\n\n${msg}`,
      };
    }
  }

  // 其他错误
  return {
    success: false,
    error,
    userMessage: formatUserMessage(error),
  };
}

/**
 * 归一化 DSL 尺寸到 750px 设计稿标准
 */
export function normalizeDslDimensions<T extends { width: number; height: number }>(
  dsl: T,
  originalDesignWidth: number,
  targetWidth: number = 750
): T {
  const scale = calculateScale(originalDesignWidth, targetWidth);
  const scaled = scaleDimensions(dsl, originalDesignWidth, {
    targetWidth,
    roundToInt: true,
  });

  return {
    ...dsl,
    width: scaled.width,
    height: scaled.height,
    x: 'x' in dsl ? scaled.x : (dsl as unknown as { x: number }).x,
    y: 'y' in dsl ? scaled.y : (dsl as unknown as { y: number }).y,
  };
}

/**
 * 等待指定毫秒
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试的 Pixso 调用
 */
export async function callWithRetry<T>(
  callFn: () => Promise<T>,
  maxRetries: number = 3
): Promise<{ success: true; data: T } | { success: false; lastError: string }> {
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      const data = await callFn();
      return { success: true, data };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const classified = classifyError(errorMsg);
      classified.retryCount = retryCount;

      if (!shouldRetry(classified) || retryCount >= maxRetries) {
        return { success: false, lastError: formatUserMessage(classified) };
      }

      const waitMs = getRetryDelay(classified);
      await delay(waitMs);
      retryCount++;
    }
  }

  return { success: false, lastError: 'Max retries exceeded' };
}
