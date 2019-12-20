import unmock from "unmock-browser";
const dittoResponse = require("~/ditto");

const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

const useUnmock = process.env.NODE_ENV === "development";

const log = (...args: any[]) => console.log(...args);

const unmockOn = () => {
  log("Enabling unmock");
  unmock.on();
  unmock
    .nock("https://pokeapi.co")
    .get("/api/v2/pokemon/ditto")
    .reply(200, dittoResponse);
  return unmock;
};

if (useUnmock) {
  unmockOn();
}

export interface Ability {
  name: string;
}

export interface PokemonResource {
  abilities: Ability[];
  order: number;
  name: string;
  unmock?: boolean;
}

export const fetchPoke = async (): Promise<PokemonResource> => {
  const fetchResult = await fetch(`${POKE_API_URL}/ditto`);
  if (!fetchResult.ok) {
    throw Error(`Failed fetching joke with code: ${fetchResult.status}`);
  }
  const body = await fetchResult.json();
  return body;
};
