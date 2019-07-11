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
  DELETE_MANY,
} from 'react-admin';

/**
 * Maps react-admin queries to a simple REST API
 *
 * The REST dialect is similar to the one of FakeRest
 * @see https://github.com/marmelab/FakeRest
 * @example
 * GET_LIST     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter={ids:[123,456,789]}
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export default (apiUrl, httpClient = fetchUtils.fetchJson) => {

  const composeFilter = (paramsFilter) => {
    const flatFilter = fetchUtils.flattenObject(paramsFilter);
    const filter = Object.keys(flatFilter).map(key => {
      const splitKey = key.split('||');
      let ops = splitKey[1] ? splitKey[1] : 'cont';
      let field = splitKey[0];
      // code below allows multifield filters in react admin (date range for example). Here is an example:
      //
      // <InputRow source="_created_range" label="Cretaion date">
      //   <DateInput source="_created_range.created||gte" label="From" options={{ format: 'dd/MM/YYYY' }} />
      //   <DateInput source="_created_range.created||lte" label="To" options={{ format: 'dd/MM/YYYY' }} />
      // </InputRow>
      if (field.indexOf('_') === 0 && field.indexOf('.') > -1) {
        field = field.split(/\.(.+)/)[1];
      }
      return {field: field, operator: ops, value: flatFilter[key]};
    });
    return filter;
  };

  /**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The data request params, depending on the type
   * @returns {Object} { url, options } The HTTP request parameters
   */
  const convertDataRequestToHTTP = (type, resource, params) => {
    let url = '';
    const options = {};
    switch (type) {
      case GET_LIST: {
        const { page, perPage } = params.pagination;

        const query = RequestQueryBuilder
            .create({
                  filter: composeFilter(params.filter)
                }
            )
            .setLimit(perPage)
            .setPage(page)
            .sortBy(params.sort)
            .setOffset((page - 1) * perPage)
            .query();

        url = `${apiUrl}/${resource}?${query}`;

        break;
      }
      case GET_ONE: {
        url = `${apiUrl}/${resource}/${params.id}`;

        break;
      }
      case GET_MANY: {
        const query = RequestQueryBuilder
            .create()
            .setFilter({
              field: 'id',
              operator: CondOperator.IN,
              value: `${params.ids}`
            })
            .query();

        url = `${apiUrl}/${resource}?${query}`;

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

        const query = RequestQueryBuilder
            .create({
              filter: filter
            })
            .sortBy(params.sort)
            .setLimit(perPage)
            .setOffset((page - 1) * perPage)
            .query();

        url = `${apiUrl}/${resource}?${query}`;

        break;
      }
      case UPDATE: {
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'PATCH';
        options.body = JSON.stringify(params.data);
        break;
      }
      case CREATE: {
        url = `${apiUrl}/${resource}`;
        options.method = 'POST';
        options.body = JSON.stringify(params.data);
        break;
      }
      case DELETE: {
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'DELETE';
        break;
      }
      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
    return { url, options };
  };

  /**
   * @param {Object} response HTTP response from fetch()
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The data request params, depending on the type
   * @returns {Object} Data response
   */
  const convertHTTPResponse = (response, type, resource, params) => {
    const { headers, json } = response;
    switch (type) {
      case GET_LIST:
      case GET_MANY_REFERENCE:
        return {
          data: json.data,
          total: json.total,
        };
      case CREATE:
        return { data: { ...params.data, id: json.id } };
      default:
        return { data: json };
    }
  };

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a data response
   */
  return (type, resource, params) => {
    // simple-rest doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
    if (type === UPDATE_MANY) {
      return Promise.all(
          params.ids.map(id =>
              httpClient(`${apiUrl}/${resource}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(params.data),
              })
          )
      ).then(responses => ({
        data: responses.map(response => response.json),
      }));
    }
    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    if (type === DELETE_MANY) {
      return Promise.all(
          params.ids.map(id =>
              httpClient(`${apiUrl}/${resource}/${id}`, {
                method: 'DELETE',
              })
          )
      ).then(responses => ({
        data: responses.map(response => response.json),
      }));
    }

    const { url, options } = convertDataRequestToHTTP(
        type,
        resource,
        params
    );
    return httpClient(url, options).then(response =>
        convertHTTPResponse(response, type, resource, params)
    );
  };
};
