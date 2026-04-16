import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 获取当前登录用户 ID 的装饰器
 * 配合 JwtAuthGuard 使用
 */
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: { id?: string } }>();
    return request.user?.id;
  },
);
