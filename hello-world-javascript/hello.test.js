// hello.test.js
const unmock = require("unmock-node");
const axios = require("axios");

beforeAll(() => {
  unmock.on();
});

test("hello endpoint returns correct JSON", async () => {
  const res = await axios.get("https://api.unmock.io");
  expect(Object.keys(res.data).length).toEqual(1);
  expect(res.data.hello).toBeDefined();
  expect(typeof res.data.hello === "string").toBe(true);
});
