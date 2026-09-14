import { Controller } from '@nestjs/common';
import { KeycloakService } from '../services/keycloak-http.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthorizerPattern } from '@common/constants/enums/tcp-patterns.enum';
import { RequestTCP } from '@common/interfaces/tcp/request.interface';
import { createKeycloakUserRequestType } from '@common/interfaces/gate-way/keycloak/keycloak.interface';
import { RequestParamsTcp } from '@common/decorators/request-params-tcp.decorator';
import { LoginRequestDto } from '@common/interfaces/gate-way/keycloak';

@Controller()
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @MessagePattern(AuthorizerPattern.CREATE_KEYCLOAK_USER)
  async createKeycloakUser(data: RequestTCP<createKeycloakUserRequestType>) {
    return this.keycloakService.createKeycloakUser(data.data);
  }

  @MessagePattern(AuthorizerPattern.LOGIN_KEYCLOAK_USER)
  exchangeUserToken(@RequestParamsTcp('data') data: LoginRequestDto) {
    return this.keycloakService.exchangeUserToken(data);
  }
}
