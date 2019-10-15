import unmock, { sinon, Service, transform } from "unmock";
import axios, { AxiosResponse } from "axios";
const { withCodes } = transform;

function fetchPet(id: number) {
  return axios(`http://petstore.swagger.io/v2/pet/${id}`).then(
    (res: AxiosResponse) => res.data
  );
}

describe("Using unmock with petstore", () => {
  let petstore: Service;
  beforeAll(() => {
    petstore = unmock.on().services["petstore.swagger.io"];
  });

  it("should mock the response with correct structure", async () => {
    petstore.state(withCodes(200));
    const pets = await fetchPet(34);
    sinon.assert.calledOnce(petstore.spy);
    const mockResponse = petstore.spy.getResponseBodyAsJson();
    expect(mockResponse).toMatchObject({ id: expect.any(Number) });
  });
  afterAll(() => {
    unmock.off();
  });
});
