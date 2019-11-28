import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { PhotoEntity } from './photo.entity';
import { PaymentMethodEntity } from './paymentMethods.entity';
import { CommentEntity } from './comment.entity';
import { PaymentService } from './PaymentService';
import { CommentService } from './CommentService';
import { CategoryEntity } from './category.entity';
import { GroupEntity } from './group.entity';
import { UserToGroupEntity } from './userTogroup.entity';
import { GroupService } from './group.service';
import { CategoryService } from './category.service';
import { UserToGroupService } from './userToGroup.service';
import { CategoryController } from './category.controller';
import { CommentController } from './comment.controller';
import { GroupController } from './group.controller';
import { PaymentMethodController } from './paymentMethod.controller';
import { UserToGroupController } from './userToGroup.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PhotoEntity,
      PaymentMethodEntity,
      CommentEntity,
      CategoryEntity,
      GroupEntity,
      UserToGroupEntity,
    ]),
  ],
  controllers: [
    UserController,
    PhotoController,
    CategoryController,
    CommentController,
    GroupController,
    PaymentMethodController,
    UserToGroupController,
  ],
  providers: [
    PhotoService,
    UserService,
    UserToGroupService,
    PaymentService,
    CommentService,
    GroupService,
    CategoryService,
  ],
})
export class UserModule {}
