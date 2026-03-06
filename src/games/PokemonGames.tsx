import React, { useState } from 'react';
import { GuessThePokemon } from './GuessThePokemon';
import { PokemonMemory } from './PokemonMemory';

type GameMode = 'menu' | 'guess' | 'memory';

export const PokemonGames: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('menu');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {gameMode === 'menu' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <h1 className="text-6xl font-bold text-center text-white mb-12 
              [text-shadow:_0_4px_0_#3B4CCA,_0_8px_8px_rgba(0,0,0,0.5)]">
              Zona de Juegos Pokemon
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div 
                onClick={() => setGameMode('guess')}
                className="bg-gradient-to-br from-blue-500 to-purple-600 
                  rounded-3xl p-8 cursor-pointer
                  transform hover:scale-105 transition-all duration-300
                  shadow-2xl hover:shadow-3xl
                  border-4 border-yellow-400"
              >
                <div className="text-center">
                  <div className="text-8xl mb-4">❓</div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Quien es ese Pokemon
                  </h2>
                  <p className="text-white/80 text-lg">
                    Adivina el Pokemon por su silueta
                  </p>
                  <div className="mt-4 bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full inline-block">
                    Jugar ahora
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setGameMode('memory')}
                className="bg-gradient-to-br from-green-500 to-emerald-600 
                  rounded-3xl p-8 cursor-pointer
                  transform hover:scale-105 transition-all duration-300
                  shadow-2xl hover:shadow-3xl
                  border-4 border-yellow-400"
              >
                <div className="text-center">
                  <div className="text-8xl mb-4">🎴</div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Memorama Pokemon
                  </h2>
                  <p className="text-white/80 text-lg">
                    Encuentra los pares de cartas
                  </p>
                  <div className="mt-4 bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full inline-block">
                    Jugar ahora
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-red-500 text-white font-bold py-3 px-8 rounded-full
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
        <div className="relative">
          <button
            onClick={() => setGameMode('menu')}
            className="absolute top-4 left-4 z-10
              bg-red-500 text-white font-bold py-2 px-4 rounded-full
              hover:bg-red-600 transition-all
              shadow-lg border-2 border-white"
          >
            Menu
          </button>
          <GuessThePokemon />
        </div>
      )}

      {gameMode === 'memory' && (
        <div className="relative">
          <button
            onClick={() => setGameMode('menu')}
            className="absolute top-4 left-4 z-10
              bg-red-500 text-white font-bold py-2 px-4 rounded-full
              hover:bg-red-600 transition-all
              shadow-lg border-2 border-white"
          >
            Menu
          </button>
          <PokemonMemory />
        </div>
      )}
    </div>
  );
};