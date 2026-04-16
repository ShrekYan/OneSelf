import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IntrospectRequestDto } from './dto/introspect-request.dto';
import { IntrospectResponseDto } from './dto/introspect-response.dto';

@Injectable()
export class IntrospectService {
  constructor(private configService: ConfigService) {}

  introspect(dto: IntrospectRequestDto): IntrospectResponseDto {
    const { accessToken } = dto;

    if (!accessToken) {
      return {
        valid: false,
        error: 'MISSING',
      };
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      return {
        valid: false,
        error: 'INVALID_TOKEN',
      };
    }

    try {
      const decoded = verify(accessToken, jwtSecret) as {
        sub: string;
        exp: number;
      };

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;

      if (expiresIn <= 0) {
        return {
          valid: false,
          error: 'EXPIRED',
        };
      }

      return {
        valid: true,
        userId: decoded.sub,
        expiresIn,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'INVALID_TOKEN',
      };
    }
  }
}
