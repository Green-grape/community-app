import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { MyReq } from 'src/common/decorators/request.decorator';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { CreatePostDto } from './dto/create.post.dto';
import { User } from 'src/entities/user.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postSubvice: PostService) {}
  @Post()
  @UseInterceptors(UserInterceptor)
  async createPost(
    @MyReq('body') createPostDto: CreatePostDto,
    @MyReq('user') user: User,
  ) {
    return this.postSubvice.createPost(createPostDto, user);
  }
}
