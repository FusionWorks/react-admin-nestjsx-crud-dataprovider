import BaseEntity from '../common/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  RelationId,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { Post } from '@nestjs/common';
import { GroupEntity } from './group.entity';
@Entity()
export class UserToGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created;

  @UpdateDateColumn()
  updated;
  @Column()
  public order!: number;

  @ManyToOne(type => UserEntity, user => user.userToGroups)
  public user!: UserEntity;
  @ManyToOne(type => GroupEntity, user => user.userToGroups)
  public group!: GroupEntity;

  @RelationId((entity: UserToGroupEntity) => entity.user)
  //this is a must for one to many relationship
  @Column({ nullable: true })
  public userId!: number;

  @RelationId((entity: UserToGroupEntity) => entity.group)
  //this is a must for one to many relationship
  @Column({ nullable: true })
  public groupId!: number;
}
