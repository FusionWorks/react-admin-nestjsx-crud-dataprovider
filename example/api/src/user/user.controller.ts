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

@Crud({
  model: {
    type: UserEntity,
  },
})
@Controller('users')
export class UserController {
  constructor(public service: UserService) {}

  @Get('custom')
  listing(@ParsedRequest() req: CrudRequest) {
    console.log('request', req, this.base);
    let options: any = {};
    let filter: any = {
      parsed: {
        fields: [],
        paramsFilter: [],
        filter: [{ field: 'firstname', operator: 'starts', value: 'jeff' }],
        or: [],
        join: [],
        sort: [],
        limit: undefined,
        offset: undefined,
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
    return this.service.getMany(filter);
  }
  get base(): CrudController<UserEntity> {
    return this;
  }
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    console.log('execute', req.parsed, req.options);
    return this.base.getManyBase(req);
  }
}
