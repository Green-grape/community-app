import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//토큰 기반으로 현재 요청을 보낸 사용자를 req.body에 저장
@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies.token;
    if (!token) throw new UnauthorizedException('Unauthenticated');
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await this.userRepository.findOneBy({ username });
    if (user == null) throw new UnauthorizedException('Unauthenticated');
    console.log('UserInterceptor', user);
    req.user = user;
    return next.handle();
  }
}
