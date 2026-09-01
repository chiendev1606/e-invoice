import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestParamsTcp = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const params = ctx.switchToRpc().getData();
  return key ? params[key] : null;
});
