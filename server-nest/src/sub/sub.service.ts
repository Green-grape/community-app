import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSubDto } from './dto/create.sub.dto';
import { Repository } from 'typeorm';
import { Sub } from 'src/entities/sub.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { GetSubDto } from './dto/get.sub.dto';
import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubService {
  constructor(
    @InjectRepository(Sub)
    private subRepository: Repository<Sub>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private config: ConfigService,
  ) {}
  async createSub(createSubDto: CreateSubDto, user: User) {
    const { name, title, description } = createSubDto;
    let customError: any = {};

    //같은 이름의 sub가 있는지 확인
    const sub = await this.subRepository
      .createQueryBuilder('sub')
      .where('lower(sub.name)=:name', { name: name.toLowerCase() })
      .getOne();
    if (sub) {
      customError.sub = '서브가 이미 존재합니다.';
      throw customError;
    }

    //sub생성
    const newSub = new Sub();
    newSub.name = name;
    newSub.title = title;
    newSub.description = description;
    newSub.user = user;
    await newSub.save();
    return newSub;
  }

  async getSubList() {
    //기본 프로필 이미지
    const imageUrlExp = `COALESCE('${this.config.get(
      'APP_URL',
    )}/images/' || s.imageUrn , 'https://www.gravatar.com/avatar?d=mp&f=y')`;

    //sub가져오기
    const subs = await this.subRepository
      .createQueryBuilder('s')
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`,
      )
      .leftJoin(Post, 'p', `s.name = p.subName`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, 'DESC')
      .limit(5)
      .execute();
    return subs;
  }

  async getSub(getSubDto: GetSubDto, user:User | undefined) {
    const { name } = getSubDto;
    const sub = await this.subRepository.findOneByOrFail({ name });
    const posts = await this.postRepository.find({
      where: { subName: sub.name },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
    });
    if(user){
      posts.forEach(post=>post.setUserVote(user));
    }
    sub.posts = posts;
    return sub;
  }
  async uploadImage(type: string, sub: Sub, file: Express.Multer.File) {
    if (type !== 'image' && type !== 'banner') {
      if (!file.path) throw new BadRequestException('유효하지 않은 파일');
      fs.unlinkSync(file.path);
      throw new BadRequestException('잘못된 유형의 파일입니다.');
    }
    //이미지 갱신
    let oldImageUrn = '';
    if (type === 'image') {
      //프로필 사진
      oldImageUrn = sub.imageUrn || '';
      sub.imageUrn = file.filename || '';
    } else if (type === 'banner') {
      //배너 사진
      oldImageUrn = sub.bannerUrn || '';
      sub.bannerUrn = file.filename || '';
    }
    await sub.save();

    //기존 이미지 삭제
    if (oldImageUrn.length > 0) {
      const fullPath = path.resolve(
        process.cwd(),
        'public',
        'images',
        oldImageUrn,
      );
      fs.unlinkSync(fullPath);
    }
    return sub;
  }
}
