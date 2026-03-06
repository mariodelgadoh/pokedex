import React, { useState, useEffect } from 'react';
import { PokemonList } from './components/PokemonList';
import { PokemonGames } from './games/PokemonGames';

function App() {
  const [showGames, setShowGames] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  // Detectar scroll para mostrar/ocultar botón flotante
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Si está cerca del final (últimos 200px), ocultar botón flotante
      const isNearBottom = scrollPosition + windowHeight >= documentHeight - 200;
      setShowFloatingButton(!isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlayClick = () => {
    setShowGames(true);
  };

  return (
    <div className="min-h-screen">
      {/* Botón flotante - solo visible cuando no está cerca del final */}
      {!showGames && showFloatingButton && (
        <button
          onClick={handlePlayClick}
          className="fixed bottom-6 right-6 z-50
            bg-gradient-to-r from-yellow-400 to-yellow-500
            text-gray-900 font-bold py-3 pl-4 pr-8 rounded-full
            shadow-2xl hover:shadow-3xl
            transform hover:scale-110 transition-all
            border-4 border-red-500
            animate-bounce
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

      {/* Botón fijo al final de la página (se muestra cuando el flotante desaparece) */}
      {!showGames && !showFloatingButton && (
        <div className="w-full flex justify-center mt-4 mb-6">
          <button
            onClick={handlePlayClick}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500
              text-gray-900 font-bold py-3 px-8 rounded-full
              shadow-2xl hover:shadow-3xl
              transform hover:scale-105 transition-all
              border-4 border-red-500
              text-lg
              touch-manipulation
              flex items-center gap-2"
          >
            <img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              alt="Pikachu"
              className="w-8 h-8 object-contain drop-shadow-lg"
            />
            <span>Jugar</span>
          </button>
        </div>
      )}

      {showGames ? <PokemonGames /> : <PokemonList />}
    </div>
  );
}

export default App;