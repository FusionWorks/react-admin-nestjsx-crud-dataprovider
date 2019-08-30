import createDataProvider, { encodeParamsInResource } from "../index";
import { asyncResultsToValue, createJestFnSerialReturn } from "./testsHelpers";

describe("Basic tests", () => {
  test("GET_ONE 1", async () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const httpClient: any = createJestFnSerialReturn([
      {
        json: {
          id: 42,
          title: "The Hitchhiker's guide to the galaxy"
        }
      }
    ]);

    const dataProvider = createDataProvider(
      "https://test.test/api",
      httpClient
    );

    expect(
      await dataProvider("GET_ONE", "books", { id: 42 })
    ).toMatchSnapshot();
    expect(await asyncResultsToValue(httpClient)).toMatchSnapshot();
  });
});

describe("CREATE 1", () => {
  test("CREATE 1", async () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const httpClient: any = createJestFnSerialReturn([
      {
        json: {
          id: 42,
          title: "The Hitchhiker's guide to the galaxy",
          pages: 3
        }
      },
      // Create gonna make another request to fetch the full record
      {
        json: {
          id: 42,
          title: "The Hitchhiker's guide to the galaxy",
          pages: 3,
          votes: []
        }
      }
    ]);

    const dataProvider = createDataProvider(
      "https://test.test/api",
      httpClient
    );

    expect(
      await dataProvider("CREATE", "books", {
        title: "The Hitchhiker's guide to the galaxy",
        pages: 3
      })
    ).toMatchSnapshot();
    expect(await asyncResultsToValue(httpClient)).toMatchSnapshot();
  });
});

describe("UPDATE 1", () => {
  test("UPDATE 1", async () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const httpClient: any = createJestFnSerialReturn([
      {
        json: {
          id: 42,
          title: "For Whom The Bell Tolls"
        }
      },
      {
        json: {
          id: 42,
          title: "For Whom The Bell Tolls",
          pages: [{ content: "blabla" }]
        }
      }
    ]);

    const dataProvider = createDataProvider(
      "https://test.test/api",
      httpClient
    );

    expect(
      await dataProvider("UPDATE", "books", {
        id: 42,
        data: { title: "For Whom The Bell Tolls" }
      })
    ).toMatchSnapshot();
    expect(await asyncResultsToValue(httpClient)).toMatchSnapshot();
  });
});

describe("UPDATE_MANY 1", () => {
  test("UPDATE_MANY 1", async () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const httpClient: any = createJestFnSerialReturn(
      [
        {
          id: 42,
          title: "The Hitchhiker's guide to the galaxy"
        },
        {
          id: 50,
          title: "The Hitchhiker's guide to the galaxy 2"
        },
        {
          id: 42,
          title: "The Hitchhiker's guide to the galaxy",
          pages: [{ content: "blabla" }]
        },
        {
          id: 50,
          title: "The Hitchhiker's guide to the galaxy 2",
          pages: [{ content: "blabla" }]
        }
      ].map(json => ({ json }))
    );

    const dataProvider = createDataProvider(
      "https://test.test/api",
      httpClient
    );

    expect(
      await dataProvider("UPDATE_MANY", "books", {
        ids: [42, 50],
        data: { views: 0 }
      })
    ).toMatchSnapshot();
    expect(await asyncResultsToValue(httpClient)).toMatchSnapshot();
  });
});

describe("DELETE_MANY 1", () => {
  test("DELETE_MANY 1", async () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const httpClient: any = createJestFnSerialReturn([{}, {}]);

    const dataProvider = createDataProvider(
      "https://test.test/api",
      httpClient
    );

    expect(
      await dataProvider("DELETE_MANY", "books", { ids: [42, 43] })
    ).toMatchSnapshot();
    expect(await asyncResultsToValue(httpClient)).toMatchSnapshot();
  });
});

describe("encodeParamsInResource tests", () => {
  test("encodeParamsInResource test 1", async () => {
    expect(
      encodeParamsInResource("books", {
        fields: ["id", "name", "year"],
        join: [
          {
            field: "pages",
            select: ["number", "words"]
          },
          {
            field: "author",
            select: ["id", "name"]
          },
          {
            field: "author.favoriteFood",
            select: ["id", "name"]
          }
        ]
      })
    ).toMatchSnapshot();
  });
});

describe("encoded params tests", () => {
  test("encoded params test 1", async () => {
    // @ts-ignore
    const httpClient: any = jest.fn(async (type, resource, params) => {
      return {
        json: {
          id: 1
        },
        ...params
      };
    });

    const dataProvider = createDataProvider(
      "https://test.test/api",
      httpClient
    );

    const resourceWithParams = encodeParamsInResource("books", {
      fields: ["id", "name", "year"],
      join: [
        {
          field: "pages",
          select: ["number", "words"]
        },
        {
          field: "author",
          select: ["id", "name"]
        },
        {
          field: "author.favoriteFood",
          select: ["id", "name"]
        }
      ]
    });

    expect(
      await dataProvider("GET_ONE", resourceWithParams, { id: "5" })
    ).toMatchSnapshot();
    expect(await asyncResultsToValue(httpClient)).toMatchSnapshot();
  });
});
