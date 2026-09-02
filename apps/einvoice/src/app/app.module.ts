import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_INTERCEPTOR, useClass: TcpLoggingInterceptor }],
})
export class AppModule {
  static APP_CONFIGURATION = CONFIGURATION;
}
