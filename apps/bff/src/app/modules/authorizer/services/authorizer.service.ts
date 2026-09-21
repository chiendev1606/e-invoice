import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { Inject, Injectable } from '@nestjs/common';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { LoginRequestDto, LoginResponseDto } from '@common/interfaces/gate-way/keycloak';
import { AuthorizerPattern } from '@common/constants/enums/tcp-patterns.enum';
import { map } from 'rxjs/operators';
import { ResponseDto } from '@common/interfaces/gate-way/response.interface';

@Injectable()
export class AuthorizerService {
  constructor(@Inject(TCP_SERVICES.AUTHORIZER) private readonly authorizerClient: TCPClient) {}
  async login(data: LoginRequestDto, processID: string) {
    return this.authorizerClient
      .send<LoginResponseDto>(AuthorizerPattern.LOGIN_KEYCLOAK_USER, { data, processID })
      .pipe(map((res) => new ResponseDto({ data: res?.data || res })));
  }
}
