import { fetchJoke } from "~/facts";
import * as React from "react";
import * as ReactDOM from "react-dom";

console.log("Hello from tsx!");

const Hello = () => {
  const [fact, setFact] = React.useState(null as string | null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null as Error | null);

  const setNewFact = async () => {
    try {
      setLoading(true);
      const fact = await fetchJoke();
      setFact(fact);
      setErr(null);
    } catch (err) {
      setFact(null);
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setNewFact();
  }, []);

  return <div>
    {loading ?
      <p>Loading...</p>
    : err ?
      <p>{err}</p>
    :
     <p>{fact}</p>}</div>;
};

ReactDOM.render(<Hello />, document.getElementById("root"));
