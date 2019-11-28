import BaseEntity from '../common/base.entity';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
@Entity({ name: 'photos' })
export class PhotoEntity extends BaseEntity {
  @ApiModelPropertyOptional()
  @Column({
    unique: true,
  })
  name: string;

  @ManyToOne(type => UserEntity, user => user.photos, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  }) // note: we will create author property in the Photo class below
  user: Promise<UserEntity>;
  @ApiModelProperty()
  @RelationId((entity: PhotoEntity) => entity.user)
  // @Column({
  // unique: true,
  // })
  userId: number;
}
