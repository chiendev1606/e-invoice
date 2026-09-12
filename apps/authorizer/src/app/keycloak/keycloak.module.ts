import { Module } from '@nestjs/common';
import { KeycloakService } from './services/keycloak.service';
import { KeycloakController } from './controllers/keycloak.controller';
import { KeycloakRepository } from './repositories/keycloak.repository';

@Module({
  providers: [KeycloakService, KeycloakRepository],
  controllers: [KeycloakController],
})
export class KeycloakModule {}
