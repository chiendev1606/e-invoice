import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { RequestTCPType } from '@common/interfaces/tcp/request.interface';
import { CreateUserRequestDto } from '@common/interfaces/gate-way/user/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  createUser({ data }: RequestTCPType<CreateUserRequestDto>) {
    return this.userRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      userId: data.userId,
      roles: data.roles.map((role) => this.toRoleId(role)),
    });
  }

  private toRoleId(role: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(role)) {
      throw new BadRequestException(`Invalid role id: ${role}`);
    }

    return new Types.ObjectId(role);
  }
}
