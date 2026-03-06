import React, { useState, useEffect } from 'react';
import { GuessThePokemon } from './GuessThePokemon';
import { PokemonMemory } from './PokemonMemory';
import { pokemonApi } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon.types';

type GameMode = 'menu' | 'guess' | 'memory';

export const PokemonGames: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [randomPokemon1, setRandomPokemon1] = useState<Pokemon | null>(null);
  const [randomPokemon2, setRandomPokemon2] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRandomPokemon();
  }, []);

  const loadRandomPokemon = async () => {
    setLoading(true);
    try {
      // Cargar dos Pokémon aleatorios diferentes
      const id1 = Math.floor(Math.random() * 151) + 1;
      let id2 = Math.floor(Math.random() * 151) + 1;
      
      // Asegurar que sean diferentes
      while (id2 === id1) {
        id2 = Math.floor(Math.random() * 151) + 1;
      }
      
      const pokemon1 = await pokemonApi.getPokemonDetail(id1);
      const pokemon2 = await pokemonApi.getPokemonDetail(id2);
      
      setRandomPokemon1(pokemon1);
      setRandomPokemon2(pokemon2);
    } catch (error) {
      console.error('Error loading random pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPokemonImage = (pokemon: Pokemon | null) => {
    if (!pokemon) return '';
    return pokemon.sprites.other?.['official-artwork']?.front_default 
      || pokemon.sprites.front_default;
  };

  const goToPokedex = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/forest-bg.jpg')" }}
    >
      {/* Capa semitransparente para mejorar legibilidad */}
      <div className="min-h-screen bg-black/40 backdrop-blur-sm p-3 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          
          {gameMode === 'menu' && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-4xl w-full">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-center text-white mb-8 sm:mb-12 
                  [text-shadow:_2px_2px_0_#3B4CCA,_4px_4px_0_#00000050]">
                  Zona de Juegos Pokemon
                </h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 px-2 sm:px-0">
                  {/* Juego de Adivinar */}
                  <div 
                    onClick={() => setGameMode('guess')}
                    className="bg-white/20 backdrop-blur-md 
                      rounded-3xl p-6 sm:p-8 cursor-pointer
                      transform hover:scale-105 transition-all duration-300
                      shadow-2xl hover:shadow-3xl
                      border-4 border-yellow-400
                      flex flex-col items-center"
                  >
                    <div className="w-32 h-32 sm:w-40 sm:h-40 mb-4 
                      bg-white/30 rounded-full p-2 flex items-center justify-center
                      border-4 border-yellow-400">
                      {randomPokemon1 && (
                        <img 
                          src={getPokemonImage(randomPokemon1)} 
                          alt="Random Pokemon"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                      Quien es ese Pokemon
                    </h2>
                    <p className="text-white/80 text-sm sm:text-base md:text-lg text-center mb-4">
                      Adivina el Pokemon por su imagen
                    </p>
                    <div className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full text-sm sm:text-base inline-block">
                      Jugar ahora
                    </div>
                  </div>

                  {/* Memorama */}
                  <div 
                    onClick={() => setGameMode('memory')}
                    className="bg-white/20 backdrop-blur-md 
                      rounded-3xl p-6 sm:p-8 cursor-pointer
                      transform hover:scale-105 transition-all duration-300
                      shadow-2xl hover:shadow-3xl
                      border-4 border-yellow-400
                      flex flex-col items-center"
                  >
                    <div className="w-32 h-32 sm:w-40 sm:h-40 mb-4 
                      bg-white/30 rounded-full p-2 flex items-center justify-center
                      border-4 border-yellow-400">
                      {randomPokemon2 && (
                        <img 
                          src={getPokemonImage(randomPokemon2)} 
                          alt="Random Pokemon"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                      Memorama Pokemon
                    </h2>
                    <p className="text-white/80 text-sm sm:text-base md:text-lg text-center mb-4">
                      Encuentra los pares de cartas
                    </p>
                    <div className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full text-sm sm:text-base inline-block">
                      Jugar ahora
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8 sm:mt-10">
                  <button
                    onClick={goToPokedex}
                    className="bg-gradient-to-r from-red-500 to-red-600 
                      text-white font-bold py-3 px-8 rounded-full text-base sm:text-lg
                      hover:from-red-600 hover:to-red-700
                      transition-all transform hover:scale-105 active:scale-95
                      shadow-lg border-2 border-white w-full sm:w-auto min-w-[200px]
                      touch-manipulation"
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
      </div>
    </div>
  );
};