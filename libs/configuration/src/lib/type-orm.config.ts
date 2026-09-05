import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export class TypeOrmConfig {
  @IsNotEmpty()
  @IsString()
  TYPE: DatabaseType;

  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  USERNAME: string;

  @IsNotEmpty()
  @IsString()
  PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DATABASE: string;

  constructor() {
    this.DATABASE = process.env['POSTGRES_DB'] || '';
    this.HOST = process.env['POSTGRES_HOST'] || '';
    this.PORT = Number(process.env['POSTGRES_PORT']);
    this.USERNAME = process.env['POSTGRES_USER'] || '';
    this.PASSWORD = process.env['POSTGRES_PASSWORD'] || '';
    this.TYPE = 'postgres';
  }
}

export const getTypeOrmProvider = () => {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) =>
      ({
        type: config.get('TYPE_ORM_CONFIG.TYPE'),
        host: config.get('TYPE_ORM_CONFIG.HOST'),
        port: config.get('TYPE_ORM_CONFIG.PORT'),
        username: config.get('TYPE_ORM_CONFIG.USERNAME'),
        password: config.get('TYPE_ORM_CONFIG.PASSWORD'),
        database: config.get('TYPE_ORM_CONFIG.DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      } as TypeOrmModuleOptions),
  });
};
