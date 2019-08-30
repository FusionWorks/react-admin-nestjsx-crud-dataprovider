import {
  fetchUtils,
  UPDATE_MANY,
  DELETE_MANY
} from "ra-core";

import {
  ClientRequestType,
  POSSIBLE_ACTIONS,
  ConfigurationEntry,
  ObjectLiteral,
  FetchJsonType,
} from "../interfaces";

import { extractRealData } from "../functions/extractRealData";
import { httpParse } from "../functions/httpToData";
import { dataRequestToHTTP } from "../functions/dataToHTTP";

/**
 * Experimental, not directly exposed
 * Will give us a hook to customize requets/responses
 */
export async function makeRequest(
  apiUrl: string,
  httpClient: FetchJsonType = fetchUtils.fetchJson,
  configuration: ConfigurationEntry,
  type: POSSIBLE_ACTIONS,
  resource: string,
  params: ObjectLiteral,
): Promise<{ data: ObjectLiteral }> {
  let rawResponse: ObjectLiteral;

  const parsedResource = extractRealData(resource);

  let requestIntermediate: ClientRequestType = {
    type,
    resource: parsedResource.realResource,
    params,
    integratedParams: parsedResource.integratedParams,
  };

  if (configuration && configuration.requestMutator) {
    requestIntermediate = configuration.requestMutator(requestIntermediate);
  }

  if (requestIntermediate.type === UPDATE_MANY) {
    rawResponse = await Promise.all(
      requestIntermediate.params.ids.map((id: number | string) =>
        httpClient(`${apiUrl}/${parsedResource.realResource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(requestIntermediate.params.data)
        })
      )
    );
  } else if (requestIntermediate.type === DELETE_MANY) {
    rawResponse = await Promise.all(
      requestIntermediate.params.ids.map((id: number | string) =>
        httpClient(`${apiUrl}/${parsedResource.realResource}/${id}`, {
          method: "DELETE"
        })
      )
    );
  } else {
    const { url, options } = dataRequestToHTTP(
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
      requestIntermediate,
    );
  }

  const oneMoreIntermediateResponse = httpParse(
    responseIntermediate.response,
    requestIntermediate,
  );

  // in some conditions, we want to fetch fresh copy of the data from nest/crud.
  switch (requestIntermediate.type) {
    case "CREATE":
    case "UPDATE":
      return makeRequest(
        apiUrl,
        httpClient,
        configuration,
        "GET_ONE",
        resource,
        { id: oneMoreIntermediateResponse.data.id },
      );

    case "UPDATE_MANY":
      return Promise.all(
        oneMoreIntermediateResponse.data.map(({ id }: { id: number | string }) =>
          makeRequest(
            apiUrl,
            httpClient,
            configuration,
            "GET_ONE",
            resource,
            { id },
          )
        )
      ).then((all: ObjectLiteral) => ({
        data: all,
      }));

    default:
      return oneMoreIntermediateResponse;
  }
}
