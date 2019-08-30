import { QueryFilter, ComparisonOperator, CondOperator } from "@nestjsx/crud-request";
import { fetchUtils } from "ra-core";
import { ObjectLiteral } from "../interfaces";

/**
 * Not sure whats happening here.
 * @param paramsFilter
 */
export function composeFilter(paramsFilter: ObjectLiteral): QueryFilter[] {
  const flatFilter = fetchUtils.flattenObject(paramsFilter);

  return Object.keys(flatFilter).map((key) => {
    const splitKey = key.split("||");
    const operator = splitKey[1] as ComparisonOperator || CondOperator.CONTAINS;
    let field: string = splitKey[0];

    if (field.indexOf("_") === 0 && field.indexOf(".") !== -1) {
      field = field.split(/\.(.+)/)[1];
    }

    return {
      field,
      operator,
      value: flatFilter[key],
    };
  });
}
