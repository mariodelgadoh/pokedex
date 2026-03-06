import React, { useState, useEffect, useCallback } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon.types';

interface Card {
  id: string;
  pokemonId: number;
  pokemonName: string;
  pokemonImage: string;
  matched: boolean;
  flipped: boolean;
}

interface PokemonMemoryProps {
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

export const PokemonMemory: React.FC<PokemonMemoryProps> = ({ onBackToMenu }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [secondCard, setSecondCard] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<number>(0);
  const [showGenerationSelector, setShowGenerationSelector] = useState(true);

  // Función para inicializar el juego con la generación seleccionada
  const initializeGame = useCallback(async () => {
    setLoading(true);
    try {
      const gen = generations[selectedGeneration];
      const minId = gen.start;
      const maxId = gen.end;
      
      const pokemonList: Pokemon[] = [];
      const usedIds = new Set();
      
      while (pokemonList.length < 6) {
        const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
        if (!usedIds.has(randomId)) {
          usedIds.add(randomId);
          try {
            const pokemon = await pokemonApi.getPokemonDetail(randomId);
            pokemonList.push(pokemon);
          } catch (error) {
            console.log(`Error loading pokemon ${randomId}, trying another...`);
          }
        }
      }

      const cardPairs: Card[] = [];
      pokemonList.forEach((pokemon) => {
        const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default 
          || pokemon.sprites.front_default;
          
        cardPairs.push({
          id: `${pokemon.id}-a`,
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonImage: imageUrl,
          matched: false,
          flipped: false
        });
        cardPairs.push({
          id: `${pokemon.id}-b`,
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonImage: imageUrl,
          matched: false,
          flipped: false
        });
      });

      const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setMoves(0);
      setMatches(0);
      setGameComplete(false);
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGeneration]);

  // Efecto para inicializar juego cuando se selecciona una generación
  useEffect(() => {
    if (!showGenerationSelector) {
      initializeGame();
    }
  }, [showGenerationSelector, initializeGame]);

  const handleGenerationSelect = (index: number) => {
    setSelectedGeneration(index);
    setShowGenerationSelector(false);
  };

  const handleCardClick = (clickedCard: Card) => {
    if (disabled || clickedCard.matched || clickedCard.flipped) return;

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, flipped: true } : card
    );
    setCards(newCards);

    if (!firstCard) {
      setFirstCard(clickedCard);
    } else if (!secondCard && firstCard.id !== clickedCard.id) {
      setSecondCard(clickedCard);
      setDisabled(true);
      setMoves(moves + 1);

      if (firstCard.pokemonId === clickedCard.pokemonId) {
        setTimeout(() => {
          const matchedCards = cards.map(card =>
            card.pokemonId === firstCard.pokemonId
              ? { ...card, matched: true, flipped: true }
              : card
          );
          setCards(matchedCards);
          setMatches(matches + 1);
          setFirstCard(null);
          setSecondCard(null);
          setDisabled(false);

          if (matches + 1 === 6) {
            setGameComplete(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = cards.map(card =>
            card.id === firstCard.id || card.id === clickedCard.id
              ? { ...card, flipped: false }
              : card
          );
          setCards(resetCards);
          setFirstCard(null);
          setSecondCard(null);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const renderCardBack = () => {
    return (
      <div className="w-full h-full rounded-xl shadow-lg border-4 border-yellow-400 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
        <img 
          src="/images/pokeball-back.png" 
          alt="Pokemon card back"
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  const renderCardFront = (card: Card) => {
    return (
      <div className="w-full h-full bg-white rounded-xl shadow-lg border-4 border-yellow-400 overflow-hidden cursor-pointer hover:scale-105 transition-transform p-1 flex items-center justify-center">
        <img 
          src={card.pokemonImage} 
          alt={card.pokemonName}
          className="w-full h-full object-contain"
        />
      </div>
    );
  };

  const renderCard = (card: Card) => {
    if (!card.flipped && !card.matched) {
      return renderCardBack();
    }
    return renderCardFront(card);
  };

  const restartGame = () => {
    setShowGenerationSelector(true);
    setCards([]);
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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-white text-lg">Cargando Pokémon de {generations[selectedGeneration].name}...</p>
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
              Memorama Pokémon
            </h1>
            <p className="text-yellow-400 font-semibold mb-2">
              {generations[selectedGeneration].name}
            </p>
            <div className="flex flex-row justify-center gap-4 text-white mt-2">
              <div className="bg-red-600 px-5 py-1.5 rounded-full shadow-lg text-lg font-bold border-2 border-white">
                Movimientos: {moves}
              </div>
              <div className="bg-blue-600 px-5 py-1.5 rounded-full shadow-lg text-lg font-bold border-2 border-white">
                Parejas: {matches}/6
              </div>
            </div>
          </div>

          {!gameComplete ? (
            <>
              {/* Grid de cartas */}
              <div className="flex-1 flex items-center justify-center my-2">
                <div className="grid grid-cols-4 gap-2 sm:gap-3 justify-items-center">
                  {cards.map((card) => (
                    <div 
                      key={card.id} 
                      onClick={() => handleCardClick(card)}
                      className="w-[80px] h-[110px] sm:w-[95px] sm:h-[130px] cursor-pointer"
                    >
                      {renderCard(card)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones - SOLO 3 BOTONES en grid */}
              <div className="mt-auto pt-4 pb-2">
                <div className="grid grid-cols-3 gap-3">
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
            /* Pantalla de victoria - CON BOTONES COMO EN LA IMAGEN */
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto text-center border-4 border-yellow-400 shadow-2xl">
                <h2 className="text-4xl text-yellow-400 font-bold mb-4 animate-bounce">
                  ¡Felicidades!
                </h2>
                
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <p className="text-white text-2xl font-bold">
                    {moves} movimientos
                  </p>
                  <p className="text-yellow-300 text-sm mt-1">
                    {generations[selectedGeneration].name}
                  </p>
                </div>
                
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