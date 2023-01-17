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

@Module({
  imports: [TypeOrmModule.forFeature([Sub])],
  controllers: [SubController],
  providers: [SubService],
})
export class SubModule {}
