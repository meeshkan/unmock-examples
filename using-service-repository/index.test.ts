import unmock from "unmock-node";
import axios from "axios";

describe("Petstore", () => {
  beforeAll(() => {
    unmock.on();
  });

  it("uses petstore", async () => {
    const response = await axios("http://petstore.swagger.io/v1/pets");
    expect(response.data).toBeDefined();
  });
  afterAll(() => {
    unmock.off();
  });
});
