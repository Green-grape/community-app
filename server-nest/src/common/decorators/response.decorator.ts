import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MyRes = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const res = ctx.switchToHttp().getResponse();
    return data ? res[data] : data;
  },
);
