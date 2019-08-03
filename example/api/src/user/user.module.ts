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
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PhotoEntity,
      PaymentMethodEntity,
      CommentEntity,
    ]),
  ],
  controllers: [UserController, PhotoController],
  providers: [PhotoService, UserService, PaymentService, CommentService],
})
export class UserModule {}
