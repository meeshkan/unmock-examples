// Test basic unmock with slack
import axios from "axios";
import unmock from "unmock-node";

beforeAll(() => {
  unmock.on();
});
afterAll(() => unmock.off());
beforeEach(() => unmock.states().reset());

test("I can list some fake channels", async () => {
  // Flaky mode!
  const { data } = await axios.get("https://slack.com/api/channels.list");
  expect(data.ok).toBeDefined();
  if (data.ok === false) {
    expect(data.error).toBeDefined();
    expect(typeof data.error).toBe("string");
  } else {
    // There are some channels indeed
    expect(data.channels.length).toBeGreaterThan(0);
    // And the channels might have members too!
    expect(
      data.channels.every(channel => channel.members.length >= 0)
    ).toBeTruthy();
  }
});

test("I can force an error on all responses", async () => {
  unmock.states().slack({ ok: false });
  const { data } = await axios.get("https://slack.com/api/channels.list");
  expect(data.ok).toBeFalsy();
  expect(typeof data.error).toBe("string");
  const response = await axios.get("https://slack.com/api/channels.info");
  expect(response.data.ok).toBeFalsy();
  expect(typeof response.data.error).toBe("string");
});

test("I can set force a response for specific endpoints", async () => {
  unmock
    .states()
    .slack("/channels.list", { ok: false })
    .slack("/channels.info", { ok: true });
  const { data } = await axios.get("https://slack.com/api/channels.list");
  expect(data.ok).toBeFalsy();
  expect(typeof data.error).toBe("string");
  const response = await axios.get("https://slack.com/api/channels.info");
  expect(response.data.ok).toBeTruthy();
});

test("I can also set a specific method", async () => {
  unmock
    .states()
    .slack.post("/channels.create", { ok: true, channel: { name: "foo" } }); // will throw if we try e.g. `slack.get("/channels.create" ...)`
  const { data } = await axios.post("https://slack.com/api/channels.create");
  expect(data.ok).toBeTruthy();
  expect(data.channel.name).toEqual("foo");
});
