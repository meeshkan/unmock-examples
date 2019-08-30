// Test unmock DSL with slack
import axios from "axios";
import unmock, { Service } from "unmock";

let slack: Service;

beforeAll(() => {
  slack = unmock.on().services.slack;
});

afterAll(() => {
  unmock.off();
});
beforeEach(() => {
  slack.state.reset();
});

const postMessage = (message: string) =>
  axios.post("https://slack.com/api/chat.postMessage", {
    data: { channel: "my_channel_id", text: message },
  });

test("I can enforce a response code", async () => {
  slack.state({ $code: 200 }); // All responses are 200 in `slack`, but this enforces a success operation (ok = true)
  const resp = await postMessage("foo");
  expect(resp.status).toBe(200);
  expect(resp.data.ok).toBeTruthy();
});

test("I can also force specific response for N times", async () => {
  // sync the response and request
  const text = "foo";
  slack.state.post("/chat.postMessage", { message: { text }, $times: 3 });
  // We set the message, which only exists with vallid response (ok = true), so it's implicitly set
  let resp = await postMessage(text);
  expect(resp.data.message.text).toEqual(text);

  resp = await postMessage(text);
  expect(resp.data.message.text).toEqual(text);

  resp = await postMessage(text);
  expect(resp.data.message.text).toEqual(text);

  resp = await postMessage(text);
  if (resp.data.ok) {
    // back in flaky mode!
    expect(resp.data.message.text).not.toEqual(text);
  } else {
    expect(resp.data.error).toBeDefined();
  }
});

test("I can determine how many users are in my channel", async () => {
  const nUsers = 23;
  slack.state.get("/channels.list", {
    channels: { members: { $size: nUsers } },
    $times: 2,
  });

  let resp = await axios.get("https://slack.com/api/channels.list");
  expect(
    resp.data.channels.every(channel => channel.members.length === 23)
  ).toBeTruthy();

  resp = await axios.get("https://slack.com/api/channels.list");
  expect(
    resp.data.channels.every(channel => channel.members.length === 23)
  ).toBeTruthy();

  resp = await axios.get("https://slack.com/api/channels.list");
  // back in flaky mode
  if (resp.data.ok) {
    expect(
      resp.data.channels.every(channel => channel.members.length === 23)
    ).toBeFalsy();
  }
});
