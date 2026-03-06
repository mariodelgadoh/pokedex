import React from 'react';
import { Pokemon } from '../types/pokemon.types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

// Traducción de tipos al español
const typeTranslations: { [key: string]: string } = {
  normal: 'Normal',
  fighting: 'Lucha',
  flying: 'Volador',
  poison: 'Veneno',
  ground: 'Tierra',
  rock: 'Roca',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  fairy: 'Hada'
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
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

  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default;

  // Traducir el tipo al español
  const translateType = (type: string): string => {
    return typeTranslations[type] || type;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white/90 backdrop-blur-sm rounded-xl p-4 cursor-pointer
        transform hover:scale-105 transition-all duration-300
        shadow-lg hover:shadow-xl
        border-2 border-yellow-400
        flex flex-col items-center"
    >
      <div className="w-24 h-24 sm:w-28 sm:h-28 mb-3 flex items-center justify-center">
        <img 
          src={pokemonImage} 
          alt={pokemon.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      <span className="text-sm text-gray-500 font-bold mb-2">
        #{pokemon.id.toString().padStart(3, '0')}
      </span>
      
      <h3 className="text-base sm:text-lg font-bold capitalize text-gray-800 mb-3 text-center">
        {pokemon.name}
      </h3>
      
      <div className="flex gap-2 flex-wrap justify-center">
        {pokemon.types.map((typeInfo) => (
          <span
            key={typeInfo.type.name}
            className={`${getTypeColor(typeInfo.type.name)} text-white px-3 py-1 rounded-full text-xs sm:text-sm capitalize`}
          >
            {translateType(typeInfo.type.name)}
          </span>
        ))}
      </div>
    </div>
  );
};