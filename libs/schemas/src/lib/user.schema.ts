import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { Types } from 'mongoose';
import { Model } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User extends BaseSchema {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String })
  userId: string;

  @Prop({ type: [Types.ObjectId], ref: 'Role' })
  roles: Types.ObjectId[];
}

const UserSchema = createSchema(User);

export const UserModelName = User.name;

export const UserDestination = {
  name: User.name,
  schema: UserSchema,
};

export type UserModel = Model<User>;
