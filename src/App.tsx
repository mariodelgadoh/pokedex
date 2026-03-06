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
      {/* Botón Jugar con z-index más bajo que el modal */}
      {!showGames && (
        <button
          onClick={handlePlayClick}
          className="fixed bottom-6 right-6 z-40
            bg-gradient-to-r from-yellow-400 to-yellow-500
            text-gray-900 font-bold py-3 pl-4 pr-8 rounded-full
            shadow-2xl hover:shadow-3xl
            transform hover:scale-110 transition-all
            border-4 border-red-500
            text-lg sm:text-xl
            touch-manipulation
            flex items-center gap-2"
        >
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-lg"
          />
          <span>Jugar</span>
        </button>
      )}

      {showGames ? <PokemonGames /> : <PokemonList />}
    </div>
  );
}

export default App;