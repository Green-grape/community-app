import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';

export class LoginUserDto {
  // @IsString({
  //   message: JSON.stringify({ username: '사용자 이름이 문자열이 아닙니다.' }),
  // })
  @MinLength(2, {
    message: JSON.stringify({
      username: '사용자 이름은 2자 이상이여야 합니다.',
    }),
  })
  @MaxLength(32, {
    message: JSON.stringify({
      username: '사용자 이름은 32자 이하여야 합니다.',
    }),
  })
  username: string;

  // @IsString({
  //   message: JSON.stringify({ password: '비밀번호가 문자열이 아닙니다.' }),
  // })
  @MinLength(6, {
    message: JSON.stringify({
      password: '비밀번호는 6자리 이상이여야 합니다.',
    }),
  })
  @MaxLength(32, {
    message: JSON.stringify({
      password: '비밀번호는 32자리 이하이여야 합니다.',
    }),
  })
  //Passwords will contain at least 1 upper case letter
  //Passwords will contain at least 1 lower case letter
  //Passwords will contain at least 1 number or special character
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: JSON.stringify({
      password:
        '비밀번호는 한개 이상의 대문자, 소문자, 특수 문자를 포함해야 합니다.',
    }),
  })
  password: string;
}
