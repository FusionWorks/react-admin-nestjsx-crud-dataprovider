import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PhotoEntity } from './photo.entity';
import { GroupEntity } from './group.entity';

@Injectable()
export class GroupService extends TypeOrmCrudService<GroupEntity> {
  // protected options: RestfulOptions = {
  //   exclude: ['password'],
  // };

  constructor(@InjectRepository(GroupEntity) repo) {
    super(repo);
  }
}
