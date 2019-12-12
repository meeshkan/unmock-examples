const CAT_FACT_URL =
  "https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1";

const CN_URL = "http://api.icndb.com/jokes/random";

export const fetchFact = async () => {
  const fetchResult = await fetch(CAT_FACT_URL, {
    method: "GET",
    mode: "cors",
  });
  if (!fetchResult.ok) {
    throw Error(`Failed fetching cat fact with code: ${fetchResult.status}`);
  }
  const body = await fetchResult.json();
  const fact = body.text;
  console.log(`Got a new fact: ${fact}`);
  return fact;
};

export const fetchJoke = async () => {
  const fetchResult = await fetch(CN_URL);
  if (!fetchResult.ok) {
    throw Error(`Failed fetching joke with code: ${fetchResult.status}`);
  }
  const body = await fetchResult.json();
  const fact = body.value.joke;
  console.log(`Got a new fact: ${fact}`);
  return fact;
};
