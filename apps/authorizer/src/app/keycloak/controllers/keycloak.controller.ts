import { Controller } from '@nestjs/common';
import { KeycloakService } from '../services/keycloak.service';

@Controller()
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}
}
