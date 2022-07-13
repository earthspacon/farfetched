import {
  createJsonQuery,
  declareParams,
  unkownContract,
} from '@farfetched/core';
import { StrictMode, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { useUnit } from 'effector-react';

const pokemonsQuery = createJsonQuery({
  params: declareParams<{ limit: number }>(),
  request: {
    method: 'GET',
    url: 'https://pokeapi.co/api/v2/pokemon',
    query: (params) => ({ limit: params.limit.toString() }),
  },
  response: {
    contract: unkownContract,
    mapData: (data: any) => data.results as Array<{ name: string }>,
  },
});

export function App() {
  const [pokemons, loading] = useUnit([
    pokemonsQuery.$data,
    pokemonsQuery.$pending,
  ]);

  const [limit, setLimit] = useState(10);

  return (
    <>
      <h1>Pokemon 💙 Farfetched</h1>
      <label>
        Limit:
        <input
          min={1}
          value={limit}
          type="number"
          onChange={(e) => setLimit(e.target.valueAsNumber)}
        />
      </label>
      <button onClick={() => pokemonsQuery.start({ limit })}>
        Load pokemons
      </button>
      {loading && <p>Loading...</p>}
      {pokemons && (
        <ol>
          {pokemons.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ol>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
