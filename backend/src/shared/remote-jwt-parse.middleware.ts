import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthClientService } from './auth-client.service';

@Injectable()
export class RemoteJwtParseMiddleware implements NestMiddleware {
  constructor(private readonly authClient: AuthClientService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      req.userId = undefined;
      next();
      return;
    }

    try {
      const result = await this.authClient.introspect(token);

      if (result.valid) {
        req.userId = result.userId!;
      } else {
        req.userId = undefined;
      }
    } catch {
      req.userId = undefined;
    }

    next();
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
