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
@Crud({
  model: {
    type: PhotoEntity,
  },
})
@Controller('photo')
export class PhotoController {
  constructor(
    public service: PhotoService,

    @InjectRepository(PhotoEntity)
    public repo: Repository<PhotoEntity>,
    @InjectRepository(UserEntity)
    public userRepo: Repository<UserEntity>,
  ) {}

  //http://localhost:3000/users?filter=firstname||starts||c&sort=id,DESC&per_page=10&offset=0&page=1
  //http://localhost:3000/users/custom
  //Study the loading
  @Get('custom')
  listing(@ParsedRequest() req: CrudRequest) {
    console.log('request', req, this.base);
    // let options: any = {};
    let query: any = {
      parsed: {
        fields: [],
        paramsFilter: [],
        filter: [{ field: 'user', operator: 'eq', value: 1 }],
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
    return this.service.getMany(query);
  }

  @Get('customFull')
  listingCustom(@ParsedRequest() req: CrudRequest) {
    return this.repo.find();
  }

  @Get('import1W')
  async import1W(@ParsedRequest() req: CrudRequest) {
    let user = await this.userRepo.findOneOrFail(1);
    console.log('user', user, Promise.resolve(user));
    for (let i = 0; i < 10000; i++) {
      let photo = await this.repo.create({
        name: 'photo' + Math.random(),
      });
      // console.log()
      photo.user = Promise.resolve(user);
      // console.log(photo);
      await this.repo.save(photo);
    }
  }

  @Get('customFull')
  Custom(@ParsedRequest() req: CrudRequest) {
    return this.repo.find();
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
