// @ts-ignore
export async function asyncResultsToValue(jestFned) {
  // @ts-ignore
  jestFned.mock.results = await Promise.all(
    (jestFned.mock.results || []).map(
      async (result: { value: any; type: any }) => {
        if (result.value instanceof Promise) {
          return {
            type: result.type,
            wasPromise: true,
            value: await result.value
          };
        }

        return result;
      }
    )
  );

  return jestFned;
}

export function createJestFnSerialReturn(toReturn: any[]) {
  let callCounter = 0;

  return jest.fn(() => {
    if (callCounter >= toReturn.length) {
      throw new Error("missing return value in createJestFnSerialReturn");
    }

    return toReturn[callCounter++];
  });
}
