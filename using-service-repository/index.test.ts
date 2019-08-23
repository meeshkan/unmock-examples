import unmock, { sinon, Service } from "unmock-node";
import axios, { AxiosResponse } from "axios";

function fetchPets() {
  return axios("http://petstore.swagger.io/v1/pets").then(
    (res: AxiosResponse) => res.data
  );
}

describe("Petstore", () => {
  let petstore: Service;
  beforeAll(() => {
    petstore = unmock.on().services.petstore;
  });

  it("uses petstore", async () => {
    const pets = await fetchPets();
    sinon.assert.calledOnce(petstore.spy);
    const mockResponse = petstore.spy.firstCall.returnValue;
    expect(pets).toHaveLength(JSON.parse(mockResponse.body).length);
  });
  afterAll(() => {
    unmock.off();
  });
});
