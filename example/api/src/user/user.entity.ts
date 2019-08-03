import BaseEntity from '../common/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { PhotoEntity } from './photo.entity';
import { CommentEntity } from './comment.entity';
import { PaymentMethodEntity } from './paymentMethods.entity';
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

  @OneToMany(type => PhotoEntity, photo => photo.user) // note: we will create author property in the Photo class below
  photos: PhotoEntity[];

  @OneToMany(type => CommentEntity, comment => comment.user) // note: we will create author property in the Photo class below
  comments: PhotoEntity[];

  @OneToMany(type => PaymentMethodEntity, paymentMethod => paymentMethod.user) // note: we will create author property in the Photo class below
  paymentMethods: PaymentMethodEntity[];
}
