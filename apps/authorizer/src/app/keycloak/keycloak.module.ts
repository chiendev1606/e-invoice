import { Module } from '@nestjs/common';
import { KeycloakService } from './services/keycloak-http.service';
import { KeycloakController } from './controllers/keycloak.controller';
import { KeycloakRepository } from './repositories/keycloak.repository';
import { ClientsModule } from '@nestjs/microservices';
import { getTcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';

@Module({
  imports: [ClientsModule.registerAsync(getTcpProvider(TCP_SERVICES.USER_ACCESS))],
  providers: [KeycloakService, KeycloakRepository],
  controllers: [KeycloakController],
})
export class KeycloakModule {}
