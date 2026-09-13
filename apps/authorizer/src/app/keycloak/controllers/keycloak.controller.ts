import { Controller } from '@nestjs/common';
import { KeycloakService } from '../services/keycloak-http.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthorizerPattern } from '@common/constants/enums/tcp-patterns.enum';
import { RequestTCP } from '@common/interfaces/tcp/request.interface';
import { createKeycloakUserRequestType } from '@common/interfaces/gate-way/keycloak/keycloak.interface';

@Controller()
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @MessagePattern(AuthorizerPattern.CREATE_KEYCLOAK_USER)
  async createKeycloakUser(data: RequestTCP<createKeycloakUserRequestType>) {
    return this.keycloakService.createKeycloakUser(data.data);
  }
}
