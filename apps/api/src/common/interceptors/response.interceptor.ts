import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { Response } from 'express';
import type { ApiSuccess } from '@adysre/types';

/**
 * Wraps every controller return value in the standard success envelope
 * `{ success, message, data, meta }` — see API_STANDARDS.md.
 * Controllers return raw data (or `{ data, meta }`) and stay clean.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccess<T>> {
  intercept(ctx: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccess<T>> {
    const res = ctx.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((payload) => {
        // A handler that took the raw Response (e.g. an OAuth redirect) has
        // already committed the response; wrapping it would throw "headers
        // already sent". Pass the (empty) payload straight through.
        if (res.headersSent) return payload as unknown as ApiSuccess<T>;
        if (payload && typeof payload === 'object' && 'data' in payload) {
          const { data, meta, message } = payload as {
            data: T;
            meta?: Record<string, unknown>;
            message?: string;
          };
          return { success: true, message: message ?? '', data, ...(meta ? { meta } : {}) };
        }
        return { success: true, message: '', data: payload };
      }),
    );
  }
}
