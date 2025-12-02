import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging interceptor
 * Logs all incoming requests and their processing time
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
    }>();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`${method} ${url} ${Date.now() - now}ms`)));
  }
}
