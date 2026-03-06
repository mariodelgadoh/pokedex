import React, { useState, useEffect, useCallback } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon.types';

interface GuessThePokemonProps {
  onBackToMenu?: () => void;
}

// Rangos de generaciones
const generations = [
  { name: 'Kanto (1ª Gen)', start: 1, end: 151 },
  { name: 'Johto (2ª Gen)', start: 152, end: 251 },
  { name: 'Hoenn (3ª Gen)', start: 252, end: 386 },
  { name: 'Sinnoh (4ª Gen)', start: 387, end: 493 },
  { name: 'Teselia (5ª Gen)', start: 494, end: 649 },
  { name: 'Kalos (6ª Gen)', start: 650, end: 721 },
  { name: 'Alola (7ª Gen)', start: 722, end: 809 },
  { name: 'Galar (8ª Gen)', start: 810, end: 905 },
  { name: 'Paldea (9ª Gen)', start: 906, end: 1025 },
  { name: 'Todas las generaciones', start: 1, end: 1300 }
];

export const GuessThePokemon: React.FC<GuessThePokemonProps> = ({ onBackToMenu }) => {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<number>(0);
  const [showGenerationSelector, setShowGenerationSelector] = useState(true);
  const [totalPokemonCount, setTotalPokemonCount] = useState<number>(0);

  // Obtener el número total de Pokémon
  useEffect(() => {
    const getTotalCount = async () => {
      try {
        const response = await pokemonApi.getPokemonList(1, 0);
        setTotalPokemonCount(response.count);
      } catch (error) {
        console.error('Error getting total count:', error);
        setTotalPokemonCount(1300);
      }
    };
    getTotalCount();
  }, []);

  // Función para cargar nueva pregunta
  const loadNewQuestion = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    
    try {
      const gen = generations[selectedGeneration];
      const minId = gen.start;
      const maxId = gen.end;
      const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      
      const pokemon = await pokemonApi.getPokemonDetail(randomId);
      
      const wrongOptions: string[] = [];
      while (wrongOptions.length < 3) {
        const wrongId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        if (wrongId !== randomId && !wrongOptions.includes(wrongId.toString())) {
          try {
            const wrongPokemon = await pokemonApi.getPokemonDetail(wrongId);
            wrongOptions.push(wrongPokemon.name);
          } catch (error) {
            console.log(`Error loading pokemon ${wrongId}, trying another...`);
          }
        }
      }
      
      const allOptions = [pokemon.name, ...wrongOptions];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
      
      setCurrentPokemon(pokemon);
      setOptions(shuffledOptions);
    } catch (error) {
      console.error('Error loading pokemon:', error);
      loadNewQuestion();
    } finally {
      setLoading(false);
    }
  }, [selectedGeneration]);

  // Efecto para cargar nueva pregunta
  useEffect(() => {
    if (!showGenerationSelector && totalPokemonCount > 0) {
      loadNewQuestion();
    }
  }, [round, showGenerationSelector, totalPokemonCount, loadNewQuestion]);

  const handleGenerationSelect = (index: number) => {
    setSelectedGeneration(index);
    setShowGenerationSelector(false);
    setRound(1);
    setScore(0);
  };

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
    setShowGenerationSelector(true);
    setCurrentPokemon(null);
  };

  const getPokemonImage = (pokemon: Pokemon) => {
    return pokemon.sprites.other?.['official-artwork']?.front_default 
      || pokemon.sprites.front_default;
  };

  const goToPokedex = () => {
    window.location.href = '/';
  };

  const closeSelector = () => {
    setShowGenerationSelector(false);
    if (selectedGeneration === undefined) {
      setSelectedGeneration(0);
    }
  };

  if (showGenerationSelector) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/forest-bg.jpg')" }}
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full border-4 border-yellow-400 shadow-2xl relative">
            
            {/* Botón de cerrar */}
            <button
              onClick={closeSelector}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Selecciona una generación
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {generations.map((gen, index) => (
                <button
                  key={index}
                  onClick={() => handleGenerationSelect(index)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 
                    text-white font-bold py-4 px-4 rounded-xl
                    hover:from-blue-600 hover:to-purple-700
                    transition-all transform hover:scale-105 active:scale-95
                    shadow-lg border-2 border-white
                    text-base sm:text-lg
                    touch-manipulation"
                >
                  {gen.name}
                </button>
              ))}
            </div>
            <button
              onClick={goToPokedex}
              className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 
                text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg
                hover:from-red-600 hover:to-red-700
                transition-all transform hover:scale-105 active:scale-95
                shadow-lg border-2 border-white
                touch-manipulation"
            >
              Volver a la Pokédex
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-white text-lg">Cargando Pokémon...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/forest-bg.jpg')" }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-sm p-3 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          
          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg 
              [text-shadow:_2px_2px_0_#3B4CCA,_3px_3px_0_#00000030]">
              Quien es ese Pokemon
            </h1>
            <p className="text-yellow-400 font-semibold mb-2">
              {generations[selectedGeneration].name}
            </p>
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
              {/* Imagen del Pokémon */}
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

                {feedback === 'correct' && (
                  <div className="text-center mb-4">
                    <div className="bg-green-500 text-white font-bold py-2 px-6 rounded-full text-lg inline-block animate-bounce border-2 border-white">
                      ¡Correcto!
                    </div>
                  </div>
                )}

                {/* Botones de navegación - SOLO 3 BOTONES */}
                <div className="grid grid-cols-3 gap-3 mt-2 pb-2">
                  <button
                    onClick={restartGame}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 
                      text-gray-900 font-bold py-3 px-2 rounded-full text-sm sm:text-base
                      hover:from-yellow-500 hover:to-orange-600
                      transition-all transform hover:scale-105 active:scale-95
                      shadow-lg border-2 border-white
                      touch-manipulation
                      whitespace-nowrap"
                  >
                    Reiniciar
                  </button>
                  
                  {onBackToMenu && (
                    <button
                      onClick={onBackToMenu}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 
                        text-white font-bold py-3 px-2 rounded-full text-sm sm:text-base
                        hover:from-blue-600 hover:to-purple-700
                        transition-all transform hover:scale-105 active:scale-95
                        shadow-lg border-2 border-white
                        touch-manipulation
                        whitespace-nowrap"
                    >
                      Menú
                    </button>
                  )}

                  <button
                    onClick={goToPokedex}
                    className="bg-gradient-to-r from-red-500 to-red-600 
                      text-white font-bold py-3 px-2 rounded-full text-sm sm:text-base
                      hover:from-red-600 hover:to-red-700
                      transition-all transform hover:scale-105 active:scale-95
                      shadow-lg border-2 border-white
                      touch-manipulation
                      whitespace-nowrap"
                  >
                    Pokédex
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Pantalla de Game Over - CON EL MISMO DISEÑO QUE EL MEMORAMA */
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto text-center border-4 border-yellow-400 shadow-2xl">
                <h2 className="text-4xl text-yellow-400 font-bold mb-4 animate-bounce">
                  Juego Terminado
                </h2>
                
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <p className="text-white text-2xl font-bold">
                    Puntaje: {score}
                  </p>
                  <p className="text-yellow-300 text-sm mt-1">
                    {generations[selectedGeneration].name}
                  </p>
                </div>

                <p className="text-white/90 text-lg mb-6">
                  El Pokemon era: <span className="font-bold text-yellow-400 capitalize">{currentPokemon?.name}</span>
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={restartGame}
                    className="bg-gradient-to-r from-green-500 to-green-600 
                      text-white font-bold px-6 py-3 rounded-full text-base
                      hover:from-green-600 hover:to-green-700
                      transform hover:scale-105 transition-all
                      shadow-lg border-2 border-white
                      touch-manipulation
                      flex-1"
                  >
                    Jugar de nuevo
                  </button>
                  
                  {onBackToMenu && (
                    <button
                      onClick={onBackToMenu}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 
                        text-white font-bold px-6 py-3 rounded-full text-base
                        hover:from-blue-600 hover:to-blue-700
                        transform hover:scale-105 transition-all
                        shadow-lg border-2 border-white
                        touch-manipulation
                        flex-1"
                    >
                      Menú
                    </button>
                  )}

                  <button
                    onClick={goToPokedex}
                    className="bg-gradient-to-r from-red-500 to-red-600 
                      text-white font-bold px-6 py-3 rounded-full text-base
                      hover:from-red-600 hover:to-red-700
                      transform hover:scale-105 transition-all
                      shadow-lg border-2 border-white
                      touch-manipulation
                      flex-1"
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