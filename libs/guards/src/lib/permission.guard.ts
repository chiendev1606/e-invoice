import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constants/common.constant';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(MetadataKeys.requiredPermission, context.getHandler());
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userPayload = request[MetadataKeys.userPayload];
    const userPermissions = userPayload.permissions;
    const isValid = requiredPermissions.every((permission) => userPermissions.includes(permission));
    if (!isValid) {
      throw new ForbiddenException('Access denied: User does not have the required permission.');
    }
    return isValid;
  }
}
