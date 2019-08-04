import BaseEntity from '../common/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  RelationId,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { Post } from '@nestjs/common';
import { GroupEntity } from './group.entity';
@Entity()
export class UserToGroupEntity extends BaseEntity {
  public userId!: number;
  public groupId!: number;

  @Column()
  public order!: number;

  @ManyToOne(type => UserEntity, user => user.userToGroups)
  public user!: UserEntity;
  @ManyToOne(type => GroupEntity, user => user.userToGroups)
  public group!: GroupEntity;
}
