import { AppConfiguration } from '@common/configuration/app.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class Configuration extends AppConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();
}

export const CONFIGURATION = new Configuration();
export type TConfiguration = typeof CONFIGURATION;
CONFIGURATION.validate();
