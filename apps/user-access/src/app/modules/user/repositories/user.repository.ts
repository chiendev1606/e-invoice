import { Injectable } from '@nestjs/common';
import { User, UserModelName } from '@common/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserModelName) private readonly userModel: Model<User>) {}

  getAll() {
    return this.userModel.find().exec();
  }

  getById(id: string) {
    return this.userModel.findById(id).exec();
  }

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  findAndUpdate(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
