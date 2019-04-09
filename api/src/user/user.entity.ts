import BaseEntity from '../common/base.entity';
import { Entity, Column } from 'typeorm';

@Entity({name: 'users'})
export class UserEntity extends BaseEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;
}