// Test basic unmock with slack
import axios from "axios";
import unmock,
{
  Service,
  transform,
  runner
} from "unmock";

const { responseBody, withCodes, withoutCodes, mapDefaultTo } = transform;

let slack: Service;
beforeAll(() => {
  slack = unmock.on().services.slack;
});
afterAll(() => {
  unmock.off();
});
beforeEach(() => {
  slack.reset();
});

const SLACK_API_URL = "https://slack.com/api";

const slackApi = {
  async channelsList() {
    const { data } = await axios.get(`${SLACK_API_URL}/channels.list`);
    return data;
  },
  async channelsInfo() {
    const { data } = await axios.get(`${SLACK_API_URL}/channels.info`);
    return data;
  },
  async channelsCreate() {
    const { data } = await axios.post(`${SLACK_API_URL}/channels.create`);
    return data;
  },
};

jest.setTimeout(10000);

test("I can list some fake channels", runner(async () => {
  slack.state(withCodes(200));
  const data = await slackApi.channelsList();
  // There are some channels indeed
  expect(data.channels.length).toBeGreaterThan(0);
  // And the channels might have members too!
  expect(
    data.channels.every(channel => channel.members.length >= 0)
  ).toBeTruthy();
}));

test("I can force an error on all responses", runner(async () => {
  slack.state(
    mapDefaultTo(200),
    withCodes(200)
  );
  const channelsList = await slackApi.channelsList();
  expect(channelsList.ok).toBeFalsy();
  expect(typeof channelsList.error).toBe("string");
  const channelsInfo = await slackApi.channelsInfo();
  expect(channelsInfo.ok).toBeFalsy();
  expect(typeof channelsInfo.error).toBe("string");
}));

test("I can set force a response for specific endpoints", runner(async () => {
  slack.state(
    mapDefaultTo(200, "/channels.list"),
    withCodes(200, "/channels.list"),
    responseBody({ path: "/channels.list", lens: ["ok"] }).const(false),
    withCodes(200, "/channels.info"),
    responseBody({ path: "/channels.info", lens: ["ok"] }).const(true)
  );
  const channelsList = await slackApi.channelsList();
  expect(channelsList.ok).toBeFalsy();
  expect(typeof channelsList.error).toBe("string");
  const channelsInfo = await slackApi.channelsInfo();
  expect(channelsInfo.ok).toBeTruthy();
}));

test("I can also set a specific method", runner(async () => {
  slack.state(
    withoutCodes("default"),
    responseBody({
      path: "/channels.create",
      method: "post",
      lens: ["ok"]
    }).const(true),
    responseBody({
      path: "/channels.create",
      method: "post",
      lens: ["channel", "name"]
    }).const("foo")
  );
  const channelsCreateResponse = await slackApi.channelsCreate();
  expect(channelsCreateResponse.ok).toBeTruthy();
  expect(channelsCreateResponse.channel.name).toEqual("foo");
}));
