import BaseEntity from '../common/base.entity';
import { Entity, Column, ManyToOne, RelationId, OneToMany } from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { UserToGroupEntity } from './userTogroup.entity';
@Entity({ name: 'groups' })
export class GroupEntity extends BaseEntity {
  @ApiModelPropertyOptional()
  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(type => UserToGroupEntity, userToGroup => userToGroup.group)
  public userToGroups!: UserToGroupEntity[];
}
