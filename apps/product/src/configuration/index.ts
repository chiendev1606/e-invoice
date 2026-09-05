import { AppConfiguration } from '@common/configuration/app.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TCPConfiguration } from '@common/configuration/tcp.config';
import { TypeOrmConfig } from '@common/configuration/type-orm.config';

class Configuration extends AppConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TCPConfiguration)
  TCP_SERVICES = new TCPConfiguration();

  @ValidateNested()
  @Type(() => TypeOrmConfig)
  TYPE_ORM_CONFIG = new TypeOrmConfig();

  constructor() {
    super();
    this.APP_CONFIG.PORT = Number(process.env.PRODUCT_PORT);
  }
}

export const CONFIGURATION = new Configuration();
export type TConfiguration = typeof CONFIGURATION;
CONFIGURATION.validate();
