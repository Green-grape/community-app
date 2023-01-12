import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import BaseEntity from "./Entity";
import { Post } from "./Post";
import { Vote } from "./Vote";
import { Exclude, Expose } from "class-transformer";
import { v4 as uuidv4 } from "uuid";

@Entity("comment")
export class Comment extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  protected userVote: number;

  setUserVote(user: User) {
    const idx = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = idx != -1 ? this.votes[idx].value : 0;
  }

  @Expose() get voteScore(): number {
    const initValue = 0;
    return this.votes?.reduce(
      (prev, cur) => prev + (cur.value || 0),
      initValue
    );
  }

  @BeforeInsert()
  makeId() {
    this.identifier = uuidv4();
  }
}
