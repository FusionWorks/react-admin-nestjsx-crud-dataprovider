import BaseEntity from '../common/base.entity';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
@Entity({ name: 'comments' })
export class CommentEntity extends BaseEntity {
  @ApiModelPropertyOptional()
  @Column({
    unique: true,
  })
  text: string;

  @ManyToOne(type => UserEntity, user => user.comments, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  }) // note: we will create author property in the Photo class below
  user: UserEntity;
  @ApiModelProperty()
  @RelationId((entity: CommentEntity) => entity.user)
  userId: number;
}
