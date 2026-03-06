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

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-600',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-300'
    };
    return colors[type] || 'bg-gray-400';
  };

  const renderCard = (card: Card) => {
    if (!card.flipped && !card.matched) {
      // Dorso de la carta - responsivo
      return (
        <div className="w-20 h-28 xs:w-24 xs:h-32 sm:w-28 sm:h-36 md:w-32 md:h-44 
          bg-gradient-to-br from-red-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg 
          border-2 sm:border-4 border-yellow-400 flex items-center justify-center 
          cursor-pointer hover:scale-105 transition-transform mx-auto">
          <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
            bg-white/30 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 
              bg-white/50 rounded-full"></div>
          </div>
        </div>
      );
    }

    // Carta mostrada - responsivo
    const pokemon = card.pokemon;
    const typeColor = getTypeColor(pokemon.types[0]?.type.name || 'normal');
    const hp = pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 60;
    const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 50;
    
    return (
      <div className="w-20 h-28 xs:w-24 xs:h-32 sm:w-28 sm:h-36 md:w-32 md:h-44 
        bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-300 
        p-1 sm:p-2 flex flex-col cursor-pointer hover:scale-105 transition-transform mx-auto">
        
        {/* Nombre y HP - tamaños responsivos */}
        <div className="flex justify-between items-center text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs">
          <span className="font-bold capitalize truncate max-w-[50px] xs:max-w-[60px] sm:max-w-[70px]">
            {pokemon.name}
          </span>
          <span className="text-red-600 font-bold">{hp}</span>
        </div>

        {/* Imagen - responsiva */}
        <div className={`${typeColor} bg-opacity-30 rounded-lg p-0.5 sm:p-1 my-0.5 sm:my-1 
          h-8 xs:h-10 sm:h-12 md:h-14 flex items-center justify-center`}>
          <img 
            src={getPokemonImage(pokemon)} 
            alt={pokemon.name}
            className="h-6 xs:h-8 sm:h-10 md:h-12 w-6 xs:w-8 sm:w-10 md:w-12 object-contain"
          />
        </div>

        {/* Ataques - tamaños responsivos */}
        <div className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[10px] mt-0.5 sm:mt-1">
          <div className="flex justify-between border-b border-gray-200">
            <span className="truncate max-w-[40px] xs:max-w-[50px] sm:max-w-[60px]">Claw Slash</span>
            <span className="bg-gray-200 px-0.5 rounded">20+</span>
          </div>
          <div className="flex justify-between">
            <span className="truncate max-w-[40px] xs:max-w-[50px] sm:max-w-[60px]">Fire Spin</span>
            <span className="bg-gray-200 px-0.5 rounded">20</span>
          </div>
        </div>

        {/* Estadísticas - tamaños responsivos */}
        <div className="flex justify-between text-[5px] xs:text-[6px] sm:text-[7px] md:text-[8px] mt-0.5 sm:mt-1 text-gray-600">
          <span>ATA {attack}</span>
          <span className={`${typeColor} text-white px-0.5 rounded capitalize truncate max-w-[30px] xs:max-w-[35px] sm:max-w-[40px]`}>
            {pokemon.types[0]?.type.name}
          </span>
        </div>
      </div>
    );
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
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-emerald-900 p-2 sm:p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
            Memorama Pokemon
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 md:gap-8 text-white text-sm sm:text-base md:text-xl">
            <div className="bg-green-600 px-4 sm:px-6 py-1 sm:py-2 rounded-full shadow-lg">
              Movimientos: {moves}
            </div>
            <div className="bg-emerald-600 px-4 sm:px-6 py-1 sm:py-2 rounded-full shadow-lg">
              Pares: {matches}/6
            </div>
          </div>
        </div>

        {!gameComplete ? (
          <>
            <div className="grid grid-cols-3 xs:grid-cols-4 gap-1 sm:gap-2 md:gap-3 justify-items-center">
              {cards.map((card) => (
                <div key={card.id} onClick={() => handleCardClick(card)}>
                  {renderCard(card)}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 
                  text-gray-900 font-bold py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base
                  hover:from-yellow-500 hover:to-orange-600
                  transition-all transform hover:scale-105
                  shadow-lg"
              >
                Reiniciar juego
              </button>
            </div>
          </>
        ) : (
          <div className="text-center bg-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 md:p-12 mx-2 sm:mx-0">
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-yellow-400 font-bold mb-2 sm:mb-4 animate-bounce">
              Felicidades
            </h3>
            <p className="text-white text-base sm:text-xl md:text-2xl mb-3 sm:mb-4">
              Completaste el memorama en {moves} movimientos
            </p>
            <div className="flex justify-center gap-2 sm:gap-4">
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 
                  text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-full text-sm sm:text-base md:text-xl
                  hover:from-green-600 hover:to-emerald-600
                  transform hover:scale-105 transition-all"
              >
                Jugar de nuevo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};