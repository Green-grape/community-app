import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { Sub } from 'src/entities/sub.entity';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Sub)
    private subRepository: Repository<Sub>,
  ) {}
  async createPost(createPostDto: CreatePostDto, user: User) {
    const { title, description, sub } = createPostDto;
    const subRecord = await this.subRepository.findOneByOrFail({
      name: sub,
    });
    const post = new Post();
    post.title = title;
    post.body = description;
    post.sub = subRecord;
    post.user = user;
    await this.postRepository.save(post);
  }
}
