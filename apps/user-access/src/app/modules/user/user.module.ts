import { getMongoDbProvider } from '@common/configuration/mongo.config';
import { getTcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';
import { UserDestination } from '@common/schemas/user.schema';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CONFIGURATION } from '../../../configuration';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { RoleDestination } from '@common/schemas/role.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    ClientsModule.registerAsync(getTcpProvider(TCP_SERVICES.AUTHORIZER)),
    getMongoDbProvider(),
    MongooseModule.forFeature([UserDestination, RoleDestination]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
