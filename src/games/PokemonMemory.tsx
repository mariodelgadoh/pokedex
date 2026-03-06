import React, { useState, useEffect } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon.types';

interface Card {
  id: string;
  pokemon: Pokemon;
  matched: boolean;
  flipped: boolean;
}

export const PokemonMemory: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [secondCard, setSecondCard] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    setLoading(true);
    try {
      const pokemonList: Pokemon[] = [];
      const usedIds = new Set();
      
      while (pokemonList.length < 6) {
        const randomId = Math.floor(Math.random() * 151) + 1;
        if (!usedIds.has(randomId)) {
          usedIds.add(randomId);
          const pokemon = await pokemonApi.getPokemonDetail(randomId);
          pokemonList.push(pokemon);
        }
      }

      const cardPairs: Card[] = [];
      pokemonList.forEach((pokemon) => {
        cardPairs.push({
          id: `${pokemon.id}-a`,
          pokemon,
          matched: false,
          flipped: false
        });
        cardPairs.push({
          id: `${pokemon.id}-b`,
          pokemon,
          matched: false,
          flipped: false
        });
      });

      const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setLoading(false);
    }
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

      if (firstCard.pokemon.id === clickedCard.pokemon.id) {
        setTimeout(() => {
          const matchedCards = cards.map(card =>
            card.pokemon.id === firstCard.pokemon.id
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

  const getPokemonImage = (pokemon: Pokemon) => {
    return pokemon.sprites.other?.['official-artwork']?.front_default 
      || pokemon.sprites.front_default;
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
    const pokemon = card.pokemon;
    
    return (
      <div className="w-full h-full bg-white rounded-xl shadow-lg border-4 border-yellow-400 overflow-hidden cursor-pointer hover:scale-105 transition-transform p-1 flex items-center justify-center">
        <img 
          src={getPokemonImage(pokemon)} 
          alt={pokemon.name}
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
    setCards([]);
    setMoves(0);
    setMatches(0);
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
    setGameComplete(false);
    initializeGame();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
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
            <div className="flex flex-row justify-center gap-4 text-white mt-2">
              <div className="bg-red-600 px-5 py-1.5 rounded-full shadow-lg text-lg font-bold border-2 border-white">
                M: {moves}
              </div>
              <div className="bg-blue-600 px-5 py-1.5 rounded-full shadow-lg text-lg font-bold border-2 border-white">
                P: {matches}/6
              </div>
            </div>
          </div>

          {!gameComplete ? (
            <>
              {/* Grid de cartas - Área principal que ocupa el espacio disponible */}
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

              {/* Botón de Reiniciar solo */}
              <div className="mt-auto pt-4 pb-2 flex justify-center">
                <button
                  onClick={restartGame}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 
                    text-gray-900 font-bold py-3 px-10 rounded-full text-lg
                    hover:from-yellow-500 hover:to-orange-600
                    transition-all transform hover:scale-105 active:scale-95
                    shadow-lg border-2 border-white w-full sm:w-auto min-w-[200px]
                    touch-manipulation"
                >
                  Reiniciar
                </button>
              </div>
            </>
          ) : (
            /* Pantalla de victoria */
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto text-center border-4 border-yellow-400">
                <h2 className="text-3xl text-yellow-400 font-bold mb-3 animate-bounce">
                  ¡Felicidades!
                </h2>
                <p className="text-white text-xl mb-6">
                  Completaste el memorama en {moves} movimientos
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={restartGame}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 
                      text-white font-bold py-3 px-10 rounded-full text-lg
                      hover:from-green-600 hover:to-emerald-600
                      transform hover:scale-105 active:scale-95 transition-all
                      shadow-lg border-2 border-white w-full sm:w-auto min-w-[200px]"
                  >
                    Jugar de nuevo
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