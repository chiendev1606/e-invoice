import { AppConfiguration } from '@common/configuration/app.config';
import { TCPConfiguration } from '@common/configuration/tcp.config';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { KeycloakConfig } from '@common/configuration/keycloak.config';

class Configuration extends AppConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => TCPConfiguration)
  TCP_SERVICES = new TCPConfiguration();

  @ValidateNested()
  @Type(() => KeycloakConfig)
  KEYCLOAK_CONFIG = new KeycloakConfig();

  constructor() {
    super();
    this.APP_CONFIG.PORT = Number(process.env.AUTHORIZER_PORT);
  }
}

export const CONFIGURATION = new Configuration();
export type TConfiguration = typeof CONFIGURATION;
CONFIGURATION.validate();
