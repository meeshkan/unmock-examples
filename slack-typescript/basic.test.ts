// Test basic unmock with slack
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

describe("Using unmock without state", () => {
  test("returns data from schema", async () => {
    const data = await slackApi.channelsList();
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
});

describe("Using unmock with state", () => {
  test("I can force an error on all responses", async () => {
    slack.state({ ok: false });
    const channelsList = await slackApi.channelsList();
    expect(channelsList.ok).toBeFalsy();
    expect(typeof channelsList.error).toBe("string");
    const channelsInfo = await slackApi.channelsInfo();
    expect(channelsInfo.ok).toBeFalsy();
    expect(typeof channelsInfo.error).toBe("string");
  });

  test("I can set force a response for specific endpoints", async () => {
    slack.state("/channels.list", { ok: false });
    slack.state("/channels.info", { ok: true });
    const channelsList = await slackApi.channelsList();
    expect(channelsList.ok).toBeFalsy();
    expect(typeof channelsList.error).toBe("string");
    const channelsInfo = await slackApi.channelsInfo();
    expect(channelsInfo.ok).toBeTruthy();
  });

  test("I can also set a specific method", async () => {
    slack.state.post("/channels.create", {
      ok: true,
      channel: { name: "foo" },
    }); // will throw if we try e.g. `slack.get("/channels.create" ...)`
    const channelsCreateResponse = await slackApi.channelsCreate();
    expect(channelsCreateResponse.ok).toBeTruthy();
    expect(channelsCreateResponse.channel.name).not.toEqual("foo");
  });
});
