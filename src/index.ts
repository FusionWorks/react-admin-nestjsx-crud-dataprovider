import { fetchUtils } from "ra-core";

import { MAGIC_SEPARATOR, makeNestjsxCrudRequest } from "./nonePublicStuff";

export default function createNestjsxCrudClient(
  apiUrl: string,
  httpClient: any = fetchUtils.fetchJson
) {
  return makeNestjsxCrudRequest.bind(null, apiUrl, httpClient, {});
}

/**
 * Not documented yet. Experimental.
 */
export function createNestjsxCrudClientWithConfig(
  apiUrl: string,
  httpClient: any = fetchUtils.fetchJson,
  /**
   * Not documented yet. Experimental.
   * Will give us a hook to customize requets/responses
   */
  configuration: import("./interfaces").ConfigurationEntry = {}
) {
  return makeNestjsxCrudRequest.bind(null, apiUrl, httpClient, configuration);
}

export function encodeParamsInResource(
  resource: string,
  paramsToIntegrate: Pick<
    import("@nestjsx/crud-request").CreateQueryParams,
    "join" | "fields"
  >
) {
  return `${resource}${MAGIC_SEPARATOR}${JSON.stringify(paramsToIntegrate)}`;
}
