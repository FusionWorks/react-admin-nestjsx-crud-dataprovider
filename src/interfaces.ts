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

export interface ConfigurationEntry {
  requestMutator?(request: ClientRequestType): ClientRequestType;
  responseMutator?(
    response: ClientResposeType,
    request: ClientRequestType
  ): ClientResposeType;
}

export type IntergrateParams = Pick<
  import("@nestjsx/crud-request").CreateQueryParams,
  "join" | "fields"
>;

export interface ClientRequestType {
  type: POSSIBLE_ACTIONS;
  resource: string;
  params: any;
  integratedParams?: IntergrateParams;
}

export interface ClientResposeType {
  response: any;
  type: POSSIBLE_ACTIONS;
  resource: string;
  params: any;
}
