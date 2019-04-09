import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { RepositoryService } from '@nestjsx/crud/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RestfulOptions } from '@nestjsx/crud';

@Injectable()
export class UserService extends RepositoryService<UserEntity> {
  protected options: RestfulOptions = {
    exclude: ['password']
  };

  constructor(@InjectRepository(UserEntity) repo) {
    super(repo);
  }
}
