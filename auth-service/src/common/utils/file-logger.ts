import * as fs from 'fs';
import * as path from 'path';

/**
 * 错误日志信息接口
 */
export interface ErrorLogInfo {
  message: string;
  stack?: string;
  name?: string;
  method?: string;
  url?: string;
  ip?: string;
}

/**
 * 获取今天的日志文件名
 */
function getTodayLogFilePath(): string {
  const today = new Date().toISOString().split('T')[0];
  return path.join(process.cwd(), 'logs', `error-${today}.log`);
}

/**
 * 格式化错误日志
 */
function formatErrorLog(info: ErrorLogInfo): string {
  const timestamp = new Date().toISOString();
  let log = `[${timestamp}] [ERROR]`;

  if (info.method && info.url) {
    log += ` [${info.method} ${info.url}]`;
  }
  if (info.ip) {
    log += ` [IP: ${info.ip}]`;
  }
  log += '\n';

  if (info.name) {
    log += `${info.name}: `;
  }
  log += `${info.message}\n`;

  if (info.stack) {
    log += `Stack: ${info.stack}\n`;
  }

  log += `${'-'.repeat(60)}\n`;
  return log;
}

/**
 * 追加错误日志到文件
 */
export function appendErrorLog(info: ErrorLogInfo): void {
  try {
    const filePath = getTodayLogFilePath();
    const logContent = formatErrorLog(info);
    fs.appendFileSync(filePath, logContent, 'utf8');
  } catch (err) {
    // 日志写入失败不影响主流程，只在控制台输出
    console.error('[FILE-LOGGER] Failed to write error log:', err);
  }
}
