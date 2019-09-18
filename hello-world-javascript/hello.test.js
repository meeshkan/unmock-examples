// hello.test.js
const {
  default: unmock,
  sinon: { assert, match },
  transform,
  u
} = require("unmock");

const axios = require("axios");

function fetchDataFromService() {
  return axios.get("https://api.unmock.io").then(res => res.data);
}

unmock
  .nock("https://api.unmock.io", "hello")
  .get("/")
  .reply(200, { hello: u.string() });

describe("hello endpoint", () => {
  let helloService;

  beforeAll(() => {
    helloService = unmock.on().services.hello;
  });

  afterAll(() => {
    unmock.off();
  });

  beforeEach(() => {
    helloService.reset();
  });

  test("should return valid JSON", async () => {
    const responseBody = await fetchDataFromService();
    expect(Object.keys(responseBody).length).toEqual(1);
    expect(responseBody.hello).toBeDefined();
    expect(typeof responseBody.hello === "string").toBe(true);
  });

  test("should return given string for endpoint when setting state", async () => {
    helloService.state(transform.responseBody().const({ hello: "world" }));
    const responseBody = await fetchDataFromService();
    expect(responseBody).toEqual({ hello: "world" });
  });

  test("should have made correct request", async () => {
    await fetchDataFromService();
    assert.calledOnce(helloService.spy);
    assert.calledWith(helloService.spy, match({ method: "get", path: "/" }));
  });

  test("should have handled response correctly", async () => {
    const responseBody = await fetchDataFromService();
    const unmockResponseBody = helloService.spy.getResponseBody();
    expect(responseBody.hello).toEqual(JSON.parse(unmockResponseBody).hello);
  });
});
