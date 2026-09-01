import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const params = context.getArgs()[0];
    const handlerName = context.getHandler().name;
    const now = Date.now();
    const processID = params?.processID;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        Logger.log(
          `end [ProcessID ${processID}] - ${duration}ms, params: ${JSON.stringify(params)}, handler ${handlerName}`,
        );
      }),
    );
  }
}
