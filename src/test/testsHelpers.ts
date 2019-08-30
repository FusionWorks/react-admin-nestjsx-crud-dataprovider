/**
 * when the given return value of a spy is a promise,
 * expand it to the resolved value, for snapshotting
 *
 * @param jestFned
 */
export async function asyncResultsToValue(jestFned: any) {
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

/**
 *  Create a jest spy that return the given values one by one for each call
 *
 * @param toReturn array of values to return
 */
export function createJestFnSerialReturn(toReturn: any[]) {
  let callCounter = 0;

  return jest.fn(() => {
    if (callCounter >= toReturn.length) {
      throw new Error("missing return value in createJestFnSerialReturn");
    }

    return toReturn[callCounter++];
  });
}
