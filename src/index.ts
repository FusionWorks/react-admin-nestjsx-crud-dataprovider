import { fetchUtils } from "ra-core";

import { IntergrateParams, ConfigurationEntry, FetchJsonType } from "./interfaces";
import { MAGIC_SEPARATOR } from "./constants";

import { makeRequest } from "./functions/makeRequest";

export default function createNestjsxCrudClient(
  apiUrl: string,
  httpClient: FetchJsonType = fetchUtils.fetchJson,
) {
  return makeRequest.bind(null, apiUrl, httpClient, {});
}

/**
 * Not documented yet. Experimental.
   * Will give us a hook to customize requets/responses
 */
export function createNestjsxCrudClientWithConfig(
  apiUrl: string,
  httpClient: FetchJsonType = fetchUtils.fetchJson,
  configuration: ConfigurationEntry = {},
) {
  return makeRequest.bind(null, apiUrl, httpClient, configuration);
}

export function encodeParamsInResource(
  resource: string,
  paramsToIntegrate: IntergrateParams,
) {
  return `${resource}${MAGIC_SEPARATOR}${JSON.stringify(paramsToIntegrate)}`;
}
