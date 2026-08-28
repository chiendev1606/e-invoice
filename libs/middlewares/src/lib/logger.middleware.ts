// logger.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getProcessId } from '@common/utils/string.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    const start = Date.now();
    const { method, originalUrl, body } = req;
    const processId = getProcessId();
    const originalSend = res.send.bind(res);

    Logger.log(`start [${processId}] [${method}] ${originalUrl} - Request Body: ${JSON.stringify(body)}`);

    res.send = (body: unknown) => {
      const duration = Date.now() - start;
      Logger.log(`end [${processId}] [${method}] ${originalUrl} - ${res.statusCode} - ${duration}ms`);
      return originalSend(body);
    };

    next();
  }
}
