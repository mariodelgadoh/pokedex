import React, { useState, useEffect } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon.types';
import { PokemonTCGCard } from './components/PokemonTCGCard';

export const GuessThePokemon: React.FC = () => {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const loadNewQuestion = async () => {
    setLoading(true);
    setShowHint(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Quien es ese Pokemon
          </h2>
          <div className="flex justify-center gap-8 text-white text-xl">
            <div className="bg-blue-600 px-6 py-2 rounded-full shadow-lg">
              Puntuacion: {score}
            </div>
            <div className="bg-purple-600 px-6 py-2 rounded-full shadow-lg">
              Ronda: {round}
            </div>
          </div>
        </div>

        {!gameOver ? (
          <>
            <div className="relative mb-12">
              <div className={`
                transition-all duration-300
                ${showHint ? 'blur-0' : 'blur-md'}
                ${feedback === 'correct' ? 'animate-pulse' : ''}
              `}>
                {currentPokemon && (
                  <PokemonTCGCard 
                    pokemon={currentPokemon} 
                    size="large"
                  />
                )}
              </div>
              
              <button
                onClick={() => setShowHint(true)}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2
                  bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-full
                  shadow-lg hover:bg-yellow-500 transition-all"
                disabled={showHint}
              >
                {showHint ? 'Pista mostrada' : 'Mostrar pista'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleGuess(option)}
                  disabled={feedback !== null}
                  className={`
                    bg-white/10 backdrop-blur-sm
                    border-2 border-white/30
                    text-white font-bold py-4 px-6 rounded-xl
                    text-xl capitalize
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
              <div className="mt-6 text-center">
                <div className="bg-green-500 text-white font-bold py-3 px-6 rounded-full inline-block animate-bounce">
                  Correcto
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center bg-black/50 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-3xl text-white font-bold mb-4">Juego Terminado</h3>
            <p className="text-white text-xl mb-6">Puntuacion final: {score}</p>
            <p className="text-white/80 mb-8">
              El Pokemon era: <span className="font-bold text-yellow-400 capitalize">{currentPokemon?.name}</span>
            </p>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-red-500 to-blue-500 text-white 
                font-bold py-3 px-8 rounded-full text-xl
                hover:from-red-600 hover:to-blue-600
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