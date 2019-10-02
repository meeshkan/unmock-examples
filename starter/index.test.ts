import unmock, { Service, u, runner, transform } from "unmock";
import axios from "axios";
const { withCodes, withoutCodes } = transform;

const getHoroscope = async (user: string) => {
  try {
    const { data } = await axios("https://zodiac.com/horoscope/" + user);
    return `Here's your horoscope, ${data.user} of the Great and Mighty sign ${data.sign}. ${data.horoscope}.`;
  } catch (e) {
    return `Sorry, your stars are not aligned today :-(`;
  }
};

unmock
  .nock("https://zodiac.com", "zodiac")
  .get("/horoscope/{user}")
  .reply(200, {
    id: u.integer(),
    name: u.string("name.firstName"),
    sign: u.string(),
    ascendant: u.string(),
    type: "horoscope",
  })
  .get("/horoscope/{user}")
  .reply(404, { message: "Not authorized." });

let zodiac: Service;

beforeAll(() => {
  zodiac = unmock.on().services.zodiac;
});

beforeEach(() => zodiac.reset());

afterEach(() => zodiac.spy.resetHistory());

test(
  "call to the horoscope service uses the username",
  runner(async () => {
    zodiac.state(withCodes(200));
    await getHoroscope("jane");
    const requestPath = zodiac.spy.getRequestPath();
    expect(requestPath).toBe(`/horoscope/jane`);
  })
);

test(
  "horoscope does not result in unexpected error when resposne is 200",
  runner(async () => {
    zodiac.state(withCodes(200));
    const horoscope = await getHoroscope("jane");
    const responseBody = zodiac.spy.getResponseBodyAsJson();
    expect(horoscope).toBe(
      `Here's your horoscope, ${responseBody.user} of the Great and Mighty sign ${responseBody.sign}. ${responseBody.horoscope}.`
    );
  })
);

test(
  "when the response is not 200, the only outcome is an error",
  runner(async () => {
    zodiac.state(withoutCodes(200));
    const horoscope = await getHoroscope("jane");
    if (zodiac.spy.getResponseCode() !== 200) {
      expect(horoscope).toBe(`Sorry, your stars are not aligned today :-(`);
    }
  })
);
