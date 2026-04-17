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
      throw new UnauthorizedException('Missing access token');
    }

    const result: IntrospectResponse = await this.authClient.introspect(token);

    if (!result.valid) {
      throw new UnauthorizedException(
        result.error === 'EXPIRED' ? 'Token expired' : 'Invalid token',
      );
    }

    // Attach userId to request
    request.userId = result.userId!;
    request.expiresIn = result.expiresIn!;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
