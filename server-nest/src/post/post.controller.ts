import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { MyReq } from 'src/common/decorators/request.decorator';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { CreatePostDto } from './dto/create.post.dto';
import { User } from 'src/entities/user.entity';
import { PostService } from './post.service';
import { AuthInterceptor } from 'src/common/interceptors/auth.interceptor';
import { GetPostDto } from './dto/get.post.dto';
import { CreateCommentDto } from './dto/create.comment.dto';
import { GetPostsDto } from './dto/get.posts.dto';

@Controller('api/posts')
export class PostController {
  constructor(private postSubvice: PostService) {}
  @Post()
  @UseInterceptors(UserInterceptor,AuthInterceptor)
  async createPost(
    @MyReq('body') createPostDto: CreatePostDto,
    @MyReq('user') user: User,
  ) {
    return this.postSubvice.createPost(createPostDto, user);
  }
  @Get()
  @UseInterceptors(UserInterceptor)
  getPosts(@MyReq('query') getPostsDto:GetPostsDto, @MyReq('user') user){
    return this.postSubvice.getPosts(getPostsDto,user);
  }
  @Get("/:identifier/:slug")
  @UseInterceptors(UserInterceptor)
  async getPost(@MyReq('params') getPostDto:GetPostDto, @MyReq('user') user){
    return this.postSubvice.getPost(getPostDto,user);
  }
  @Post("/:identifier/:slug/comments")
  @UseInterceptors(UserInterceptor,AuthInterceptor)
  async createPostComment(@MyReq('params') getPostDto:GetPostDto, @MyReq('body') createCommentDto:CreateCommentDto, @MyReq('user') user:User){
    return this.postSubvice.createPostComment(getPostDto, createCommentDto, user);
  }
  @Get("/:identifier/:slug/comments")
  @UseInterceptors(UserInterceptor)
  async getPostComment(@MyReq('params') getPostDto:GetPostDto, @MyReq('user') user){
    return this.postSubvice.getPostComment(getPostDto, user);
  }
}
