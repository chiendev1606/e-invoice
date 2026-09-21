import { Injectable } from '@nestjs/common';
import { User, UserModelName } from '@common/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { get } from 'http';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserModelName) private readonly userModel: Model<User>) {}

  getAll() {
    return this.userModel.find().exec();
  }

  getById(id: string) {
    return this.userModel.findById(id).populate('roles').exec();
  }

  getByKeycloakId(keycloakUserId: string) {
    return this.userModel.findOne({ keycloakUserId }).populate('roles').exec();
  }

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  findAndUpdate(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async exist(email: string) {
    const user = await this.userModel.exists({ email }).exec();
    return !!user;
  }
}
