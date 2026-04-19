import { LogDataDto } from './log-data.dto';

/**
 * 批量接收日志 DTO
 */
export class BatchLogsDto {
  /**
   * 日志数组，支持批量发送多条日志
   */
  logs: LogDataDto[];
}
