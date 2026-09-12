import { IsNotEmpty, IsString } from 'class-validator';

export class KeycloakConfig {
  @IsNotEmpty()
  @IsString()
  BASE_URL: string;

  @IsNotEmpty()
  @IsString()
  REALM: string;

  @IsNotEmpty()
  @IsString()
  CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  CLIENT_SECRET: string;

  SCOPE = 'openid';
  grant_type = 'client_credentials';

  constructor() {
    this.BASE_URL = process.env['KEYCLOAK_BASE_URL'] || '';
    this.REALM = process.env['KEYCLOAK_REALM'] || '';
    this.CLIENT_ID = process.env['KEYCLOAK_CLIENT_ID'] || '';
    this.CLIENT_SECRET = process.env['KEYCLOAK_CLIENT_SECRET'] || '';
  }
}
