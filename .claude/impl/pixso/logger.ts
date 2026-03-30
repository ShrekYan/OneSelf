/**
 * Pixso MCP 模块日志系统
 * 分级日志输出，支持配置日志级别
 */

/**
 * 日志级别枚举
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * 当前日志级别
 */
let currentLevel: LogLevel = 'info';

/**
 * 设置日志级别
 */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

/**
 * 获取当前日志级别
 */
export function getLogLevel(): LogLevel {
  return currentLevel;
}

/**
 * 判断是否应该输出该级别日志
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[currentLevel];
}

/**
 * 格式化时间戳
 */
function formatTimestamp(): string {
  const now = new Date();
  return now.toISOString();
}

/**
 * 调试日志
 */
export function debug(message: string, context?: Record<string, unknown>): void {
  if (!shouldLog('debug')) return;
  console.debug(`[${formatTimestamp()}] [PIXSO] [DEBUG] ${message}`, context ?? '');
}

/**
 * 信息日志
 */
export function info(message: string, context?: Record<string, unknown>): void {
  if (!shouldLog('info')) return;
  console.info(`[${formatTimestamp()}] [PIXSO] [INFO] ${message}`, context ?? '');
}

/**
 * 警告日志
 */
export function warn(message: string, context?: Record<string, unknown>): void {
  if (!shouldLog('warn')) return;
  console.warn(`[${formatTimestamp()}] [PIXSO] [WARN] ${message}`, context ?? '');
}

/**
 * 错误日志
 */
export function error(message: string, context?: Record<string, unknown> | Error): void {
  if (!shouldLog('error')) return;
  if (context instanceof Error) {
    console.error(`[${formatTimestamp()}] [PIXSO] [ERROR] ${message}`, context);
  } else {
    console.error(`[${formatTimestamp()}] [PIXSO] [ERROR] ${message}`, context ?? '');
  }
}

/**
 * 导出日志对象，便于使用
 */
export const logger = {
  debug,
  info,
  warn,
  error,
  setLevel: setLogLevel,
  getLevel: getLogLevel,
};
