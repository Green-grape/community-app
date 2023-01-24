import { Injectable,BadRequestException } from '@nestjs/common';
import { SetVoteDto } from './set.vote.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { IsNull, Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Vote } from 'src/entities/vote.entity';

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(Post)
        private postRepository:Repository<Post>,
        @InjectRepository(Comment)
        private commentRepository:Repository<Comment>,
        @InjectRepository(Vote)
        private voteRepository:Repository<Vote>
    ){}
    async setVote(setVoteDto:SetVoteDto, user:User){
        const {identifier,slug,commentIdentifier,value}=setVoteDto;
        const post=await this.postRepository.findOneBy({identifier,slug});
        let comment:Comment | undefined;
        let vote:Vote | undefined;
        if(commentIdentifier){ //댓글 투표
            comment=await this.commentRepository.findOneBy({identifier:commentIdentifier});
            vote=await this.voteRepository.findOneBy({username:user.username,postId:post.id,commentId:comment.id});
        }else{ //글 투표
            vote=await this.voteRepository.findOneBy({username:user.username,postId:post.id,commentId:IsNull()});
        }
        if(!vote && value==0){ //존재할 수 없는 경우
            throw new BadRequestException("잘못된 입력입니다.");
        }else if(!vote){ //vote 새로 생성
            vote=this.voteRepository.create();
            vote.value=value;
            vote.post=post;
            vote.user=user;
            if(comment) vote.comment=comment;
            await this.voteRepository.save(vote);
        }else if(value==0){ //의미 없으므로 vote 삭제
            await this.voteRepository.remove(vote);
        }else{ //vote 갱신
            vote.value=value;
            await this.voteRepository.save(vote);
        }
        const joinedPost=await this.postRepository.findOne({
            where:{identifier,slug},
            relations:["votes","comments","comments.votes","sub"]
        })
        joinedPost.setUserVote(user);
        joinedPost.comments.forEach(comment=>comment.setUserVote(user));
        return joinedPost;
    }
}
