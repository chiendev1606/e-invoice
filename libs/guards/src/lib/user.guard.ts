import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { MetadataKeys } from '@common/constants/common.constant';
import { AuthorizerPattern } from '@common/constants/enums/tcp-patterns.enum';
import type { IUserPayload } from '@common/interfaces/gate-way/keycloak';
import type { TCPClient } from '@common/interfaces/tcp/tcp-client.interface';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTHORIZER) private readonly authorizerClient: TCPClient,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<boolean>(MetadataKeys.secured, context.getHandler());

    if (!secured) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const processID = request[MetadataKeys.processID];
    try {
      const authHeader = request.headers['authorization'].split(' ');
      if (authHeader[0] !== 'Bearer' || !authHeader[1]) {
        throw new UnauthorizedException('Invalid authorization header.');
      }
      const token = authHeader[1];
      const decodedToken = await firstValueFrom(
        this.authorizerClient.send<IUserPayload>(AuthorizerPattern.VERIFY_USER_TOKEN, { data: token, processID }),
      );

      Logger.log(`Decoded token for processID ${processID}: ${JSON.stringify(decodedToken)}`);
      request[MetadataKeys.userPayload] = decodedToken;
      return true;
    } catch (error) {
      Logger.error(`Access denied for processID ${processID}: User is not authorized.`, error);
      throw new UnauthorizedException('Access denied: User is not authorized.');
    }
  }
}
