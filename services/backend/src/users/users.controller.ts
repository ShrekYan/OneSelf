import { Controller, Post, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { RemoteJwtAuthGuard } from '../shared/remote-jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UserDto, UpdateProfileDto } from './dto';

/**
 * 用户信息控制器
 * 处理用户信息相关的 HTTP 请求
 */
@ApiTags('用户信息')
@ApiBearerAuth()
@Controller('user')
@UseGuards(RemoteJwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('info')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: UserDto,
  })
  getUserInfo(@CurrentUserId() userId: string): Promise<UserDto> {
    return this.usersService.getUserInfo(userId);
  }

  @Put('info')
  @ApiOperation({ summary: '更新当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: UserDto,
  })
  updateProfile(
    @CurrentUserId() userId: string,
    @Body() updateDto: UpdateProfileDto,
  ): Promise<UserDto> {
    return this.usersService.updateProfile(userId, updateDto);
  }
}
