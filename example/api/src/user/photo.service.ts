import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PhotoEntity } from './photo.entity';

@Injectable()
export class PhotoService extends TypeOrmCrudService<PhotoEntity> {
  // protected options: RestfulOptions = {
  //   exclude: ['password'],
  // };

  constructor(@InjectRepository(PhotoEntity) repo) {
    super(repo);
  }
}
