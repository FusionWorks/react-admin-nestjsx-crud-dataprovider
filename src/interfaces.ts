import { QueryFields, QueryJoin } from "@nestjsx/crud-request";

export type POSSIBLE_ACTIONS =
  | "GET_LIST"
  | "GET_ONE"
  | "GET_MANY"
  | "GET_MANY_REFERENCE"
  | "CREATE"
  | "UPDATE"
  | "UPDATE_MANY"
  | "DELETE"
  | "DELETE_MANY";

export type FetchJsonType = (url: any, options?: ObjectLiteral | undefined) => Promise<{ status: number; headers: Headers; body: string; json: any; }>;


export interface ConfigurationEntry {
  requestMutator?(request: ClientRequestType): ClientRequestType;
  responseMutator?(
    response: ClientResposeType,
    request: ClientRequestType
  ): ClientResposeType;
}

export type IntergrateParams = QueryFields | QueryJoin;

export interface ClientRequestType {
  type: POSSIBLE_ACTIONS;
  resource: string;
  params: ObjectLiteral;
  integratedParams?: IntergrateParams;
}

export interface ClientResposeType {
  response: ObjectLiteral;
  type: POSSIBLE_ACTIONS;
  resource: string;
  params: ObjectLiteral;
}

export interface ObjectLiteral {
  [key: string]: any;
}
