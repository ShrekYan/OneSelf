import { IsArray, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 单条日志数据 DTO
 */
export class LogDataDto {
  @ApiProperty({
    description: '日志时间戳 ISO 格式',
    example: '2026-04-17T12:34:56.789Z',
  })
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({
    description: '日志级别',
    example: 'info',
    enum: ['debug', 'info', 'warn', 'error', 'access'],
  })
  @IsNotEmpty()
  level: string;

  @ApiProperty({
    description: '日志数据对象，包含所有自定义字段',
    example: {
      message: 'Request processed',
      method: 'GET',
      url: '/api/articles',
    },
    additionalProperties: true,
  })
  @IsObject()
  data: Record<string, unknown>;
}

/**
 * 批量接收日志 DTO
 */
export class BatchLogsDto {
  @ApiProperty({
    description: '日志数组，支持批量发送多条日志',
    type: [LogDataDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogDataDto)
  logs: LogDataDto[];
}

/**
 * 批量接收日志响应 DTO
 */
export class BatchLogsResponseDto {
  @ApiProperty({
    description: '成功接收的日志条数',
    example: 10,
  })
  received: number;

  @ApiProperty({
    description: '响应时间戳',
    example: '2026-04-17T12:34:56.789Z',
  })
  timestamp: string;
}

/**
 * 健康检查响应 DTO
 */
export class HealthCheckResponseDto {
  @ApiProperty({
    description: '健康状态',
    example: 'ok',
  })
  status: string;

  @ApiProperty({
    description: '当前服务器时间戳',
    example: '2026-04-17T12:34:56.789Z',
  })
  timestamp: string;
}
