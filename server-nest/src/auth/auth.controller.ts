import { Controller, Post, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MyReq } from 'src/common/decorators/request.decorator';
import { MyRes } from 'src/common/decorators/response.decorator';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import * as cookie from 'cookie';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@MyReq('body') createUserDto: CreateUserDTO) {
    return this.authService.addUser(createUserDto);
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
}
