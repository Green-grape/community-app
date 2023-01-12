import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MyReq = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return data ? req[data] : req;
  },
);
