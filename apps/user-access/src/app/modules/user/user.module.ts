import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { getTcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDestination } from '@common/schemas/user.schema';
import { getMongoDbProvider } from '@common/configuration/mongo.config';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync(getTcpProvider(TCP_SERVICES.USER_ACCESS)),
    getMongoDbProvider(),
    MongooseModule.forFeature([UserDestination]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
