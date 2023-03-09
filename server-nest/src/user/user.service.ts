import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';

interface OwnerData{
    type:string;
    data:Record<string,any>;
};

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>,
        @InjectRepository(Post)
        private postRepository:Repository<Post>,
        @InjectRepository(Comment)
        private commentReposiotry:Repository<Comment>
    ){}
    async getUser(username:string, user:User | undefined){
        const owner=await this.userRepository.findOneOrFail({
            where:{username},
            select:["username", "createdAt"]
        });
        //owner가 쓴 포스트
        const posts=await this.postRepository.find({
            where:{username},
            relations:["comments","votes","sub"]
        })
        //owner가 쓴 댓글
        const comments=await this.commentReposiotry.find({
            where:{username},
            relations:["post","votes"]
        })
        if(user){
            posts.forEach((post)=>post.setUserVote(user));
            comments.forEach((comment)=>comment.setUserVote(user));
        }
        let ownerData:OwnerData[]=[];
        posts.forEach((post)=>ownerData.push({type:"post",data:post.toJSON()}));
        comments.forEach((comment)=>ownerData.push({type:"comment",data:comment.toJSON()}));
        return {owner, ownerData};
    }
}
