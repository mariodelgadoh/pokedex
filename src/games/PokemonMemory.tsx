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

  const renderCardBack = () => {
    // Diseño de la parte trasera según la imagen (Pokemon dos veces)
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg border-4 border-yellow-400 flex flex-col items-center justify-center p-1 sm:p-2">
        {/* Círculo superior estilo pokebola */}
        <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center mb-0.5 sm:mb-1 shadow-inner">
          <div className="w-2 h-2 xs:w-3 xs:h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-red-500 rounded-full border border-gray-300"></div>
        </div>
        
        {/* Texto POKEMON en dos líneas como la imagen */}
        <div className="text-center leading-tight">
          <div className="text-white font-bold text-[8px] xs:text-[9px] sm:text-xs md:text-sm tracking-wider">POKEMON</div>
          <div className="text-white font-bold text-[8px] xs:text-[9px] sm:text-xs md:text-sm tracking-wider mt-0">POKEMON</div>
        </div>
        
        {/* Círculo inferior */}
        <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center mt-0.5 sm:mt-1 shadow-inner">
          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full"></div>
        </div>
      </div>
    );
  };

  const renderCardFront = (card: Card) => {
    const pokemon = card.pokemon;
    const typeColor = getTypeColor(pokemon.types[0]?.type.name || 'normal');
    const hp = pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 60;
    const attack = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 50;
    
    return (
      <div className="w-full h-full bg-white rounded-xl shadow-lg border-2 border-gray-300 p-1 flex flex-col">
        {/* Nombre y HP */}
        <div className="flex justify-between items-center text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px]">
          <span className="font-bold capitalize truncate max-w-[35px] xs:max-w-[40px] sm:max-w-[45px] md:max-w-[50px]">
            {pokemon.name}
          </span>
          <span className="text-red-600 font-bold text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px]">{hp}</span>
        </div>

        {/* Imagen con fondo de tipo */}
        <div className={`${typeColor} bg-opacity-30 rounded-lg p-0.5 my-0.5 
          h-7 xs:h-8 sm:h-9 md:h-10 flex items-center justify-center`}>
          <img 
            src={getPokemonImage(pokemon)} 
            alt={pokemon.name}
            className="h-5 xs:h-6 sm:h-7 md:h-8 w-5 xs:w-6 sm:w-7 md:w-8 object-contain"
          />
        </div>

        {/* Ataques */}
        <div className="text-[5px] xs:text-[6px] sm:text-[7px] md:text-[8px] mt-0.5">
          <div className="flex justify-between border-b border-gray-200 pb-0.5">
            <span className="truncate max-w-[30px] xs:max-w-[35px] sm:max-w-[40px] md:max-w-[45px]">Claw Slash</span>
            <span className="bg-gray-200 px-0.5 rounded text-[5px] xs:text-[6px] sm:text-[7px]">20+</span>
          </div>
          <div className="flex justify-between pt-0.5">
            <span className="truncate max-w-[30px] xs:max-w-[35px] sm:max-w-[40px] md:max-w-[45px]">Fire Spin</span>
            <span className="bg-gray-200 px-0.5 rounded text-[5px] xs:text-[6px] sm:text-[7px]">20</span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex justify-between text-[4px] xs:text-[5px] sm:text-[6px] md:text-[7px] mt-0.5 text-gray-600">
          <span>ATA {attack}</span>
          <span className={`${typeColor} text-white px-0.5 rounded capitalize truncate max-w-[20px] xs:max-w-[25px] sm:max-w-[30px]`}>
            {pokemon.types[0]?.type.name}
          </span>
        </div>
      </div>
    );
  };

  const renderCard = (card: Card) => {
    if (!card.flipped && !card.matched) {
      // Parte trasera de la carta
      return renderCardBack();
    }

    // Parte frontal de la carta
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
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-emerald-900 p-1 sm:p-2 md:p-3 lg:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header mejorado para móvil */}
        <div className="text-center mb-1 sm:mb-2 md:mb-3">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
            Memorama Pokemon
          </h2>
          <div className="flex flex-row justify-center gap-1 sm:gap-2 md:gap-3 text-white">
            <div className="bg-green-600 px-2 py-0.5 rounded-full shadow-lg text-[9px] xs:text-[10px] sm:text-xs md:text-sm">
              <span className="hidden xs:inline">Movimientos:</span> 
              <span className="xs:hidden font-bold">M:</span> {moves}
            </div>
            <div className="bg-emerald-600 px-2 py-0.5 rounded-full shadow-lg text-[9px] xs:text-[10px] sm:text-xs md:text-sm">
              <span className="hidden xs:inline">Pares:</span> 
              <span className="xs:hidden font-bold">P:</span> {matches}/6
            </div>
          </div>
        </div>

        {!gameComplete ? (
          <>
            {/* Grid de cartas - 4 columnas para móvil */}
            <div className="grid grid-cols-4 gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 justify-items-center">
              {cards.map((card) => (
                <div 
                  key={card.id} 
                  onClick={() => handleCardClick(card)}
                  className="w-14 h-20 xs:w-16 xs:h-22 sm:w-20 sm:h-26 md:w-24 md:h-32 lg:w-28 lg:h-36 cursor-pointer hover:scale-105 transition-transform"
                >
                  {renderCard(card)}
                </div>
              ))}
            </div>

            {/* Botón de reinicio - Tamaño táctil optimizado */}
            <div className="flex justify-center mt-2 sm:mt-3 md:mt-4">
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 
                  text-gray-900 font-bold py-2 px-4 sm:py-2 sm:px-5 md:py-2 md:px-6 
                  rounded-full text-xs sm:text-sm md:text-base
                  hover:from-yellow-500 hover:to-orange-600
                  transition-all transform hover:scale-105
                  shadow-lg min-w-[90px] sm:min-w-[100px] md:min-w-[120px]
                  active:scale-95 touch-manipulation"
              >
                Reiniciar
              </button>
            </div>
          </>
        ) : (
          /* Pantalla de victoria - Optimizada para móvil */
          <div className="text-center bg-black/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mx-1 sm:mx-2">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-400 font-bold mb-1 sm:mb-2 animate-bounce">
              Felicidades
            </h3>
            <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3">
              Completaste el memorama en {moves} movimientos
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 
                  text-white font-bold py-2 px-4 sm:py-2 sm:px-5 md:py-2 md:px-6 
                  rounded-full text-xs sm:text-sm md:text-base
                  hover:from-green-600 hover:to-emerald-600
                  transform hover:scale-105 active:scale-95 transition-all
                  shadow-lg touch-manipulation"
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