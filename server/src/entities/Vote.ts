import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntity from "./Entity";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";

@Entity("vote")
export class Vote extends BaseEntity {
  @Column() //vote 1,0,-1(좋아요, 안함, 싫어요)
  value: number;

  @Column()
  username: string;

  @ManyToOne(() => User) //ManyToOne은 필수관계 지정X
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column({ nullable: true })
  postId: number;

  @ManyToOne(() => Post) //Post에서 relation이 exclue되었기 때문에 여기서도 join을 하지 않는다.
  post: Post;

  @Column({ nullable: true })
  commentId: number;

  @ManyToOne(() => Comment)
  comment: Comment;
}
