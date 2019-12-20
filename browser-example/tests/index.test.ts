import unmock, { Service, u, runner, transform } from "unmock";
const { withCodes } = transform;

const getHoroscope = async (user: string) => {
  try {
    const fetchRes = await fetch("https://zodiac.com/horoscope/" + user);
    const data = await fetchRes.json();
    return `Here's your horoscope, ${data.user} of the Great and Mighty sign ${data.sign}. ${data.horoscope}.`;
  } catch (e) {
    throw e;
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

it(
  "call to the horoscope service uses the username",
  runner(async () => {
    zodiac.state(withCodes(200));
    const result = await getHoroscope("jane");
    expect(result).toMatch(/your horoscope/);
    const requestPath = zodiac.spy.getRequestPath();
    expect(requestPath).toBe(`/horoscope/jane`);
  })
);
