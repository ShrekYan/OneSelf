import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { appendJsonLog } from '../logger/file-logger';
import {
  BatchLogsDto,
  BatchLogsResponseDto,
  HealthCheckResponseDto,
} from './dto/batch-logs.dto';

/**
 * 日志接收控制器
 * 接收其他服务推送过来的日志，统一写入日志文件
 */
@ApiTags('logs')
@Controller('logs')
export class LogController {
  /**
   * 批量接收日志
   * 其他服务可以批量推送多条日志到中央日志服务
   * 日志会写入本地文件并同步发送到 Graylog（如果启用）
   */
  @ApiOperation({
    summary: '批量接收日志',
    description: '接收多个服务推送的日志批量写入，返回成功接收数量',
  })
  @Post('batch')
  @HttpCode(HttpStatus.ACCEPTED)
  batchReceiveLogs(@Body() dto: BatchLogsDto): BatchLogsResponseDto {
    for (const item of dto.logs) {
      appendJsonLog({
        timestamp: item.timestamp,
        level: item.level,
        ...item.data,
      });
    }
    return {
      received: dto.logs.length,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 健康检查
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  /**
   * 健康检查接口
   * 用于探测服务是否正常运行
   */
  @ApiOperation({
    summary: '健康检查',
    description: '返回服务健康状态',
  })
  @Get()
  healthCheck(): HealthCheckResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
