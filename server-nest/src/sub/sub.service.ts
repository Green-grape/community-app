import { Injectable } from '@nestjs/common';
import { CreateSubDto } from './dto/create.sub.dto';
import { Repository } from 'typeorm';
import { Sub } from 'src/entities/sub.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { GetSubDto } from './dto/get.sub.dto';

@Injectable()
export class SubService {
  constructor(
    @InjectRepository(Sub)
    private subRepository: Repository<Sub>,
  ) {}
  async createSub(createSubDto: CreateSubDto) {
    const { name, title, description, user } = createSubDto;
    let customError: any = {};
    const sub = await this.subRepository
      .createQueryBuilder('sub')
      .where('lower(sub.name)=:name', { name: name.toLowerCase() })
      .getOne();
    if (sub) {
      customError.sub = '서브가 이미 존재합니다.';
      throw customError;
    }
    const newSub = new Sub();
    newSub.name = name;
    newSub.title = title;
    newSub.description = description;
    newSub.user = user;
    await newSub.save();
    return newSub;
  }

  async getSubList() {
    const imageUrlExp = `COALESCE(s.imageUrn , 'https://www.gravatar.com/avatar?d=mp&f=y')`;
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

  async getSub(getSubDto: GetSubDto) {
    const { name } = getSubDto;
    const sub = await this.subRepository.findOneByOrFail({ name });
    return sub;
  }
}
