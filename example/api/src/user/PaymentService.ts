import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PhotoEntity } from './photo.entity';
import { PaymentMethodEntity } from './paymentMethods.entity';

@Injectable()
// protected options: RestfulOptions = {
export class PaymentService extends TypeOrmCrudService<PaymentMethodEntity> {
  //   exclude: ['password'],
  // };

  constructor(@InjectRepository(PaymentMethodEntity) repo) {
    super(repo);
  }
}
