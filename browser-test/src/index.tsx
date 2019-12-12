import { fetchFact, fetchJoke } from "./facts";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

/* const main = async () => {
  console.log("Running main...");
  const fact = await fetchFact();
  document.querySelector(".fact").textContent = fact;
};

main(); */

console.log("Hello from tsx!");

const Hello = () => {
  const [fact, setFact] = useState(null as string | null);

  const setNewFact = async () => {
    const fact = await fetchJoke();
    setFact(fact);
  };

  useEffect(() => {
    setNewFact();
  }, []);

  return <div>{fact ? <p>{fact}</p> : <p>Loading...</p>}</div>;
};

ReactDOM.render(<Hello />, document.getElementById("root"));
