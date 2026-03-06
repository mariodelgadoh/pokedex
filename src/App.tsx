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
      {!showGames && (
        <button
          onClick={handlePlayClick}
          className="fixed bottom-4 right-4 z-50
            bg-gradient-to-r from-yellow-400 to-yellow-500
            text-gray-900 font-bold p-3 rounded-full
            shadow-2xl hover:shadow-3xl
            transform hover:scale-110 transition-all
            border-4 border-red-500
            animate-bounce
            touch-manipulation
            flex items-center justify-center
            w-14 h-14 sm:w-auto sm:h-auto sm:px-8 sm:py-3 sm:rounded-full"
        >
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain drop-shadow-lg sm:mr-2"
          />
          <span className="hidden sm:inline">Jugar</span>
        </button>
      )}

      {showGames ? <PokemonGames /> : <PokemonList />}
    </div>
  );
}

export default App;