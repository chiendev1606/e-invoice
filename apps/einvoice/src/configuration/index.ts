import { AppConfiguration } from '@common/configuration/app.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TCPConfiguration } from '@common/configuration/tcp.config';
import { MongoDbConfig } from '@common/configuration/mongo.config';

class Configuration extends AppConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TCPConfiguration)
  TCP_SERVICES = new TCPConfiguration();

  @ValidateNested()
  @Type(() => MongoDbConfig)
  MONGO_DB = new MongoDbConfig();

  constructor() {
    super();
    this.APP_CONFIG.PORT = Number(process.env.INVOICE_PORT);
  }
}

export const CONFIGURATION = new Configuration();
export type TConfiguration = typeof CONFIGURATION;
CONFIGURATION.validate();
