import { ClientRequestType, ObjectLiteral } from "../interfaces";
import { DELETE_MANY, GET_MANY_REFERENCE, GET_LIST } from "ra-core";

export function httpParse(
  rawResponse: ObjectLiteral,
  request: ClientRequestType,
) {
  let toReturn: { data: ObjectLiteral, total?: number } = {
    data: Array.isArray(rawResponse)
      ? rawResponse.map((raw: ObjectLiteral) => raw.json)
      : rawResponse.json,
  };

  switch (request.type) {
    case DELETE_MANY:
      toReturn = {
        data: request.params.ids,
      };
      break;

    case GET_LIST:
    case GET_MANY_REFERENCE:
      toReturn = {
        data: toReturn.data,
        total: toReturn.total,
      };
  }

  return toReturn;
}
