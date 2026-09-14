import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CONFIGURATION } from '../configuration';

import { KeycloakModule } from './keycloak/keycloak.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    KeycloakModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: TcpLoggingInterceptor }],
})
export class AppModule {
  static APP_CONFIGURATION = CONFIGURATION;
}
