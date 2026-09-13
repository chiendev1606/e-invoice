import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  exchangeClientTokenType,
  createKeycloakUserRequestType,
} from '@common/interfaces/gate-way/keycloak/keycloak.interface';

@Injectable()
export class KeycloakService {
  private axiosInstance: AxiosInstance;
  realm: string;
  client_secret: string;
  client_id: string;
  scope: string;
  grant_type: string;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>('KEYCLOAK_CONFIG.KEYCLOAK_BASE_URL'),
    });

    this.realm = this.configService.get<string>('KEYCLOAK_CONFIG.KEYCLOAK_REALM');
    this.client_secret = this.configService.get<string>('KEYCLOAK_CONFIG.KEYCLOAK_CLIENT_SECRET');
    this.client_id = this.configService.get<string>('KEYCLOAK_CONFIG.KEYCLOAK_CLIENT_ID');
    this.scope = this.configService.get('KEYCLOAK_CONFIG.SCOPE');
    this.grant_type = this.configService.get('KEYCLOAK_CONFIG.GRANT_TYPE');
  }

  async exchangeClientToken(): Promise<exchangeClientTokenType> {
    const body = new URLSearchParams();
    body.append('client_id', this.client_id);
    body.append('client_secret', this.client_secret);
    body.append('grant_type', 'client_credentials');
    body.append('scope', 'openid');

    const response = await this.axiosInstance.post(`/realms/${this.realm}/protocol/openid-connect/token`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  }

  async createKeycloakUser(body: createKeycloakUserRequestType) {
    const { firstName, lastName, email, password } = body;
    const { access_token } = await this.exchangeClientToken();
    const { headers } = await this.axiosInstance.post(
      `/admin/realms/${this.realm}/users`,
      {
        firstName,
        lastName,
        email,
        enabled: true,
        username: email,
        emailVerified: true,
        credentials: [{ type: 'password', value: password, temporary: false }],
      },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );
    const userId = headers['location'].split('/').pop();

    if (!userId) {
      throw new InternalServerErrorException('Cannot creat user');
    }

    return userId;
  }
}
