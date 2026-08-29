// logger.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getProcessId } from '@common/utils/string.util';
import { MetadataKeys } from '@common/constants/common.constant';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    const start = Date.now();
    const { method, originalUrl, body } = req;
    const processID = getProcessId();
    (req as any)[MetadataKeys.processID] = processID;
    (req as any)[MetadataKeys.startTime] = Date.now();
    const originalSend = res.send.bind(res);

    Logger.log(`start [ProcessID ${processID}] [${method}] ${originalUrl} - Request Body: ${JSON.stringify(body)}`);

    res.send = (body: unknown) => {
      const duration = Date.now() - start;
      Logger.log(`end [ProcessID ${processID}] [${method}] ${originalUrl} - ${res.statusCode} - ${duration}ms`);
      return originalSend(body);
    };

    next();
  }
}
