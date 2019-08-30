import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
} from "ra-core";

import {
  RequestQueryBuilder,
  CondOperator,
  QueryJoin,
} from "@nestjsx/crud-request";

import { extractRealData } from "./extractRealData";
import { composeFilter } from "./composeFilter";
import { ObjectLiteral } from "../interfaces";

export function dataRequestToHTTP(
  apiUrl: string,
  type: string,
  resource: string,
  params: ObjectLiteral,
) {
  let url = "";
  const options: ObjectLiteral = {};
  const parsedResource = extractRealData(resource);
  const { realResource } = parsedResource;
  const integratedParams: string[] | QueryJoin | ObjectLiteral = parsedResource.integratedParams || {} as ObjectLiteral;

  switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination;

      let query = RequestQueryBuilder
        .create({
          filter: composeFilter(params.filter),
        })
        .setLimit(perPage)
        .setPage(page)
        .sortBy(params.sort)
        .setOffset((page - 1) * perPage);

      if (integratedParams.join) {
        integratedParams.join.forEach((join: QueryJoin) => {
          query = query.setJoin(join);
        });
      }

      if (integratedParams.fields) {
        query = query.select(integratedParams.fields);
      }

      url = `${apiUrl}/${realResource}?${query.query()}`;

      break;
    }

    case GET_ONE: {
      let query = RequestQueryBuilder.create();

      if (integratedParams.join) {
        integratedParams.join.forEach((join: QueryJoin) => {
          query = query.setJoin(join);
        });
      }

      if (integratedParams.fields) {
        query = query.select(integratedParams.fields);
      }

      url = `${apiUrl}/${realResource}/${params.id}?${query.query()}`;

      break;
    }

    case GET_MANY: {
      let query = RequestQueryBuilder
        .create()
        .setFilter({
          field: "id",
          operator: CondOperator.IN,
          value: `${params.ids}`,
        });

      if (integratedParams.join) {
        integratedParams.join.forEach((join: QueryJoin) => {
          query = query.setJoin(join);
        });
      }

      if (integratedParams.fields) {
        query = query.select(integratedParams.fields);
      }

      url = `${apiUrl}/${realResource}?${query.query()}`;

      break;
    }

    case GET_MANY_REFERENCE: {
      const { page, perPage } = params.pagination;
      const filter = composeFilter(params.filter);

      filter.push({
        field: params.target,
        operator: CondOperator.EQUALS,
        value: params.id,
      });

      let query = RequestQueryBuilder
        .create({ filter })
        .sortBy(params.sort)
        .setLimit(perPage)
        .setOffset((page - 1) * perPage);

      if (integratedParams.join) {
        integratedParams.join.forEach((join: QueryJoin) => {
          query = query.setJoin(join);
        });
      }

      if (integratedParams.fields) {
        query = query.select(integratedParams.fields);
      }

      url = `${apiUrl}/${realResource}?${query.query()}`;

      break;
    }

    case UPDATE: {
      url = `${apiUrl}/${realResource}/${params.id}`;
      options.method = "PATCH";
      options.body = JSON.stringify(params.data);
      break;
    }

    case CREATE: {
      url = `${apiUrl}/${realResource}`;
      options.method = "POST";
      options.body = JSON.stringify(params.data);
      break;
    }

    case DELETE: {
      url = `${apiUrl}/${realResource}/${params.id}`;
      options.method = "DELETE";
      break;
    }

    default:
      throw new Error(`Unsupported fetch action type ${type}`);
  }

  return { url, options };
}
