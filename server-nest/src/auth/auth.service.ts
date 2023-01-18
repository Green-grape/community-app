import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from './dto/create.user.dto';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login.user.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
  async addUser(createUserDto: CreateUserDTO) {
    const { email, username, password, passwordConfirm } = createUserDto;
    //해당 계정을 생성할 수 있는지 확인
    let customError: any = {};
    const usernameUser = await this.userRepository.findOneBy({ username });
    const emailUser = await this.userRepository.findOneBy({ email });
    if (usernameUser) customError.email = '이 이메일은 이미 사용되었습니다.';
    if (emailUser) customError.username = '이 사용자는 이미 사용되었습니다.';
    if (password !== passwordConfirm)
      customError.password = customError.passwordConfirm =
        '비밀번호와 비밀번호 확인이 다릅니다.';
    if (Object.keys(customError).length > 0) {
      return new BadRequestException({ message: customError });
    }

    //유저 생성
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    await this.userRepository.save(user);
    const checkUser = await this.userRepository.findOneBy({ email });
    console.log(checkUser);
    return user;
  }
  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    //로그인이 가능한지 확인
    let customError: any = {};
    const user = await this.userRepository.findOneBy({ username });
    if (user === null) {
      customError.username = '사용자 이름이 등록되지 않았습니다.';
      throw new NotFoundException({ message: customError });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      customError.password = '비밀번호가 일치하지 않습니다.';
      throw new UnauthorizedException({ message: customError });
    }
    //jwt token 생성
    const token = jwt.sign(
      { username },
      this.configService.get<string>('JWT_SECRET'),
      {
        expiresIn: '1h',
      },
    );
    return { user, token };
  }
}
