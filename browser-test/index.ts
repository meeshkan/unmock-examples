import unmock from "unmock";

const CAT_FACT_URL =
  "https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1";

const fetchFact = async () => {
  const fetchResult = await fetch(CAT_FACT_URL);
  if (!fetchResult.ok) {
    throw Error(`Failed fetching cat fact with code: ${fetchResult.status}`);
  }
  const body = await fetchResult.json();
  const fact = body.text;
  console.log(`Got a new fact: ${fact}`);
  return fact;
};

const main = async () => {
  console.log("Running main...");
  const fact = await fetchFact();
  document.querySelector(".fact").textContent = fact;
};

main();
