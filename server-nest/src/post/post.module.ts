import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub } from 'src/entities/sub.entity';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Sub, User,Comment]), ConfigModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
