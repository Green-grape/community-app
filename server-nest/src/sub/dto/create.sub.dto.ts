import { IsNotEmptyObject, IsObject, MinLength } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class CreateSubDto {
  @MinLength(2, {
    message: JSON.stringify({
      name: '커뮤니티 이름은 2자 이상이여야 합니다.',
    }),
  })
  name: string;
  @MinLength(2, {
    message: JSON.stringify({
      title: '커뮤니티 주제는 2자 이상이여야 합니다.',
    }),
  })
  title: string;
  @MinLength(10, {
    message: JSON.stringify({
      description: '커뮤니티 설명은 2자 이상이여야 합니다.',
    }),
  })
  description: string;
}
