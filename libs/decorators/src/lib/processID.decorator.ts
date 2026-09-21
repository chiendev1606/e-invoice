import { MetadataKeys } from '@common/constants/common.constant';
import { getProcessID } from '@common/utils/string.util';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProcessID = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[MetadataKeys.processID] || getProcessID();
});
