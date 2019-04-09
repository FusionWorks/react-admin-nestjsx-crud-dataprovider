import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Crud(UserEntity)
@Controller('users')
export class UserController {
  constructor(public service: UserService) {}
}
