/**
 * 单条日志数据 DTO
 */
export class LogDataDto {
  /**
   * 日志时间戳 ISO 格式
   */
  timestamp: string;

  /**
   * 日志级别: debug | info | warn | error | access
   */
  level: string;

  /**
   * 日志数据对象，包含所有自定义字段
   */
  data: Record<string, unknown>;
}
