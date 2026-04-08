import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ApiResult } from './common/result/api-result';
import { BusinessErrorCode } from './common/constants/business-error-codes';

// @Controller() 是 NestJS 提供的装饰器，用于声明一个控制器（Controller）。
// 控制器负责处理 incoming requests 并返回 responses。
// 加了它后，NestJS 会自动扫描并加载该控制器下的所有路由处理方法，实现路由的自动发现与注册。
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  // @Get() 是 NestJS 提供的装饰器，用于声明一个路由处理方法（Handler Method）。
  // 加了它后，NestJS 会自动将该方法注册为处理 GET / 路由的处理函数。
  @Get('/getHello')
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 数据库健康检查
   * 返回数据库当前连接状态
   */
  @Get('health/database')
  @ApiTags('health')
  async checkDatabaseHealth(): Promise<ApiResult<{ connected: boolean }>> {
    const connected = await this.prismaService.isConnected();
    if (connected) {
      return ApiResult.success({ connected: true });
    }
    return ApiResult.error(
      BusinessErrorCode.DATABASE_CONNECTION_ERROR,
      '数据库连接异常',
    );
  }
}
