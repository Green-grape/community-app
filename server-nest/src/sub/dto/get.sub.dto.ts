import { IsNotEmpty, MinLength } from 'class-validator';

export class GetSubDto {
  @MinLength(2, {
    message: JSON.stringify({
      name: '커뮤니티 이름은 2자 이상이여야 합니다.',
    }),
  })
  name: string;
}
