/**
 * 日志工具函数 - 处理敏感数据脱敏和大数据截断
 */

/** 默认敏感字段列表 */
const DEFAULT_SENSITIVE_FIELDS = [
  'password',
  'secret',
  'token',
  'apiKey',
  'api_key',
  'creditCard',
  'credit_card',
  'cardNumber',
  'card_number',
  'cvv',
  'ssn',
  'socialSecurity',
  'privateKey',
  'private_key',
  'accessToken',
  'refreshToken',
];

/** 默认最大长度（适配 Graylog UDP 消息大小限制） */
const DEFAULT_MAX_LENGTH = 4096;

/**
 * 递归脱敏对象中的敏感字段
 * @param data 原始数据
 * @param sensitiveFields 自定义敏感字段
 */
export function sanitizeSensitiveData(
  data: unknown,
  sensitiveFields?: string[],
): unknown {
  const fieldsToSanitize = [
    ...DEFAULT_SENSITIVE_FIELDS,
    ...(sensitiveFields || []),
  ];

  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeSensitiveData(item, sensitiveFields));
  }

  const result = { ...data };
  for (const [key, value] of Object.entries(result)) {
    if (
      fieldsToSanitize.some(field =>
        key.toLowerCase().includes(field.toLowerCase()),
      )
    ) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = sanitizeSensitiveData(value, sensitiveFields);
    }
  }
  return result;
}

/**
 * 截断过长的 JSON 字符串
 * @param data 数据对象
 * @param maxLength 最大长度
 */
export function truncateLargeData(
  data: unknown,
  maxLength: number = DEFAULT_MAX_LENGTH,
): unknown {
  const json = JSON.stringify(data);
  if (json.length <= maxLength) {
    return data;
  }
  // 截断并添加提示
  return `${json.substring(0, maxLength)}... [TRUNCATED, total: ${json.length} characters]`;
}

/**
 * 判断是否应该跳过记录请求/响应体
 * @param contentType Content-Type 请求头
 */
export function shouldSkipBodyLogging(contentType?: string): boolean {
  if (!contentType) {
    return false;
  }
  const lower = contentType.toLowerCase();
  return (
    lower.includes('multipart/form-data') ||
    lower.includes('application/octet-stream') ||
    lower.startsWith('image/') ||
    lower.startsWith('video/') ||
    lower.startsWith('audio/')
  );
}

/**
 * 读取环境配置的布尔值
 */
export function getConfigBool(key: string, defaultValue: boolean): boolean {
  const val = process.env[key];
  if (val === undefined) {
    return defaultValue;
  }
  return val.toLowerCase() === 'true' || val === '1';
}

/**
 * 读取环境配置的数字
 */
export function getConfigNumber(key: string, defaultValue: number): number {
  const val = process.env[key];
  if (!val) {
    return defaultValue;
  }
  const num = parseInt(val, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 读取环境配置的敏感字段列表
 */
export function getConfigSensitiveFields(): string[] {
  const val = process.env.REQUEST_LOG_SENSITIVE_FIELDS;
  if (!val) {
    return [];
  }
  return val
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}
