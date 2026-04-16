import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessException } from '../common/exceptions/business.exception';
import { BusinessErrorCode } from '../common/constants/business-error-codes';
import { UserSyncService } from './user-sync.service';
import { UserInfoDto } from './dto';
import { UpdateProfileDto } from './dto';
import type { Users } from '@prisma/client';

/**
 * 用户信息服务
 * 负责用户信息查询、更新等业务逻辑
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userSyncService: UserSyncService,
  ) {}

  /**
   * 获取当前用户信息
   * @param userId - 用户 ID
   * @returns 用户信息 DTO
   */
  async getUserInfo(userId: string): Promise<UserInfoDto> {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BusinessException(BusinessErrorCode.USER_NOT_FOUND);
    }

    return this.mapToDto(user);
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

    const existing = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new BusinessException(BusinessErrorCode.USER_NOT_FOUND);
    }

    // 更新用户信息

    const updateData: Record<string, unknown> = {
      updated_at: BigInt(Date.now()),
    };

    if (updateDto.nickname !== undefined) {
      (updateData as Record<string, string | undefined>).nickname =
        updateDto.nickname;
    }
    if (updateDto.avatar !== undefined) {
      (updateData as Record<string, string | undefined>).avatar =
        updateDto.avatar;
    }
    if (updateDto.bio !== undefined) {
      (updateData as Record<string, string | undefined>).bio = updateDto.bio;
    }

    const updated = await this.prismaService.users.update({
      where: { id: userId },
      data: updateData,
    });

    // 更新用户信息后，删除缓存保证一致性
    // existing 是查询得到的，肯定有 username
    const username = (existing).username;
    if (username) {
      await this.userSyncService.deleteUserFromRedis(username);
      // 同步更新到预加载缓存（写穿透）
      const updatedUserFull = await this.prismaService.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          password_hash: true,
          password_algorithm: true,
          is_active: true,
          email: true,
          nickname: true,
          avatar: true,
          created_at: true,
          updated_at: true,
        },
      });
      if (updatedUserFull) {
        await this.userSyncService.syncSingleUserToRedis(username, {
          id: updatedUserFull.id,
          username: updatedUserFull.username,
          password_hash: updatedUserFull.password_hash,
          password_algorithm: updatedUserFull.password_algorithm,
          is_active: updatedUserFull.is_active,
          email: updatedUserFull.email,
          nickname: updatedUserFull.nickname,
          avatar: updatedUserFull.avatar,
          created_at: updatedUserFull.created_at,
          updated_at: updatedUserFull.updated_at,
        });
      }
    }

    return this.mapToDto(updated);
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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      bio: (user as any).bio ?? undefined,
    };
  }
}
