import { RequestQueryBuilder, CondOperator } from "@nestjsx/crud-request";

import {
  fetchUtils,
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY
} from "ra-core";
import { ClientRequestType, POSSIBLE_ACTIONS } from "./interfaces";

/** @internal */
export async function makeNestjsxCrudRequest(
  apiUrl: string,
  httpClient = fetchUtils.fetchJson,
  /**
   * experimental, not directly exposed
   * Will give us a hook to customize requets/responses
   */
  configuration: import("./interfaces").ConfigurationEntry,
  type: POSSIBLE_ACTIONS,
  resource: string,
  params: any
): Promise<{ data: any }> {
  let rawResponse: any;

  const parsedResource = extractRealResourceAndParams(resource);
  let requestIntermediate: ClientRequestType = {
    type,
    resource: parsedResource.realResource,
    params,
    integratedParams: parsedResource.integratedParams
  };

  if (configuration && configuration.requestMutator) {
    requestIntermediate = configuration.requestMutator(requestIntermediate);
  }

  if (requestIntermediate.type === UPDATE_MANY) {
    rawResponse = await Promise.all(
      requestIntermediate.params.ids.map((id: any) =>
        httpClient(`${apiUrl}/${parsedResource.realResource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(requestIntermediate.params.data)
        })
      )
    );
  } else if (requestIntermediate.type === DELETE_MANY) {
    rawResponse = await Promise.all(
      requestIntermediate.params.ids.map((id: any) =>
        httpClient(`${apiUrl}/${parsedResource.realResource}/${id}`, {
          method: "DELETE"
        })
      )
    );
  } else {
    const { url, options } = convertDataRequestToHTTP(
      apiUrl,
      requestIntermediate.type,
      // Original and not intermediate here.
      resource,
      requestIntermediate.params
    );

    rawResponse = await httpClient(url, options);
  }

  // maybe pass here original and not intermediate values?
  let responseIntermediate = {
    response: rawResponse,
    type: requestIntermediate.type,
    resource: requestIntermediate.resource,
    params: requestIntermediate.params
  };

  if (configuration && configuration.responseMutator) {
    responseIntermediate = configuration.responseMutator(
      responseIntermediate,
      requestIntermediate
    );
  }

  const oneMoreIntermediateResponse = convertHTTPResponse(
    responseIntermediate.response,
    requestIntermediate
  );

  // in some conditions, we want to fetch fresh copy of the data from nest/crud.
  switch (requestIntermediate.type) {
    case "CREATE":
    case "UPDATE":
      return makeNestjsxCrudRequest(
        apiUrl,
        httpClient,
        configuration,
        "GET_ONE",
        resource,
        { id: oneMoreIntermediateResponse.data.id }
      );

    case "UPDATE_MANY":
      return Promise.all(
        oneMoreIntermediateResponse.data.map(({ id }: { id: any }) =>
          makeNestjsxCrudRequest(
            apiUrl,
            httpClient,
            configuration,
            "GET_ONE",
            resource,
            { id }
          )
        )
      ).then((all: any) => ({
        data: all
      }));

    default:
      return oneMoreIntermediateResponse;
  }
}

/** @internal */
export function convertHTTPResponse(
  rawResponse: any,
  request: ClientRequestType
) {
  let toReturn: any = Array.isArray(rawResponse)
    ? { data: rawResponse.map(entry => entry.json) }
    : { data: rawResponse.json };

  switch (request.type) {
    case DELETE_MANY:
      toReturn = {
        data: request.params.ids
      };
      break;

    case GET_LIST:
    case GET_MANY_REFERENCE:
      toReturn = {
        data: rawResponse.json.data,
        total: rawResponse.json.total
      };
  }

  return toReturn;
}

/** @internal */
export function composeFilter(paramsFilter: any) {
  const flatFilter = fetchUtils.flattenObject(paramsFilter);
  const filter = Object.keys(flatFilter).map(key => {
    const splitKey = key.split("||");
    const ops = splitKey[1] ? splitKey[1] : CondOperator.CONTAINS;
    let field = splitKey[0];

    if (field.indexOf("_") === 0 && field.indexOf(".") > -1) {
      field = field.split(/\.(.+)/)[1];
    }
    return { field, operator: ops, value: flatFilter[key] };
  });
  return filter;
}

/** @internal */
export const MAGIC_SEPARATOR = "_._._._";

/** @internal */
export function extractRealResourceAndParams(resourceMaybeWithEncoded: string) {
  if (!resourceMaybeWithEncoded.includes(MAGIC_SEPARATOR)) {
    return {
      realResource: resourceMaybeWithEncoded
    };
  }

  const [realResource, paramsStr] = resourceMaybeWithEncoded.split(
    MAGIC_SEPARATOR
  );

  try {
    const integratedParams: Pick<
      import("@nestjsx/crud-request").CreateQueryParams,
      "join" | "fields"
    > = JSON.parse(paramsStr);

    return {
      realResource,
      integratedParams
    };
  } catch (e) {
    // @ts-ignore
    console.warn("failed to parse params", { realResource, paramsStr });
    return {
      realResource
    };
  }
}

/** @internal */
export function convertDataRequestToHTTP(
  apiUrl: string,
  type: string,
  resource: string,
  params: any
) {
  let url = "";
  const options: any = {};
  const parsedResource = extractRealResourceAndParams(resource);

  switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination;

      let query = RequestQueryBuilder
        // @ts-ignore
        .create({
          filter: composeFilter(params.filter)
        })
        .setLimit(perPage)
        .setPage(page)
        .sortBy(params.sort)
        .setOffset((page - 1) * perPage);

      if (parsedResource.integratedParams) {
        if (parsedResource.integratedParams.join) {
          parsedResource.integratedParams.join.forEach(join => {
            query = query.setJoin(join);
          });
        }

        if (parsedResource.integratedParams.fields) {
          query = query.select(parsedResource.integratedParams.fields);
        }
      }

      url = `${apiUrl}/${parsedResource.realResource}?${query.query()}`;

      break;
    }
    case GET_ONE: {
      let query = RequestQueryBuilder.create();

      if (parsedResource.integratedParams) {
        if (parsedResource.integratedParams.join) {
          parsedResource.integratedParams.join.forEach(join => {
            query = query.setJoin(join);
          });
        }

        if (parsedResource.integratedParams.fields) {
          query = query.select(parsedResource.integratedParams.fields);
        }
      }

      url = `${apiUrl}/${parsedResource.realResource}/${
        params.id
      }?${query.query()}`;

      break;
    }
    case GET_MANY: {
      let query = RequestQueryBuilder.create().setFilter({
        field: "id",
        operator: CondOperator.IN,
        value: `${params.ids}`
      });

      if (parsedResource.integratedParams) {
        if (parsedResource.integratedParams.join) {
          parsedResource.integratedParams.join.forEach(join => {
            query = query.setJoin(join);
          });
        }

        if (parsedResource.integratedParams.fields) {
          query = query.select(parsedResource.integratedParams.fields);
        }
      }

      url = `${apiUrl}/${parsedResource.realResource}?${query.query()}`;

      break;
    }
    case GET_MANY_REFERENCE: {
      const { page, perPage } = params.pagination;
      const filter = composeFilter(params.filter);

      filter.push({
        field: params.target,
        operator: CondOperator.EQUALS,
        value: params.id
      });

      let query = RequestQueryBuilder
        // @ts-ignore
        .create({
          filter
        })
        .sortBy(params.sort)
        .setLimit(perPage)
        .setOffset((page - 1) * perPage);

      if (parsedResource.integratedParams) {
        if (parsedResource.integratedParams.join) {
          parsedResource.integratedParams.join.forEach(join => {
            query = query.setJoin(join);
          });
        }

        if (parsedResource.integratedParams.fields) {
          query = query.select(parsedResource.integratedParams.fields);
        }
      }

      url = `${apiUrl}/${parsedResource.realResource}?${query.query()}`;

      break;
    }
    case UPDATE: {
      url = `${apiUrl}/${parsedResource.realResource}/${params.id}`;
      options.method = "PATCH";
      options.body = JSON.stringify(params.data);
      break;
    }
    case CREATE: {
      url = `${apiUrl}/${parsedResource.realResource}`;
      options.method = "POST";
      options.body = JSON.stringify(params.data);
      break;
    }
    case DELETE: {
      url = `${apiUrl}/${parsedResource.realResource}/${params.id}`;
      options.method = "DELETE";
      break;
    }
    default:
      throw new Error(`Unsupported fetch action type ${type}`);
  }
  return { url, options };
}
