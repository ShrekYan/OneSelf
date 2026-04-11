import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessException } from '../common/exceptions/business.exception';
import { BusinessErrorCode } from '../common/constants/business-error-codes';
import { UserInfoDto } from './dto';
import { UpdateProfileDto } from './dto';
import type { Users } from '@prisma/client';

/**
 * 用户信息服务
 * 负责用户信息查询、更新等业务逻辑
 */
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 获取当前用户信息
   * @param userId - 用户 ID
   * @returns 用户信息 DTO
   */
  async getUserInfo(userId: string): Promise<UserInfoDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const user = await (this.prismaService as any).users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BusinessException(BusinessErrorCode.USER_NOT_FOUND);
    }

    return this.mapToDto(user as Users);
  }

  /**
   * 更新当前用户信息
   * @param userId - 用户 ID
   * @param updateDto - 更新请求数据
   * @returns 更新后的用户信息
   */
  async updateProfile(
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<UserInfoDto> {
    // 检查用户是否存在
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const existing = await (this.prismaService as any).users.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new BusinessException(BusinessErrorCode.USER_NOT_FOUND);
    }

    // 更新用户信息

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      updated_at: BigInt(Date.now()),
    };

    if (updateDto.nickname !== undefined) {
      updateData.nickname = updateDto.nickname;
    }
    if (updateDto.avatar !== undefined) {
      updateData.avatar = updateDto.avatar;
    }
    if (updateDto.bio !== undefined) {
      updateData.bio = updateDto.bio;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const updated = await (this.prismaService as any).users.update({
      where: { id: userId },
      data: updateData,
    });

    return this.mapToDto(updated as Users);
  }

  /**
   * 映射用户实体到 DTO
   * @param user - 用户实体
   * @returns 用户信息 DTO
   */
  private mapToDto(user: Users): UserInfoDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email ?? undefined,
      nickname: user.nickname ?? undefined,
      avatar: user.avatar ?? undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      bio: (user as any).bio ?? undefined,
    };
  }
}
