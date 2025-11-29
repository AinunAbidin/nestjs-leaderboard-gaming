import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();
    const statusCode = res.statusCode ?? 200;
    return next.handle().pipe(
      map((data) => ({
        success: true,
        code: statusCode,
        message: 'OK',
        data: data === undefined || data === null ? [] : [data],
      })),
    );
  }
}
