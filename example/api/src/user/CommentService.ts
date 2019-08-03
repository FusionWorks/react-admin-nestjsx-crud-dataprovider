import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PhotoEntity } from './photo.entity';
import { PaymentMethodEntity } from './paymentMethods.entity';
import { CommentEntity } from './comment.entity';

@Injectable()
// protected options: RestfulOptions = {
export class CommentService extends TypeOrmCrudService<CommentEntity> {
  //   exclude: ['password'],
  // };

  constructor(@InjectRepository(CommentEntity) repo) {
    super(repo);
  }
}
