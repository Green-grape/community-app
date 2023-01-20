import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

//토큰 기반으로 현재 요청을 보낸 사용자를 req.user에 저장
@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService:ConfigService
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies.token;
    if (!token) return next.handle();
    try{
      const { username }: any = jwt.verify(token, this.configService.get("JWT_SECRET"));
      const user = await this.userRepository.findOneBy({ username });
      if(user==null) return next.handle();
      req.user = user;
      return next.handle();
    }catch(error){
      throw new BadRequestException({message:"invalid token"});
    }
  }
}
