import { MetadataKeys } from '@common/constants/common.constant';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserPayload } from '@common/interfaces/gate-way/keycloak/token';

export const Identity = () =>
  createParamDecorator((data: keyof IUserPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userPayload = request[MetadataKeys.userPayload];
    return data ? userPayload[data] : userPayload;
  });
