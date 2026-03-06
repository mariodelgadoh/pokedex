import React, { useState, useEffect } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon.types';

interface GuessThePokemonProps {
  onBackToMenu?: () => void;
}

export const GuessThePokemon: React.FC<GuessThePokemonProps> = ({ onBackToMenu }) => {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [loading, setLoading] = useState(true);

  const loadNewQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    
    try {
      const randomId = Math.floor(Math.random() * 151) + 1;
      const pokemon = await pokemonApi.getPokemonDetail(randomId);
      
      const wrongOptions: string[] = [];
      while (wrongOptions.length < 3) {
        const wrongId = Math.floor(Math.random() * 151) + 1;
        if (wrongId !== randomId && !wrongOptions.includes(wrongId.toString())) {
          const wrongPokemon = await pokemonApi.getPokemonDetail(wrongId);
          wrongOptions.push(wrongPokemon.name);
        }
      }
      
      const allOptions = [pokemon.name, ...wrongOptions];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
      
      setCurrentPokemon(pokemon);
      setOptions(shuffledOptions);
    } catch (error) {
      console.error('Error loading pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewQuestion();
  }, [round]);

  const handleGuess = (guess: string) => {
    if (!currentPokemon || feedback) return;
    
    if (guess === currentPokemon.name) {
      setFeedback('correct');
      setScore(score + 1);
      setTimeout(() => {
        setRound(round + 1);
      }, 1500);
    } else {
      setFeedback('wrong');
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setRound(1);
    setGameOver(false);
    setFeedback(null);
    loadNewQuestion();
  };

  const getPokemonImage = (pokemon: Pokemon) => {
    return pokemon.sprites.other?.['official-artwork']?.front_default 
      || pokemon.sprites.front_default;
  };

  const goToPokedex = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
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
          
          {/* Header - Título y contadores */}
          <div className="text-center mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg 
              [text-shadow:_2px_2px_0_#3B4CCA,_3px_3px_0_#00000030]">
              Quien es ese Pokemon
            </h1>
            <div className="flex flex-row justify-center gap-4 text-white mt-2">
              <div className="bg-blue-600 px-5 py-1.5 rounded-full shadow-lg text-lg font-bold border-2 border-white">
                Puntaje: {score}
              </div>
              <div className="bg-purple-600 px-5 py-1.5 rounded-full shadow-lg text-lg font-bold border-2 border-white">
                Ronda: {round}
              </div>
            </div>
          </div>

          {!gameOver ? (
            <>
              {/* Imagen del Pokémon - Área principal */}
              <div className="flex-1 flex items-center justify-center my-2">
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 
                  bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center
                  border-4 border-yellow-400 shadow-2xl">
                  <img 
                    src={currentPokemon ? getPokemonImage(currentPokemon) : ''} 
                    alt="Pokemon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Botones de opciones */}
              <div className="mt-auto pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleGuess(option)}
                      disabled={feedback !== null}
                      className={`
                        bg-white/20 backdrop-blur-md
                        border-2 border-yellow-400
                        text-white font-bold py-3 px-4 rounded-xl
                        text-base sm:text-lg capitalize
                        transition-all duration-300
                        hover:bg-white/30 hover:scale-105
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-lg
                        ${feedback === 'correct' && option === currentPokemon?.name 
                          ? 'bg-green-500/70 border-green-400 animate-bounce' 
                          : ''}
                        touch-manipulation
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Feedback de correcto */}
                {feedback === 'correct' && (
                  <div className="text-center mb-4">
                    <div className="bg-green-500 text-white font-bold py-2 px-6 rounded-full text-lg inline-block animate-bounce border-2 border-white">
                      ¡Correcto!
                    </div>
                  </div>
                )}

                {/* Botones de navegación - Reiniciar, Menú y Pokédex */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2 pb-2">
                  <button
                    onClick={restartGame}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 
                      text-gray-900 font-bold py-3 px-6 rounded-full text-base sm:text-lg
                      hover:from-yellow-500 hover:to-orange-600
                      transition-all transform hover:scale-105 active:scale-95
                      shadow-lg border-2 border-white w-full sm:w-36
                      touch-manipulation"
                  >
                    Reiniciar
                  </button>
                  
                  {onBackToMenu && (
                    <button
                      onClick={onBackToMenu}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 
                        text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg
                        hover:from-blue-600 hover:to-purple-700
                        transition-all transform hover:scale-105 active:scale-95
                        shadow-lg border-2 border-white w-full sm:w-36
                        touch-manipulation"
                    >
                      Menú
                    </button>
                  )}

                  <button
                    onClick={goToPokedex}
                    className="bg-gradient-to-r from-red-500 to-red-600 
                      text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg
                      hover:from-red-600 hover:to-red-700
                      transition-all transform hover:scale-105 active:scale-95
                      shadow-lg border-2 border-white w-full sm:w-36
                      touch-manipulation"
                  >
                    Pokédex
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Pantalla de Game Over */
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto text-center border-4 border-yellow-400">
                <h2 className="text-3xl text-yellow-400 font-bold mb-3">
                  Juego Terminado
                </h2>
                <p className="text-white text-xl mb-2">
                  Puntaje final: {score}
                </p>
                <p className="text-white/90 text-lg mb-6">
                  El Pokemon era: <span className="font-bold text-yellow-400 capitalize">{currentPokemon?.name}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={restartGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 
                      text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg
                      hover:from-green-600 hover:to-emerald-600
                      transform hover:scale-105 active:scale-95 transition-all
                      shadow-lg border-2 border-white w-full sm:w-36"
                  >
                    Jugar de nuevo
                  </button>
                  {onBackToMenu && (
                    <button
                      onClick={onBackToMenu}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 
                        text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg
                        hover:from-blue-600 hover:to-purple-700
                        transform hover:scale-105 active:scale-95 transition-all
                        shadow-lg border-2 border-white w-full sm:w-36"
                    >
                      Menú
                    </button>
                  )}
                  <button
                    onClick={goToPokedex}
                    className="bg-gradient-to-r from-red-500 to-red-600 
                      text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg
                      hover:from-red-600 hover:to-red-700
                      transform hover:scale-105 active:scale-95 transition-all
                      shadow-lg border-2 border-white w-full sm:w-36"
                  >
                    Pokédex
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};