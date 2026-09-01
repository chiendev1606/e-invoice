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
}

export const CONFIGURATION = new Configuration();
export type TConfiguration = typeof CONFIGURATION;
CONFIGURATION.validate();
