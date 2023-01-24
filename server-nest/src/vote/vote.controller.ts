import { Controller,Post,UseInterceptors } from '@nestjs/common';
import { MyReq } from 'src/common/decorators/request.decorator';
import { AuthInterceptor } from 'src/common/interceptors/auth.interceptor';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { User } from 'src/entities/user.entity';
import { SetVoteDto } from './set.vote.dto';
import { VoteService } from './vote.service';

@Controller('api/votes')
export class VoteController {
    constructor(private voteService:VoteService){}
    @Post()
    @UseInterceptors(UserInterceptor,AuthInterceptor)
    setVote(@MyReq('body') setVoteDto:SetVoteDto, @MyReq('user') user:User){
        return this.voteService.setVote(setVoteDto,user);
    }
}
