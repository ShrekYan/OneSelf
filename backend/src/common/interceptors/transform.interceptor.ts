import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResult } from '../result/api-result';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResult<T> | Record<string, unknown>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResult<T> | Record<string, unknown>> {
    return next.handle().pipe(
      map((data) => {
        // 如果已经是 ApiResult 格式，直接返回，不再重复包装
        if (data instanceof ApiResult) {
          return data;
        }
        // 否则，包装成标准格式
        return {
          code: 200,
          message: 'Success',
          data,
        };
      }),
    );
  }
}
