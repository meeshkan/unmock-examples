// hello.test.js
const unmock = require("unmock-node").default;
const {
  sinon: { assert, match },
} = require("unmock-node");
const axios = require("axios");

function fetchData() {
  return axios.get("https://api.unmock.io").then(res => res.data);
}

describe("hello endpoint", () => {
  let helloService;

  beforeAll(() => {
    helloService = unmock.on().services.hello;
  });

  beforeEach(() => {
    helloService.reset();
  });

  test("should return valid JSON", async () => {
    const responseBody = await fetchData();
    expect(Object.keys(responseBody).length).toEqual(1);
    expect(responseBody.hello).toBeDefined();
    expect(typeof responseBody.hello === "string").toBe(true);
  });

  test("should return given string for endpoint when setting state", async () => {
    helloService.state({ hello: "world" });
    const responseBody = await fetchData();
    expect(responseBody).toEqual({ hello: "world" });
  });

  test("should have made correct request", async () => {
    await fetchData();
    assert.calledOnce(helloService.spy);
    assert.calledWith(helloService.spy, match({ method: "GET", path: "/" }));
  });

  test("should have delivered expected response", async () => {
    const responseBody = await fetchData();
    const firstCallReturnValue = helloService.spy.firstCall.returnValue;
    expect(responseBody.hello).toEqual(
      JSON.parse(firstCallReturnValue.body).hello
    );
  });
});
