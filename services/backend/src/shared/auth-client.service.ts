import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface IntrospectResponse {
  valid: boolean;
  userId?: string;
  expiresIn?: number;
  error?: 'INVALID_TOKEN' | 'EXPIRED' | 'MISSING';
}

@Injectable()
export class AuthClientService {
  private readonly authServiceBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceBaseUrl = this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:8889',
    );
  }

  async introspect(accessToken: string): Promise<IntrospectResponse> {
    const url = `${this.authServiceBaseUrl}/api/v1/introspect`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, { accessToken }),
      );

      const data = response.data as {
        code: number;
        data: IntrospectResponse;
      };

      if (data.code === 200) {
        return data.data;
      }

      return {
        valid: false,
        error: 'INVALID_TOKEN',
      };
    } catch {
      return {
        valid: false,
        error: 'INVALID_TOKEN',
      };
    }
  }

  /**
   * 向 auth-service 发送请求
   * @param path 请求路径
   * @param body 请求体
   * @returns 响应数据
   */
  async forwardRequest<T>(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const url = `${this.authServiceBaseUrl}/api/v1/${path}`;
    const response = await firstValueFrom(
      this.httpService.post(url, body, { headers }),
    );
    return response.data as T;
  }

  /**
   * 向 auth-service 发送请求（包含完整 headers）
   * 用于需要转发 Set-Cookie 的场景
   */
  async forwardRequestWithHeaders<T>(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<{ data: T; headers: Record<string, string[]> }> {
    const url = `${this.authServiceBaseUrl}/api/v1/${path}`;
    const response = await firstValueFrom(
      this.httpService.post(url, body, { headers }),
    );
    return {
      data: response.data as T,
      headers: response.headers as Record<string, string[]>,
    };
  }

  /**
   * 向 auth-service 发送健康检查请求
   * @returns 健康检查响应
   */
  async healthCheck(): Promise<{ status: string; timestamp: number }> {
    const url = `${this.authServiceBaseUrl}/api/v1/health`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data as {
        code: number;
        data: { status: string; timestamp: number };
      };
      return data.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Auth service health check failed: ${message}`);
    }
  }
}
