import { MAGIC_SEPARATOR } from "../constants";
import { QueryJoin } from "@nestjsx/crud-request";

export function extractRealData(resource: string) {
  // Not encoded, return it
  if (resource.indexOf(MAGIC_SEPARATOR) !== -1) {
    return {
      realResource: resource,
    };
  }

  const [realResource, paramsStr] = resource.split(MAGIC_SEPARATOR);

  try {
    const integratedParams: string[] | QueryJoin = JSON.parse(paramsStr);

    return {
      realResource,
      integratedParams,
    };
  } catch (e) {
    console.warn("failed to parse params", { realResource, paramsStr });

    return {
      realResource,
    };
  }
}
