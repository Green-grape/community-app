import { Module } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports:[TypeOrmModule.forFeature([User,Post,Comment])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
