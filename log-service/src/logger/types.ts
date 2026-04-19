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
 * 日志模块配置
 */
export interface LoggerConfig {
  /** 服务标识（区分不同服务，用于 Graylog 和日志过滤） */
  hostname: string;
  /** 是否启用 Graylog */
  graylogEnabled: boolean;
  /** Graylog 服务器地址 */
  graylogHost?: string;
  /** Graylog UDP 端口 */
  graylogPort: number;
}

/**
 * GELF 消息格式 (Graylog Extended Log Format v1.1)
 * @see https://docs.graylog.org/docs/gelf
 */
export interface GelfMessage {
  /** GELF version */
  version: '1.1';
  /** 主机名/服务名 */
  host: string;
  /** 简短消息 */
  short_message: string;
  /** 完整消息（通常是堆栈） */
  full_message?: string;
  /** 系统日志级别 (numeric) */
  level: number;
  /** Unix 时间戳（秒） */
  timestamp: number;
  /** 自定义字段必须以下划线开头 */
  [key: string]: unknown;
}

/**
 * 标准 syslog 级别（GELF 使用）
 * @see https://en.wikipedia.org/wiki/Syslog#Severity_level
 */
export enum SyslogLevel {
  EMERGENCY = 0,
  ALERT = 1,
  CRITICAL = 2,
  ERROR = 3,
  WARNING = 4,
  NOTICE = 5,
  INFO = 6,
  DEBUG = 7,
}

/**
 * 映射我们的日志级别到 syslog 级别
 */
export const levelToSyslog: Record<string, SyslogLevel> = {
  emerg: SyslogLevel.EMERGENCY,
  panic: SyslogLevel.EMERGENCY,
  fatal: SyslogLevel.CRITICAL,
  error: SyslogLevel.ERROR,
  err: SyslogLevel.ERROR,
  warning: SyslogLevel.WARNING,
  warn: SyslogLevel.WARNING,
  info: SyslogLevel.INFO,
  notice: SyslogLevel.NOTICE,
  debug: SyslogLevel.DEBUG,
  trace: SyslogLevel.DEBUG,
  access: SyslogLevel.INFO,
};

/**
 * 扩展 Express Request 类型添加自定义属性
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      startTime?: number;
      error?: Error;
      user?: { id: unknown };
    }

    interface Response {
      /** 捕获到的响应数据，由 ResponseLogInterceptor 添加 */
      resBody?: unknown;
    }
  }
}
