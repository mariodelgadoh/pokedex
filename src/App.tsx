import React, { useState, useEffect } from 'react';
import { PokemonList } from './components/PokemonList';
import { PokemonGames } from './games/PokemonGames';

function App() {
  const [showGames, setShowGames] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Escuchar eventos personalizados para saber cuándo se abre/cierra el modal
  useEffect(() => {
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    window.addEventListener('pokemonModalOpen', handleModalOpen);
    window.addEventListener('pokemonModalClose', handleModalClose);

    return () => {
      window.removeEventListener('pokemonModalOpen', handleModalOpen);
      window.removeEventListener('pokemonModalClose', handleModalClose);
    };
  }, []);

  const handlePlayClick = () => {
    setShowGames(true);
  };

  // Mostrar el botón SOLO si:
  // 1. No estamos en juegos
  // 2. No hay un modal abierto
  const shouldShowButton = !showGames && !isModalOpen;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenido principal */}
      <div className="flex-1">
        {showGames ? <PokemonGames /> : <PokemonList />}
      </div>

      {/* Pie de página - SIN MARGEN SUPERIOR para eliminar espacio blanco */}
      {!isModalOpen && !showGames && (
        <footer className="bg-black/60 backdrop-blur-sm py-4 text-center relative z-10">
          <p className="text-white/80 text-sm sm:text-base">
            Creado por <span className="font-bold text-yellow-400">Mario Jesús Delgado Hernández</span>
          </p>
        </footer>
      )}

      {/* Botón Jugar - flotando sobre el contenido */}
      {shouldShowButton && (
        <button
          onClick={handlePlayClick}
          className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50
            bg-gradient-to-r from-yellow-400 to-yellow-500
            text-gray-900 font-bold py-2 sm:py-3 pl-3 sm:pl-4 pr-6 sm:pr-8 rounded-full
            shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl
            transform hover:scale-105 sm:hover:scale-110 transition-all
            border-2 sm:border-4 border-red-500
            text-sm sm:text-lg md:text-xl
            touch-manipulation
            flex items-center gap-1 sm:gap-2"
        >
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain drop-shadow-md sm:drop-shadow-lg"
          />
          <span>Jugar</span>
        </button>
      )}
    </div>
  );
}

export default App;