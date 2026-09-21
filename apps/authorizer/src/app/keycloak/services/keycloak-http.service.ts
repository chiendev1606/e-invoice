import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { UserPattern } from '@common/constants/enums/tcp-patterns.enum';
import { LoginRequestDto, LoginResponseDto } from '@common/interfaces/gate-way/keycloak';
import {
  createKeycloakUserRequestType,
  exchangeClientTokenType,
} from '@common/interfaces/gate-way/keycloak/keycloak.interface';
import type { IUserPayload } from '@common/interfaces/gate-way/keycloak/token';
import type { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { decode, JwtPayload, verify } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KeycloakService {
  private axiosInstance: AxiosInstance;
  realm?: string;
  client_secret?: string;
  client_id?: string;
  scope?: string;
  grant_type?: string;
  keycloakUrl?: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(TCP_SERVICES.USER_ACCESS) private readonly userAccessClient: TCPClient,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>('KEYCLOAK_CONFIG.KEYCLOAK_BASE_URL'),
    });

    this.realm = this.configService.get<string>('KEYCLOAK_CONFIG.KEYCLOAK_REALM');
    this.client_secret = this.configService.get<string>('KEYCLOAK_CONFIG.KEYCLOAK_CLIENT_SECRET');
    this.client_id = this.configService.get<string>('KEYCLOAK_CONFIG.KEYCLOAK_CLIENT_ID');
    this.scope = this.configService.get('KEYCLOAK_CONFIG.SCOPE');
    this.grant_type = this.configService.get('KEYCLOAK_CONFIG.GRANT_TYPE');
    this.keycloakUrl = this.configService.get('KEYCLOAK_CONFIG.KEYCLOAK_BASE_URL');
  }

  async exchangeClientToken(): Promise<exchangeClientTokenType> {
    const body = new URLSearchParams();
    body.append('client_id', this.client_id as string);
    body.append('client_secret', this.client_secret as string);
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
      throw new InternalServerErrorException('Cannot create user');
    }

    return userId;
  }

  async exchangeUserToken({ email, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const body = new URLSearchParams();
    body.append('client_id', this.client_id as string);
    body.append('client_secret', this.client_secret as string);
    body.append('grant_type', 'password');
    body.append('username', email);
    body.append('password', password);

    const { data } = await this.axiosInstance.post(`/realms/${this.realm}/protocol/openid-connect/token`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return { refreshToken: data.refresh_token, accessToken: data.access_token };
  }

  async verifyUserToken(token: string, processID: string): Promise<IUserPayload> {
    const client = jwksClient({
      jwksUri: `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });

    const decodedToken = decode(token, { complete: true }) as { header: { kid: string } } | null;
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const kid = decodedToken.header.kid;
    const key = await client.getSigningKey(kid);
    const publicKey = key.getPublicKey();

    const verifiedToken = verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;

    const { data: user } = await firstValueFrom(
      this.userAccessClient.send<IUserPayload['user']>(UserPattern.GET_BY_KEYCLOAK_ID, {
        data: verifiedToken.sub,
        processID,
      }),
    );

    if (!user?.id) {
      throw new UnauthorizedException('User not found');
    }

    verifiedToken.user = user;

    return verifiedToken as IUserPayload;
  }
}
