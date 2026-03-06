import React, { useState, useEffect } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon.types';

export const GuessThePokemon: React.FC = () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-3 sm:p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Quien es ese Pokemon
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 md:gap-8 text-white text-sm sm:text-base md:text-xl">
            <div className="bg-blue-600 px-4 sm:px-6 py-1 sm:py-2 rounded-full shadow-lg">
              Puntuacion: {score}
            </div>
            <div className="bg-purple-600 px-4 sm:px-6 py-1 sm:py-2 rounded-full shadow-lg">
              Ronda: {round}
            </div>
          </div>
        </div>

        {!gameOver ? (
          <>
            <div className="flex justify-center mb-6 sm:mb-8 md:mb-12 px-2">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 
                bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
                <img 
                  src={currentPokemon ? getPokemonImage(currentPokemon) : ''} 
                  alt="Pokemon silhouette"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8 px-2 sm:px-0">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleGuess(option)}
                  disabled={feedback !== null}
                  className={`
                    bg-white/10 backdrop-blur-sm
                    border-2 border-white/30
                    text-white font-bold py-3 sm:py-4 px-3 sm:px-4 rounded-lg sm:rounded-xl
                    text-base sm:text-lg md:text-xl capitalize
                    transition-all duration-300
                    hover:bg-white/20 hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${feedback === 'correct' && option === currentPokemon?.name 
                      ? 'bg-green-500 border-green-400 animate-bounce' 
                      : ''}
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback === 'correct' && (
              <div className="mt-4 sm:mt-6 text-center">
                <div className="bg-green-500 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base inline-block animate-bounce">
                  Correcto
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center bg-black/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mx-2 sm:mx-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-2 sm:mb-4">Juego Terminado</h3>
            <p className="text-white text-base sm:text-lg md:text-xl mb-3 sm:mb-4">Puntuacion final: {score}</p>
            <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8">
              El Pokemon era: <span className="font-bold text-yellow-400 capitalize">{currentPokemon?.name}</span>
            </p>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                font-bold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full text-sm sm:text-base md:text-xl
                hover:from-blue-600 hover:to-purple-700
                transform hover:scale-105 transition-all
                shadow-lg"
            >
              Jugar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};