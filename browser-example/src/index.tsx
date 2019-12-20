import { fetchPoke, PokemonResource } from "~/api";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "~/pokemon.scss";

const Pokemon = ({ resource }: { resource: PokemonResource }) => {
  return (
    <div className="pokemon">
      <p className="pokemon_name">Name: {resource.name}</p>
      <p className="pokemon_order">Order: {resource.order}</p>
      <textarea
        className="pokemon-resource"
        readOnly
        style={{ width: "100%" }}
        rows={10}
        value={JSON.stringify(resource)}
      />
    </div>
  );
};

const SetPokemon = () => {
  const [pokemonResource, setPokemonResourceState] = React.useState(
    null as PokemonResource | null
  );
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null as Error | null);

  const setPokemonResource = async () => {
    try {
      setLoading(true);
      const resource = await fetchPoke();
      setPokemonResourceState(resource);
      setErr(null);
    } catch (err) {
      setPokemonResourceState(null);
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setPokemonResource();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : err ? (
        <p>{err}</p>
      ) : pokemonResource ? (
        <Pokemon resource={pokemonResource} />
      ) : null}
    </div>
  );
};

ReactDOM.render(<SetPokemon />, document.getElementById("root"));
