import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from '@common/interfaces/gate-way/user/user.dto';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import type { User } from '@common/schemas/user.schema';
import { UserPattern } from '@common/constants/enums/tcp-patterns.enum';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@Inject(TCP_SERVICES.USER_ACCESS) private readonly userClient: TCPClient) {}

  async getUser(id: string, processID: string) {
    return this.userClient.send<Model<User>>(UserPattern.GET, { data: id, processID });
  }

  async createUser(user: CreateUserRequestDto, processID: string) {
    return this.userClient.send<Model<User>>(UserPattern.CREATE, { data: user, processID });
  }
}
