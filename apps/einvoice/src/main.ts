/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';
import { TCP_SERVICES } from '@common/configuration/tcp.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        host: AppModule.APP_CONFIGURATION.TCP_SERVICES[TCP_SERVICES.INVOICES].options?.host,
        port: AppModule.APP_CONFIGURATION.TCP_SERVICES[TCP_SERVICES.INVOICES].options?.port,
      },
    },
    { inheritAppConfig: true },
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.INVOICE_PORT || 3000;

  await app.startAllMicroservices();

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
