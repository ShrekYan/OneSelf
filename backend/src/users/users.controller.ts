import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UserInfoDto, UpdateProfileDto } from './dto';

/**
 * 用户信息控制器
 * 处理用户信息相关的 HTTP 请求
 */
@ApiTags('用户信息')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: UserInfoDto,
  })
  getUserInfo(@CurrentUserId() userId: string): Promise<UserInfoDto> {
    return this.usersService.getUserInfo(userId);
  }

  @Put('info')
  @ApiOperation({ summary: '更新当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: UserInfoDto,
  })
  updateProfile(
    @CurrentUserId() userId: string,
    @Body() updateDto: UpdateProfileDto,
  ): Promise<UserInfoDto> {
    return this.usersService.updateProfile(userId, updateDto);
  }
}
