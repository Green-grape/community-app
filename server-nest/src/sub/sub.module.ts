import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sub } from 'src/entities/sub.entity';
import { SubController } from './sub.controller';
import { SubService } from './sub.service';
import { UserMiddleware } from 'src/common/middlewares/user.middleware';
import { User } from 'src/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sub, User,Post]), ConfigModule],
  controllers: [SubController],
  providers: [SubService],
})
export class SubModule {}
