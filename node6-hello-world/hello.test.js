// hello.test.js
const unmock = require("unmock-node").default;
const axios = require("axios");

beforeAll(() => {
  unmock.on();
});

test("hello endpoint returns correct JSON", done => {
  axios.get("https://api.unmock.io").then(() => done());
});
