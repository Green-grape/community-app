import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { Post } from 'src/entities/post.entity';
import { Vote } from 'src/entities/vote.entity';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([Post,Comment,Vote,User]),ConfigModule],
  controllers: [VoteController],
  providers: [VoteService]
})
export class VoteModule {}
