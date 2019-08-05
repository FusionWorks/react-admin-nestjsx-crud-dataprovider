import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PhotoEntity } from './photo.entity';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryService extends TypeOrmCrudService<CategoryEntity> {
  // protected options: RestfulOptions = {
  //   exclude: ['password'],
  // };

  constructor(@InjectRepository(CategoryEntity) repo) {
    super(repo);
  }
}
