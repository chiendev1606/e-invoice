// src/common/interceptors/logging.interceptor.ts
import { MetadataKeys } from '@common/constants/common.constant';
import { HttpMessage } from '@common/constants/enums/http-messages.enum';
import { ResponseDto } from '@common/interfaces/gate-way/response.interface';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, catchError, map } from 'rxjs';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startTime = (request as any)[MetadataKeys.startTime];
    const processID = (request as any)[MetadataKeys.processID];

    return next.handle().pipe(
      map((response) => ({
        ...response,
        duration: Date.now() - startTime,
        processID: processID,
      })),
      catchError((error) => {
        Logger.error(error);
        const duration = (Date.now() - startTime).toString();
        const message = error?.response?.message || error.message || error || HttpMessage.INTERNAL_SERVER_ERROR;
        const statusCode = Number(
          error.code || error.statusCode || error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
        throw new HttpException(new ResponseDto({ message, processID, data: null, duration, statusCode }), statusCode);
      }),
    );
  }
}
