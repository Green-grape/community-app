import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserMiddleware } from 'src/common/middlewares/user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
