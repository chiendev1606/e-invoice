import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { HttpMessage } from '@common/constants/enums/http-messages.enum';

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
      catchError((error) => {
        Logger.error(
          `error [ProcessID ${processID}] - ${error.message}, params: ${JSON.stringify(
            params,
          )}, handler ${handlerName}`,
        );
        console.error(error);
        const statusCode = Number(
          error.code || error.statusCode || error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
        const message = error?.response?.message || error.message || error || HttpMessage.INTERNAL_SERVER_ERROR;

        throw new RpcException({
          statusCode,
          message,
        });
      }),
    );
  }
}
