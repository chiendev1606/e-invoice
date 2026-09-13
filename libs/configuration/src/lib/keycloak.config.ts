import { IsNotEmpty, IsString } from 'class-validator';

export class KeycloakConfig {
  @IsNotEmpty()
  @IsString()
  KEYCLOAK_BASE_URL: string;

  @IsNotEmpty()
  @IsString()
  KEYCLOAK_REALM: string;

  @IsNotEmpty()
  @IsString()
  KEYCLOAK_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  KEYCLOAK_CLIENT_SECRET: string;

  SCOPE = 'openid';
  GRANT_TYPE = 'client_credentials';

  constructor() {
    this.KEYCLOAK_BASE_URL = process.env['KEYCLOAK_BASE_URL'] || '';
    this.KEYCLOAK_REALM = process.env['KEYCLOAK_REALM'] || '';
    this.KEYCLOAK_CLIENT_ID = process.env['KEYCLOAK_CLIENT_ID'] || '';
    this.KEYCLOAK_CLIENT_SECRET = process.env['KEYCLOAK_CLIENT_SECRET'] || '';
  }
}
