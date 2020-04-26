import { RequestQueryBuilder, CondOperator } from '@nestjsx/crud-request';
import omitBy from 'lodash.omitby';
import { fetchUtils } from 'react-admin';

const countDiff = (o1, o2) =>
  omitBy(o1, (v, k) => o2[k] === v);

const composeFilter = (paramsFilter) => {
  if (paramsFilter === '' || (typeof paramsFilter.q !== 'undefined' && paramsFilter.q === '')) {
    paramsFilter = {};
  }

  const flatFilter = fetchUtils.flattenObject(paramsFilter);
  return Object.keys(flatFilter).map((key) => {
    const splitKey = key.split('||');
    const ops = splitKey[1] ? splitKey[1] : 'cont';
    let field = splitKey[0];

    if (field.startsWith('_') && field.includes('.')) {
      field = field.split(/\.(.+)/)[1];
    }
    return { field, operator: ops, value: flatFilter[key] };
  });
};

export default (apiUrl, httpClient = fetchUtils.fetchJson) => ({
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;

    const query = RequestQueryBuilder.create({
      filter: composeFilter(params.filter),
    })
      .setLimit(perPage)
      .setPage(page)
      .sortBy(params.sort)
      .setOffset((page - 1) * perPage)
      .query();

    const url = `${apiUrl}/${resource}?${query}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource, params) => {
    const query = RequestQueryBuilder.create()
      .setFilter({
        field: 'id',
        operator: CondOperator.IN,
        value: `${params.ids}`,
      })
      .query();

    const url = `${apiUrl}/${resource}?${query}`;

    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const filter = composeFilter(params.filter);

    filter.push({
      field: params.target,
      operator: CondOperator.EQUALS,
      value: params.id,
    });

    const query = RequestQueryBuilder.create({
      filter,
    })
      .sortBy(params.sort)
      .setLimit(perPage)
      .setOffset((page - 1) * perPage)
      .query();

    const url = `${apiUrl}/${resource}?${query}`;

    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.total,
    }));
  },

  update: (resource, params) => {
    // no need to send all fields on partial update; only updated fields are enough
    const data = countDiff(params.data, params.previousData);
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then(({ json }) => ({ data: json }));
  },

  updateMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        }),
      ),
    ).then((responses) => ({
      data: responses.map(({ json }) => json),
    })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'DELETE',
        }),
      ),
    ).then((responses) => ({ data: responses.map(({ json }) => json) })),
});
