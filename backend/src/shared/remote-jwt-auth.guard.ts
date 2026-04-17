import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthClientService, IntrospectResponse } from './auth-client.service';

@Injectable()
export class RemoteJwtAuthGuard implements CanActivate {
  constructor(private readonly authClient: AuthClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        code: 'MISSING_TOKEN',
        message: '缺少访问令牌',
      });
    }

    const result: IntrospectResponse = await this.authClient.introspect(token);

    if (!result.valid) {
      if (result.error === 'EXPIRED') {
        throw new UnauthorizedException({
          code: 'EXPIRED_TOKEN',
          message: '访问令牌已过期',
        });
      }
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN',
        message: '访问令牌无效',
      });
    }

    // Attach userId to request
    if (!result.userId) {
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN',
        message: '访问令牌无效，缺少用户标识',
      });
    }
    request.userId = result.userId;
    if (result.expiresIn !== undefined) {
      request.expiresIn = result.expiresIn;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
