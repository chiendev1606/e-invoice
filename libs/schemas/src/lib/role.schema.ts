import { Prop, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleName } from '@common/constants/enums/user-access-role.enum';
import { GRANTABLE_PERMISSIONS, GrantablePermission } from '@common/constants/enums/permission.enum';
import { BaseSchema, createSchema } from './base.schema';

@Schema({
  collection: 'roles',
})
export class Role extends BaseSchema {
  @Prop({ type: String, required: true, unique: true, index: true, enum: RoleName })
  roleName: RoleName;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: [String], enum: GRANTABLE_PERMISSIONS, default: [] })
  permissions: GrantablePermission[];
}

const RoleSchema = createSchema(Role);

export const RoleModelName = Role.name;

export const RoleDestination = {
  name: Role.name,
  schema: RoleSchema,
};

export type RoleModel = Model<Role>;
