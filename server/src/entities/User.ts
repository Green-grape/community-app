import {
  IsEmail,
  isPostalCode,
  Length,
  MaxLength,
  MinLength,
} from "class-validator";
import { Exclude } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { Vote } from "./Vote";
import { Post } from "./Post";
import bcrypt from "bcryptjs";
import BaseEntity from "./Entity";

@Entity("user")
export class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: "이메일 주소가 잘못되었습니다." })
  @MinLength(1, { message: "이메일 주소는 비워둘 수 없습니다" })
  @MaxLength(255)
  @Column({ unique: true })
  email: string;

  @Index()
  @MinLength(2, { message: "사용자 이름은 3자 이상이여야 합니다." })
  @MaxLength(32)
  @Column({ unique: true })
  username: string;

  @MinLength(6, { message: "비밀번호는 6자리 이상이여야 합니다." })
  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
  }
}
