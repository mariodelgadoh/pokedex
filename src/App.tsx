import React, { useState } from 'react';
import { PokemonList } from './components/PokemonList';
import { PokemonGames } from './games/PokemonGames';

function App() {
  const [showGames, setShowGames] = useState(false);

  const handlePlayClick = () => {
    setShowGames(true);
  };

  return (
    <div className="min-h-screen">
      {/* Botón Jugar fijo en la esquina inferior derecha - más pequeño */}
      {!showGames && (
        <button
          onClick={handlePlayClick}
          className="fixed bottom-3 right-3 z-50
            bg-gradient-to-r from-yellow-400 to-yellow-500
            text-gray-900 font-bold py-1.5 pl-2.5 pr-5 rounded-full
            shadow-md hover:shadow-lg
            transform hover:scale-105 transition-all
            border border-red-500
            text-xs sm:text-sm
            touch-manipulation
            flex items-center gap-1"
        >
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain drop-shadow-sm"
          />
          <span>Jugar</span>
        </button>
      )}

      {showGames ? <PokemonGames /> : <PokemonList />}
    </div>
  );
}

export default App;