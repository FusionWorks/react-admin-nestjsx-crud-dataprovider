import BaseEntity from '../common/base.entity';
import { Entity, Column } from 'typeorm';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiModelPropertyOptional()
  @Column({
    unique: true,
  })
  email: string;

  @ApiModelPropertyOptional()
  @Column({
    select: false,
  })
  password: string;

  @ApiModelPropertyOptional()
  @Column()
  firstname: string;

  @ApiModelPropertyOptional()
  @Column()
  lastname: string;
}
