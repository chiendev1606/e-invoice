import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { AuthorizerPattern } from '@common/constants/enums/tcp-patterns.enum';
import { createKeycloakUserRequestType } from '@common/interfaces/gate-way/keycloak/keycloak.interface';
import { CreateUserRequestDto } from '@common/interfaces/gate-way/user/user.dto';
import { RequestTCPType } from '@common/interfaces/tcp/request.interface';
import { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { firstValueFrom, map } from 'rxjs';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZER) private readonly authorizerClient: TCPClient,
  ) {}

  async createUser({ data, processID }: RequestTCPType<CreateUserRequestDto>) {
    if (await this.userRepo.exist(data.email)) {
      throw new BadRequestException('User already exists');
    }

    const keycloakUserId = await this.createKeycloakUser({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      processID,
    });

    return this.userRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      roles: data.roles.map((role) => this.toRoleId(role)),
      keycloakUserId: keycloakUserId,
    });
  }

  createKeycloakUser({ data, processID }: { data: createKeycloakUserRequestType; processID: string }) {
    return firstValueFrom(
      this.authorizerClient
        .send<string, createKeycloakUserRequestType>(AuthorizerPattern.CREATE_KEYCLOAK_USER, {
          processID,
          data,
        })
        .pipe(map((response) => response.data)),
    );
  }

  private toRoleId(role: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(role)) {
      throw new BadRequestException(`Invalid role id: ${role}`);
    }

    return new Types.ObjectId(role);
  }
}
