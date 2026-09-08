import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ClientsModule } from '@nestjs/microservices';
import { getTcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';

@Module({
  imports: [ClientsModule.registerAsync(getTcpProvider(TCP_SERVICES.USER_ACCESS))],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
