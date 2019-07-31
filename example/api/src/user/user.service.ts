import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  // protected options: RestfulOptions = {
  //   exclude: ['password'],
  // };

  constructor(@InjectRepository(UserEntity) repo) {
    super(repo);
  }
}
