import { AuthorizerPattern } from '@common/constants/enums/tcp-patterns.enum';
import { ProcessID } from '@common/decorators/processID.decorator';
import { RequestParamsTcp } from '@common/decorators/request-params-tcp.decorator';
import { LoginRequestDto } from '@common/interfaces/gate-way/keycloak';
import { createKeycloakUserRequestType } from '@common/interfaces/gate-way/keycloak/keycloak.interface';
import { RequestTCP } from '@common/interfaces/tcp/request.interface';
import { ResponseTCP } from '@common/interfaces/tcp/response.interface';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { KeycloakService } from '../services/keycloak-http.service';

@Controller()
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @MessagePattern(AuthorizerPattern.CREATE_KEYCLOAK_USER)
  async createKeycloakUser(data: RequestTCP<createKeycloakUserRequestType>) {
    return ResponseTCP.success(await this.keycloakService.createKeycloakUser(data.data));
  }

  @MessagePattern(AuthorizerPattern.LOGIN_KEYCLOAK_USER)
  exchangeUserToken(@RequestParamsTcp('data') data: LoginRequestDto) {
    return this.keycloakService.exchangeUserToken(data);
  }

  @MessagePattern(AuthorizerPattern.VERIFY_USER_TOKEN)
  verifyUserToken(@RequestParamsTcp('data') data: string, @ProcessID() processId: string) {
    return this.keycloakService.verifyUserToken(data, processId);
  }
}
