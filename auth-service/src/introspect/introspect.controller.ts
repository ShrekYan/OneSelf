import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IntrospectService } from './introspect.service';
import { IntrospectRequestDto } from './dto/introspect-request.dto';
import { IntrospectResponseDto } from './dto/introspect-response.dto';
import { ApiResponse } from '@/common/decorators/api-response.decorator';
import { ApiResult } from '@/common/result/api-result';

@ApiTags('introspect')
@Controller()
export class IntrospectController {
  constructor(private readonly introspectService: IntrospectService) {}

  @Post('introspect')
  @ApiResponse({
    description: 'Validate access token',
    type: IntrospectResponseDto,
  })
  introspect(
    @Body() dto: IntrospectRequestDto,
  ): ApiResult<IntrospectResponseDto> {
    const result = this.introspectService.introspect(dto);
    return ApiResult.success(result);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  health(): ApiResult<{ status: string; timestamp: number }> {
    return ApiResult.success({
      status: 'ok',
      timestamp: Date.now(),
    });
  }
}
