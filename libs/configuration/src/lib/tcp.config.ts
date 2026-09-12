import { ClientProvider, TcpClientOptions, Transport } from '@nestjs/microservices';
import { ClientsModuleAsyncOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsObject } from 'class-validator';

export enum TCP_SERVICES {
  INVOICES = 'INVOICES',
  PRODUCTS = 'PRODUCTS',
  USER_ACCESS = 'USER_ACCESS',
  AUTHORIZER = 'AUTHORIZER',
}

export class TCPConfiguration {
  @IsNotEmpty()
  @IsObject()
  [TCP_SERVICES.INVOICES]: TcpClientOptions;
  [TCP_SERVICES.PRODUCTS]: TcpClientOptions;
  [TCP_SERVICES.USER_ACCESS]: TcpClientOptions;
  [TCP_SERVICES.AUTHORIZER]: TcpClientOptions;
  constructor() {
    Object.entries(TCP_SERVICES).forEach(([key, serviceName]) => {
      this[serviceName] = TCPConfiguration.setValue({
        host: process.env[`TCP_${key}_HOST`] || '',
        port: Number(process.env[`TCP_${key}_PORT`]),
      });
    });
  }

  static setValue({ port, host }: { port: number; host: string }): TcpClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    };
  }
}

export const getTcpProvider = (serviceName: keyof typeof TCP_SERVICES): ClientsModuleAsyncOptions => {
  return [
    {
      name: serviceName,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get(`TCP_SERVICES.${serviceName}`) as ClientProvider;
      },
    },
  ];
};
