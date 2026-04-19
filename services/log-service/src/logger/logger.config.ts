import * as os from 'os';
import type { LoggerConfig } from './types';

/**
 * 默认日志配置
 */
export const defaultLoggerConfig: LoggerConfig = {
  hostname: os.hostname(),
  graylogEnabled: false,
  graylogPort: 12201,
};

/**
 * 从环境变量加载日志配置
 */
export function loadLoggerConfig(): LoggerConfig {
  return {
    hostname: process.env.LOGGER_HOSTNAME || defaultLoggerConfig.hostname,
    graylogEnabled:
      (process.env.GRAYLOG_ENABLED || 'false').toLowerCase() === 'true',
    graylogHost: process.env.GRAYLOG_HOST,
    graylogPort: process.env.GRAYLOG_PORT
      ? parseInt(process.env.GRAYLOG_PORT, 10)
      : defaultLoggerConfig.graylogPort,
  };
}

/**
 * 单例缓存配置
 */
let cachedConfig: LoggerConfig | null = null;

/**
 * 获取日志配置（单例）
 */
export function getLoggerConfig(): LoggerConfig {
  if (!cachedConfig) {
    cachedConfig = loadLoggerConfig();
  }
  return cachedConfig;
}
