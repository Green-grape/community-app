import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { Sub } from 'src/entities/sub.entity';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPostDto } from './dto/get.post.dto';
import { CreateCommentDto } from './dto/create.comment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Sub)
    private subRepository: Repository<Sub>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>
  ) {}
  async createPost(createPostDto: CreatePostDto, user: User) {
    const { title, description, sub } = createPostDto;
    const subRecord = await this.subRepository.findOneByOrFail({
      name: sub,
    });
    const post = new Post();
    post.title = title;
    post.body = description;
    post.sub = subRecord;
    post.user = user;
    await this.postRepository.save(post);
    return post;
  }

  async getPost(getPostDto:GetPostDto, user:User | undefined){
    const {identifier, slug}=getPostDto;
    console.log(identifier,slug);
    const post=await this.postRepository.findOneOrFail({
        where:{identifier, slug},
        relations:["sub","votes"]
    })
    if(user){
      post.setUserVote(user);
    }
    return post;
  }

  async createPostComment(getPostDto:GetPostDto, createCommentDto:CreateCommentDto, user:User){
    const {identifier,slug}=getPostDto;
    const {comment}=createCommentDto;
    const post=await this.postRepository.findOneByOrFail(
      {identifier, slug}
    )
    const newComment=this.commentRepository.create();
    newComment.body=comment;
    newComment.user=user;
    newComment.post=post;
    await this.commentRepository.save(newComment);
    return newComment;
  }
}
