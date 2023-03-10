import {
  Controller,
  Post,
  Get,
  Res,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { MyReq } from 'src/common/decorators/request.decorator';
import { MyRes } from 'src/common/decorators/response.decorator';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import * as cookie from 'cookie';
import { UserInterceptor } from 'src/common/interceptors/user.interceptor';
import { User } from 'src/entities/user.entity';
import { GetUserDto } from 'src/common/dto/get.user.dto';

//user 나중에 지우기

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@MyReq('body') createUserDto: CreateUserDTO) {
    return await this.authService.addUser(createUserDto);
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.set(
      'Set-cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
      }),
    );
    return { success: true };
  }
  @Post('login') //express 의존
  async login(
    @MyReq('body') loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.login(loginUserDto);
    res.set(
      'Set-cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        maxAge: 60 * 60,
        path: '/',
      }),
    );
    return user;
  }

  @Get('check')
  @UseInterceptors(UserInterceptor)
  checkValidToken(@MyReq('user') user) {
    return user;
  }
}
