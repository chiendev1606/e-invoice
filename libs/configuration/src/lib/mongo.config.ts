import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Connection } from 'mongoose';

export class MongoDbConfig {
  @IsNotEmpty()
  @IsString()
  MONGO_URI: string;

  @IsNotEmpty()
  @IsString()
  MONGO_DB_NAME: string;

  @IsNotEmpty()
  @IsNumber()
  POOL_SIZE: number;

  @IsNotEmpty()
  @IsNumber()
  CONNECT_TIMEOUT_MS: number;

  @IsNotEmpty()
  @IsNumber()
  SOCKET_TIMEOUT_MS: number;

  constructor() {
    this.MONGO_URI = process.env['MONGO_URI'] || '';
    this.MONGO_DB_NAME = process.env['MONGO_DB_NAME'] || '';
    this.POOL_SIZE = Number(process.env['POOL_SIZE']);
    this.CONNECT_TIMEOUT_MS = Number(process.env['CONNECT_TIMEOUT_MS']) || 30000;
    this.SOCKET_TIMEOUT_MS = Number(process.env['SOCKET_TIMEOUT_MS']) || 30000;
  }
}

export const getMongoDbProvider = () => {
  return MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      return {
        uri: config.get('MONGO_DB.MONGO_URI'),
        dbName: config.get('MONGO_DB.MONGO_DB_NAME'),
        maxPoolSize: config.get('MONGO_DB.POOL_SIZE'),
        connectTimeoutMS: config.get('MONGO_DB.CONNECT_TIMEOUT_MS'),
        socketTimeoutMS: config.get('MONGO_DB.SOCKET_TIMEOUT_MS'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => Logger.log('connected'));
          connection.on('open', () => Logger.log('open'));
          connection.on('disconnected', () => Logger.log('disconnected'));
          connection.on('reconnected', () => Logger.log('reconnected'));
          connection.on('disconnecting', () => Logger.log('disconnecting'));

          return connection;
        },
      };
    },
  });
};
