import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Sub } from 'src/entities/sub.entity';
import { User } from 'src/entities/user.entity';

//userInterceptor뒤에서 실행되어야하며 현재 요청을 보낸 유저와 sub의 주인이 같은지 확인한다.
@Injectable()
export class SubInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const subName = req.params.subname;
    const user: User = req.user;
    const sub = await Sub.findOneBy({ name: subName });
    if (sub.username != user.username)
      throw new ForbiddenException('이 커뮤니티를 소유하고 있지 않습니다.');
    req.sub = sub;
    return next.handle();
  }
}
