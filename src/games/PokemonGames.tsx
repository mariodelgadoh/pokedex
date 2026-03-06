import React, { useState } from 'react';
import { GuessThePokemon } from './GuessThePokemon';
import { PokemonMemory } from './PokemonMemory';

type GameMode = 'menu' | 'guess' | 'memory';

export const PokemonGames: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('menu');

  const goToPokedex = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {gameMode === 'menu' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-center text-white mb-8 sm:mb-12 
              [text-shadow:_0_2px_0_#3B4CCA,_0_4px_4px_rgba(0,0,0,0.5)] 
              sm:[text-shadow:_0_4px_0_#3B4CCA,_0_8px_8px_rgba(0,0,0,0.5)]">
              Zona de Juegos Pokemon
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
              {/* Juego de Adivinar */}
              <div 
                onClick={() => setGameMode('guess')}
                className="bg-gradient-to-br from-blue-500 to-purple-600 
                  rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer
                  transform hover:scale-105 transition-all duration-300
                  shadow-2xl hover:shadow-3xl
                  border-4 border-yellow-400"
              >
                <div className="text-center">
                  <div className="text-5xl sm:text-7xl md:text-8xl mb-2 sm:mb-4">❓</div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    Quien es ese Pokemon
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base md:text-lg">
                    Adivina el Pokemon por su silueta
                  </p>
                  <div className="mt-3 sm:mt-4 bg-yellow-400 text-gray-900 font-bold py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base inline-block">
                    Jugar ahora
                  </div>
                </div>
              </div>

              {/* Memorama */}
              <div 
                onClick={() => setGameMode('memory')}
                className="bg-gradient-to-br from-green-500 to-emerald-600 
                  rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-pointer
                  transform hover:scale-105 transition-all duration-300
                  shadow-2xl hover:shadow-3xl
                  border-4 border-yellow-400"
              >
                <div className="text-center">
                  <div className="text-5xl sm:text-7xl md:text-8xl mb-2 sm:mb-4">🎴</div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    Memorama Pokemon
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base md:text-lg">
                    Encuentra los pares de cartas
                  </p>
                  <div className="mt-3 sm:mt-4 bg-yellow-400 text-gray-900 font-bold py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base inline-block">
                    Jugar ahora
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={goToPokedex}
                className="bg-red-500 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base
                  hover:bg-red-600 transition-all transform hover:scale-105
                  shadow-lg border-2 border-white"
              >
                Volver a la Pokedex
              </button>
            </div>
          </div>
        </div>
      )}

      {gameMode === 'guess' && (
        <div>
          <GuessThePokemon onBackToMenu={() => setGameMode('menu')} />
        </div>
      )}

      {gameMode === 'memory' && (
        <div>
          <PokemonMemory onBackToMenu={() => setGameMode('menu')} />
        </div>
      )}
    </div>
  );
};