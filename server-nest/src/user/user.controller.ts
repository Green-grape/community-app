import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { MyReq } from 'src/common/decorators/request.decorator';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

interface OwnerData{
    type:string;
    data:Record<string,any>;
};

@Controller('api/users')
export class UserController {
    constructor(
        private userService:UserService
    ){}
    @Get("/:username")
    @UseInterceptors(UserInterceptor)
    getUser(@MyReq('params') username:string, @MyReq('user') user):Promise<{owner:User,ownerData:OwnerData[]}>{
        return this.userService.getUser(username, user)
    }
}
