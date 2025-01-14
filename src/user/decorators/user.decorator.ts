import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../user.model';

type TypeDatas = keyof UserModel;

export const User = createParamDecorator(
  (data: TypeDatas, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user[data] : user;
  },
);
