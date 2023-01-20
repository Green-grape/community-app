import {Injectable, NestInterceptor,ExecutionContext,CallHandler,UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";

@Injectable()
//현재 유저가 존재하는지 확인
export class AuthInterceptor implements NestInterceptor{
    async intercept(context:ExecutionContext, next:CallHandler<any>):Promise<Observable<any>>{
        const req=context.switchToHttp().getRequest();
        if (req.user == null) throw new UnauthorizedException('Unauthenticated');
        return next.handle();
    }
}