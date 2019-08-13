const axios = require("axios");
const unmock = require("unmock-node");

export const entries = Object.entries({ a: 1 });
Promise.resolve();

(async () => {
  await axios.get("https://api.unmock.io");
})();
