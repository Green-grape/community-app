import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { SubModule } from './sub/sub.module';
import config from './config/config';
import { UserMiddleware } from './common/middlewares/user.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      load: [config],
    }),
    AuthModule,
    SubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
