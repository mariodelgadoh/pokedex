import React, { useState, useEffect } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { Pokemon } from '../types/pokemon.types';
import { PokemonTCGCard } from './components/PokemonTCGCard';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-emerald-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Memorama Pokemon
          </h2>
          <div className="flex justify-center gap-8">
            <div className="bg-green-600 text-white px-6 py-2 rounded-full shadow-lg">
              Movimientos: {moves}
            </div>
            <div className="bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg">
              Pares: {matches}/6
            </div>
          </div>
        </div>

        {!gameComplete ? (
          <>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
              {cards.map((card) => (
                <PokemonTCGCard
                  key={card.id}
                  pokemon={card.pokemon}
                  onClick={() => handleCardClick(card)}
                  isFlipped={card.flipped}
                  isMatched={card.matched}
                  size="small"
                />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 
                  text-gray-900 font-bold py-2 px-6 rounded-full
                  hover:from-yellow-500 hover:to-orange-600
                  transition-all transform hover:scale-105
                  shadow-lg"
              >
                Reiniciar juego
              </button>
            </div>
          </>
        ) : (
          <div className="text-center bg-black/50 backdrop-blur-sm rounded-2xl p-12">
            <h3 className="text-4xl text-yellow-400 font-bold mb-4 animate-bounce">
              Felicidades
            </h3>
            <p className="text-white text-2xl mb-4">
              Completaste el memorama en {moves} movimientos
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 
                  text-white font-bold py-3 px-8 rounded-full text-xl
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