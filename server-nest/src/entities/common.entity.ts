import { Exclude, instanceToPlain } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity()
export default class CommonEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @CreateDateColumn()
  createdAt: Date;

  @IsNotEmpty()
  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
