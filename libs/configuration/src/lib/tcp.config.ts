import { ClientProvider, TcpClientOptions, Transport } from '@nestjs/microservices';
import { ClientsModuleAsyncOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsObject } from 'class-validator';

export enum TCP_SERVICES {
  INVOICES = 'INVOICES',
  PRODUCTS = 'PRODUCTS',
}

export class TCPConfiguration {
  @IsNotEmpty()
  @IsObject()
  [TCP_SERVICES.INVOICES]: TcpClientOptions;
  [TCP_SERVICES.PRODUCTS]: TcpClientOptions;
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
