// hello.test.js
const unmock = require("unmock-node").default;
const axios = require("axios");
const jsf = require("json-schema-faker");

console.log("type of jsf.generate", typeof jsf.generate);
beforeAll(() => {
  unmock.on();
});

test("jsf.generate type", async () => {
  expect(typeof jsf.generate).toBe("function");
});

test("hello endpoint returns correct JSON", async () => {
  const res = await axios.get("https://api.unmock.io");
  expect(Object.keys(res.data).length).toEqual(1);
  expect(res.data.hello).toBeDefined();
  expect(typeof res.data.hello === "string").toBe(true);
});
