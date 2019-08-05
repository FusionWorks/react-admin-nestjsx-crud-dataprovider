import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PhotoEntity } from './photo.entity';
import { GroupEntity } from './group.entity';
import { UserToGroupEntity } from './userTogroup.entity';

@Injectable()
export class UserToGroupService extends TypeOrmCrudService<UserToGroupEntity> {
  // protected options: RestfulOptions = {
  //   exclude: ['password'],
  // };

  constructor(@InjectRepository(UserToGroupEntity) repo) {
    super(repo);
  }
}
