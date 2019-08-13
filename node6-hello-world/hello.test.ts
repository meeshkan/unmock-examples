const unmock = require("unmock-node").default;
const axios = require("axios");

beforeAll(() => {
  unmock.on();
});

test("hello endpoint returns correct JSON", async done => {
  const entries = Object.entries({ a: 1 });
  axios.get("https://api.unmock.io").then(() => done());
});
