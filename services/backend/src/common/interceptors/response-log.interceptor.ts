import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 响应日志拦截器
 *
 * 职责：捕获控制器返回的响应数据，挂载到 response 对象上
 * 供 RequestLogMiddleware 统一记录日志
 */
@Injectable()
export class ResponseLogInterceptor implements NestInterceptor<
  unknown,
  unknown
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Express.Response>();

    return next.handle().pipe(
      map(data => {
        // 将响应数据挂载到 response 上供日志中间件使用（语义更清晰）
        (response as Express.Response & { resBody?: unknown }).resBody = data;
        return data;
      }),
    );
  }
}
