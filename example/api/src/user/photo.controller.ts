import { Controller, Get } from '@nestjs/common';
import {
  Crud,
  ParsedRequest,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  CrudController,
} from '@nestjsx/crud';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { PhotoEntity } from './photo.entity';
import { PhotoService } from './photo.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodEntity } from './paymentMethods.entity';
import { CommentEntity } from './comment.entity';
import { PaymentService } from './PaymentService';
import { CommentService } from './CommentService';
@Crud({
  model: {
    type: PhotoEntity,
  },
})
@Controller('photo')
export class PhotoController {
  constructor(
    public service: PhotoService,
    public paymentService: PaymentService,
    public commentService: CommentService,
    @InjectRepository(PhotoEntity)
    public repo: Repository<PhotoEntity>,
    @InjectRepository(UserEntity)
    public userRepo: Repository<UserEntity>,
    @InjectRepository(PaymentMethodEntity)
    public paymentMethodRepo: Repository<PaymentMethodEntity>,
    @InjectRepository(CommentEntity)
    public commentRepo: Repository<CommentEntity>,
  ) {}

  //http://localhost:3000/users?filter=firstname||starts||c&sort=id,DESC&per_page=10&offset=0&page=1
  //http://localhost:3000/users/custom
  //Study the loading
  @Get('custom')
  listing(@ParsedRequest() req: CrudRequest) {
    // console.log('request', req, this.base);
    // let options: any = {};
    let query: any = {
      parsed: {
        fields: [],
        paramsFilter: [],
        filter: [{ field: 'userId', operator: 'eq', value: 1 }],
        or: [],
        join: [],
        sort: [],
        //if have limit&offset, it returns pagination&limit
        limit: 10,
        offset: 0,
        page: undefined,
        cache: undefined,
      },
      options: {
        query: {},
        // routes: {
        // getManyBase: { interceptors: [], decorators: [] },
        // getOneBase: { interceptors: [], decorators: [] },
        // createOneBase: { interceptors: [], decorators: [] },
        // createManyBase: { interceptors: [], decorators: [] },
        // updateOneBase: {
        //   interceptors: [],
        //   decorators: [],
        //   allowParamsOverride: false,
        // },
        // replaceOneBase: {
        //   interceptors: [],
        //   decorators: [],
        //   allowParamsOverride: false,
        // },
        // deleteOneBase: {
        //   interceptors: [],
        //   decorators: [],
        //   returnDeleted: false,
        // },
        // },
        // params: { id: { field: 'id', type: 'number', primary: true } },
      },
    };
    // return this.service.decidePagination(query.parsed, query.options);
    return this.commentService.getMany(query);
  }

  @Get('raw')
  async listingCustom(@ParsedRequest() req: CrudRequest) {
    /*

    SELECT `PhotoEntity`.`id` AS `PhotoEntity_id`, `PhotoEntity`.`created` AS `PhotoEntity_created`, `PhotoEntity`.`updated` AS `PhotoEntity_updated`, `PhotoEntity`.`name` AS `PhotoEntity_name`, `PhotoEntity`.`userId` AS `PhotoEntity_userId` FROM `photos` `PhotoEntity
no n+1
    */
    // ;
  }

  @Get('rawComment')
  listingComment(@ParsedRequest() req: CrudRequest) {
    /*
SELECT `CommentEntity`.`id` AS `CommentEntity_id`, `CommentEntity`.`created` AS `CommentEntity_created`, `CommentEntity`.`updated` AS `CommentEntity_updated`, `CommentEntity`.`text` AS `CommentEntity_text`, `CommentEntity`.`userId` AS `CommentEntity_userId` FROM `comments` `CommentEntity

no n+1 too

purely is javascript is slow for 10000
    */
    return this.commentRepo.find();
  }
  @Get('rawPaymentMethod')
  listingPaymentMethod(@ParsedRequest() req: CrudRequest) {
    /*
SELECT `PaymentMethodEntity`.`id` AS `PaymentMethodEntity_id`, `PaymentMethodEntity`.`created` AS `PaymentMethodEntity_created`, `PaymentMethodEntity`.`updated` AS `PaymentMethodEntity_updated`, `PaymentMethodEntity`.`type` AS `PaymentMethodEntity_type`, `PaymentMethodEntity`.`userId` AS `PaymentMethodEntity_userId`, `PaymentMethodEntity_user`.`id` AS `PaymentMethodEntity_user_id`, `PaymentMethodEntity_user`.`created` AS `PaymentMethodEntity_user_created`, `PaymentMethodEntity_user`.`updated` AS `PaymentMethodEntity_user_updated`, `PaymentMethodEntity_user`.`email` AS `PaymentMethodEntity_user_email`, `PaymentMethodEntity_user`.`firstname` AS `PaymentMethodEntity_user_firstname`, `PaymentMethodEntity_user`.`lastname` AS `PaymentMethodEntity_user_lastname` FROM `paymentMethods` `PaymentMethodEntity` LEFT JOIN `users` `PaymentMethodEntity_user` ON `PaymentMethodEntity_user`.`id`=`PaymentMethodEntity`.`userId`

would suffer from n+1

    */

    return this.paymentMethodRepo.find();
  }
  @Get('prepareData')
  async prepareData() {
    let user = await this.userRepo.save({
      email: 'jeff chung',
      password: '2312312',
      firstname: 'asdasd',
      lastname: 'ddd',
    });
    await this.userRepo.save({
      email: 'jeff asdsdachung',
      password: '2312311qw2',
      firstname: 'asdaseeed',
      lastname: 'dddee',
    });
    // await this.userRepo.findOneOrFail(1);
    console.log('user', user, Promise.resolve(user));
    for (let i = 0; i < 100; i++) {
      let photo = await this.repo.create({
        name: 'photo' + Math.random(),
      });
      // console.log()
      photo.user = Promise.resolve(user);
      // console.log(photo);
      await this.repo.save(photo);
    }

    for (let i = 0; i < 100; i++) {
      await this.paymentMethodRepo.save({
        type: 'creditCard' + Math.random(),
        user: user,
      });
    }

    for (let i = 0; i < 100; i++) {
      await this.commentRepo.save({
        text: 'random comment' + Math.random(),
        user: user,
      });
    }
  }
  get base(): CrudController<PhotoEntity> {
    return this;
  }
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    console.log('execute', req.parsed, req.options);
    return this.base.getManyBase(req);
  }
}
