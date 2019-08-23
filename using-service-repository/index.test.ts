import unmock, { sinon, Service, RequestResponseSpy } from "unmock-node";
import axios, { AxiosResponse } from "axios";

function fetchPets() {
  return axios("http://petstore.swagger.io/v1/pets").then(
    (res: AxiosResponse) => res.data
  );
}

describe("Using unmock with petstore", () => {
  let petstore: Service;
  let petstoreSpy: RequestResponseSpy;
  beforeAll(() => {
    petstore = unmock.on().services.petstore;
    petstoreSpy = petstore.spy;
  });

  it("should mock the response with correct structure", async () => {
    const pets = await fetchPets();
    sinon.assert.calledOnce(petstore.spy);
    const mockResponse = petstoreSpy.firstCall.returnValue;
    expect(pets).toHaveLength(JSON.parse(mockResponse.body).length);
  });
  afterAll(() => {
    unmock.off();
  });
});
