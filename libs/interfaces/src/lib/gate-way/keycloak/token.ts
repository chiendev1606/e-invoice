import { User } from '@common/schemas/user.schema';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from '@common/schemas/role.schema';

export interface IUserPayload extends JwtPayload {
  user: User & { roles: Role[] };
}
