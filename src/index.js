import { stringify } from 'query-string';
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

export default (apiUrl, httpClient = fetchUtils.fetchJson) => {

  const composeFilter = (paramsFilter) => {
    const flatFilter = fetchUtils.flattenObject(paramsFilter)
    const filter = Object.keys(flatFilter).map(key => {
      const splitKey = key.split('||');
      let ops = splitKey[1] ? splitKey[1] : 'cont';
      let field = splitKey[0];
     
      if (field.indexOf('_') == 0 && field.indexOf('.') > -1) {
        field = field.split(/\.(.+)/)[1];
      }
      return field + '||' + ops + '||' + flatFilter[key];
    })
    return filter;
  }

  const convertDataRequestToHTTP = (type, resource, params) => {
    let url = '';
    const options = {};
    switch (type) {
      case GET_LIST: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const filter = composeFilter(params.filter);
        const query = {
          sort: field + ',' + order,
          limit: perPage,
          offset: (page - 1) * perPage,
          filter,
        };
        url = `${apiUrl}/${resource}?${stringify(query)}`;
        break;
      }
      case GET_ONE:
        url = `${apiUrl}/${resource}/${params.id}`;
        break;
      case GET_MANY: {
        const query = {
          filter: JSON.stringify({ id: params.ids }),
        };
        url = `${apiUrl}/${resource}?${stringify(query)}`;
        break;
      }
      case GET_MANY_REFERENCE: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const filter = composeFilter(params.filter);
        filter.push(params.target + '||eq||' + params.id);
        const query = {
          sort: field + ',' + order,
          limit: perPage,
          offset: (page - 1) * perPage,
          filter
        };
        url = `${apiUrl}/${resource}?${stringify(query)}`;
        break;
      }
      case UPDATE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'PATCH';
        options.body = JSON.stringify(params.data);
        break;
      case CREATE:
        url = `${apiUrl}/${resource}`;
        options.method = 'POST';
        options.body = JSON.stringify(params.data);
        break;
      case DELETE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'DELETE';
        break;
      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
    return { url, options };
  };

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
