import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { PhotoEntity } from './photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PhotoEntity])],
  controllers: [UserController, PhotoController],
  providers: [PhotoService, UserService],
})
export class UserModule {}
