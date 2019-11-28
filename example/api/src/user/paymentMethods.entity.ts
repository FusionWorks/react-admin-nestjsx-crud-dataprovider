import BaseEntity from '../common/base.entity';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
@Entity({ name: 'paymentMethods' })
export class PaymentMethodEntity extends BaseEntity {
  @ApiModelPropertyOptional()
  @Column({
    unique: true,
  })
  type: string;

  @ManyToOne(type => UserEntity, user => user.paymentMethods, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    eager: true,
  }) // note: we will create author property in the Photo class below
  user: UserEntity;
  @ApiModelProperty()
  @RelationId((entity: PaymentMethodEntity) => entity.user)
  userId: number;
}
