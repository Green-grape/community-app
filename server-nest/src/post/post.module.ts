import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub } from 'src/entities/sub.entity';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Sub, User])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
