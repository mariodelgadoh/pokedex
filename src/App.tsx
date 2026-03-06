import React, { useState } from 'react';
import { PokemonList } from './components/PokemonList';
import { PokemonGames } from './games/PokemonGames';

function App() {
  const [showGames, setShowGames] = useState(false);

  return (
    <div className="min-h-screen">
      <button
        onClick={() => setShowGames(!showGames)}
        className="fixed bottom-6 right-6 z-50
          bg-gradient-to-r from-red-500 to-blue-500
          text-white font-bold py-3 px-6 rounded-full
          shadow-2xl hover:shadow-3xl
          transform hover:scale-110 transition-all
          border-4 border-yellow-400
          animate-bounce
          text-lg"
      >
        {showGames ? 'Ver Pokedex' : 'Jugar'}
      </button>

      {showGames ? <PokemonGames /> : <PokemonList />}
    </div>
  );
}

export default App;