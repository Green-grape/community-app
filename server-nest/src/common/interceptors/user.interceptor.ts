import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies.token;
    console.log(token);
    if (!token) throw new UnauthorizedException('Unauthenticated');
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneBy({ username });
    if (user == null) throw new UnauthorizedException('Unauthenticated');
    req.body.user = user;
    return next.handle();
  }
}
