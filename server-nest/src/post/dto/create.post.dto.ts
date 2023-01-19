import { IsNotEmpty, ValidationArguments } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      if (args.value === undefined || args.value.trim().length === 0)
        return JSON.stringify({
          title: '제목을 비워둘 수 없습니다.',
        });
    },
  })
  title: string;

  description: string;

  @IsNotEmpty({
    message: JSON.stringify({
      sub: '커뮤니티가 존재하지 않습니다.',
    }),
  })
  sub: string;
}
