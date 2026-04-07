/**
 * Pixso MCP 调用入口 - 整合错误处理、大文件读取、DSL 解析
 */

import {
  classifyError,
  ClassifiedError,
  shouldRetry,
  getRetryDelay,
  formatUserMessage,
} from './error-handler';
import { readLargeFile, checkFileExists } from './large-file-reader';
import { scaleDimensions, validateDsl, calculateScale } from './dsl-parser';
import { writeDslSafely, validateDslFile, WriteResult } from './dsl-writer';

// 导出所有模块
export * from './error-handler';
export * from './large-file-reader';
export * from './dsl-parser';
export * from './dsl-writer';

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
  errorMessage?: string,
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

    if (!(await checkFileExists(filePath))) {
      logger.warn(`Local file not found: ${filePath}, will retry`);
      // 返回失败，由上层 callWithRetry 判断是否重试
      // shouldRetry 已配置 tokenExceeded 允许有限次重试
      return {
        success: false,
        error,
        userMessage: formatUserMessage(error),
      };
    }

    try {
      logger.info(`Reading large DSL from local file: ${filePath}`);
      const content = await readLargeFile(filePath);
      const dsl = JSON.parse(content);

      const validation = validateDsl(dsl);
      if (!validation.valid) {
        logger.error(`DSL validation failed`, validation.errors);
        return {
          success: false,
          error,
          userMessage: `## ❌ DSL 解析失败\n\n${validation.errors.join('\n')}`,
        };
      }

      const kbSize = Math.round(Buffer.byteLength(content, 'utf8') / 1024);
      logger.info(`Successfully read DSL from local file, size=${kbSize}KB`);
      return {
        success: true,
        dsl,
        userMessage: `✅ 成功从本地文件读取 Pixso 设计 (${kbSize} KB)`,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(
        `Failed to read local file`,
        err instanceof Error ? err : msg,
      );
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

import { getConfig } from './config';
import { logger } from './logger';

/**
 * 归一化 DSL 尺寸到项目设计稿标准
 */
export function normalizeDslDimensions<
  T extends { width: number; height: number },
>(dsl: T, originalDesignWidth: number, targetWidth?: number): T {
  const config = getConfig();
  const finalTargetWidth = targetWidth ?? config.defaultTargetWidth;
  const scale = calculateScale(originalDesignWidth, finalTargetWidth);
  const scaled = scaleDimensions(dsl, originalDesignWidth, {
    targetWidth: finalTargetWidth,
    roundToInt: true,
  });

  const result = {
    ...dsl,
    width: scaled.width,
    height: scaled.height,
  } as T;

  // 只有当原对象存在 x/y 属性时才添加
  if ('x' in dsl) {
    (result as { x: number }).x = scaled.x;
  }
  if ('y' in dsl) {
    (result as { y: number }).y = scaled.y;
  }

  logger.debug(
    `Normalized dimensions: ${(dsl as { width: number }).width}x${(dsl as { height: number }).height} -> ${scaled.width}x${scaled.height}`,
  );

  return result;
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
  maxRetries?: number,
): Promise<{ success: true; data: T } | { success: false; lastError: string }> {
  const config = getConfig();
  const finalMaxRetries = maxRetries ?? config.maxRetries;
  let retryCount = 0;

  logger.debug(`Starting callWithRetry, maxRetries=${finalMaxRetries}`);

  while (retryCount <= finalMaxRetries) {
    try {
      const data = await callFn();
      return { success: true, data };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const classified = classifyError(errorMsg);
      classified.retryCount = retryCount;

      logger.debug(`Attempt ${retryCount + 1} failed: ${errorMsg}`);

      if (!shouldRetry(classified) || retryCount >= finalMaxRetries) {
        logger.error(`All ${finalMaxRetries + 1} attempts failed`, classified);
        return { success: false, lastError: formatUserMessage(classified) };
      }

      const waitMs = getRetryDelay(classified);
      logger.info(`Retrying after ${waitMs}ms...`);
      await delay(waitMs);
      retryCount++;
    }
  }

  return { success: false, lastError: 'Max retries exceeded' };
}
