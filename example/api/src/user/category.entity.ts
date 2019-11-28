import BaseEntity from '../common/base.entity';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
@Entity({ name: 'categorys' })
export class CategoryEntity extends BaseEntity {
  @ApiModelPropertyOptional()
  @Column({
    unique: true,
  })
  name: string;
}
