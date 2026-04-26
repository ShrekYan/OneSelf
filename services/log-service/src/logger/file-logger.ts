import * as fs from 'fs';
import * as path from 'path';
import type { ErrorLogInfo } from './types';
import { getLoggerConfig } from './logger.config';
import { sendToGraylog } from './graylog';

/**
 * 获取今天的日志文件名
 */
function getTodayLogFilePath(level: string): string {
  const today = new Date().toISOString().split('T')[0];
  return path.join(process.cwd(), 'logs', `${level}-${today}.log`);
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
    const filePath = getTodayLogFilePath('error');
    const logContent = formatErrorLog(info);
    ensureDirExists(filePath);
    fs.appendFileSync(filePath, logContent, 'utf8');
  } catch (err) {
    // 日志写入失败不影响主流程，只在控制台输出
    console.error('[FILE-LOGGER] Failed to write error log:', err);
  }
}

/**
 * 追加 JSON 格式日志到文件（按 level 分文件存储）
 * 同时如果启用了 Graylog，也发送过去
 * @param data JSON 日志数据对象
 */
export function appendJsonLog(data: Record<string, unknown>): void {
  try {
    const config = getLoggerConfig();
    const level = (data.level as string) || 'access';
    const filePath = getTodayLogFilePath(level);

    // 添加 hostname 字段用于区分服务
    const logData = {
      hostname: config.hostname,
      ...data,
    };

    ensureDirExists(filePath);
    const logLine = JSON.stringify(logData) + '\n';
    fs.appendFileSync(filePath, logLine, 'utf8');

    // 如果启用了 Graylog，同时发送
    if (config.graylogEnabled && config.graylogHost) {
      sendToGraylog(config, logData).catch(err => {
        console.warn('[GRAYLOG] Failed to send log:', err);
      });
    }
  } catch (err) {
    // 日志写入失败不影响主流程，只在控制台输出
    console.error('[FILE-LOGGER] Failed to write JSON log:', err);
  }
}

/**
 * 确保日志目录存在
 */
function ensureDirExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
