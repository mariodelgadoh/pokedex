import React, { useState } from 'react';
import { Pokemon } from '../../types/pokemon.types';

interface PokemonTCGCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
  isFlipped?: boolean;
  isMatched?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const PokemonTCGCard: React.FC<PokemonTCGCardProps> = ({ 
  pokemon, 
  onClick, 
  isFlipped = true,
  isMatched = false,
  size = 'medium'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'w-32 h-44 text-sm',
    medium: 'w-48 h-64 text-base',
    large: 'w-64 h-80 text-lg'
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: 'from-gray-400 to-gray-500',
      fire: 'from-orange-500 to-red-600',
      water: 'from-blue-400 to-blue-600',
      electric: 'from-yellow-400 to-yellow-600',
      grass: 'from-green-400 to-green-600',
      ice: 'from-cyan-300 to-blue-400',
      fighting: 'from-red-700 to-red-800',
      poison: 'from-purple-500 to-purple-700',
      ground: 'from-yellow-700 to-yellow-800',
      flying: 'from-indigo-300 to-indigo-500',
      psychic: 'from-pink-500 to-pink-700',
      bug: 'from-lime-500 to-green-700',
      rock: 'from-yellow-600 to-yellow-800',
      ghost: 'from-purple-700 to-indigo-900',
      dragon: 'from-indigo-600 to-purple-800',
      dark: 'from-gray-700 to-gray-900',
      steel: 'from-gray-400 to-slate-600',
      fairy: 'from-pink-300 to-pink-500'
    };
    return colors[type] || 'from-gray-400 to-gray-500';
  };

  const mainType = pokemon.types[0]?.type.name || 'normal';
  const typeGradient = getTypeColor(mainType);
  
  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default;

  const hp = pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 60;
  const attack = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 50;
  const defense = pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 50;

  if (!isFlipped) {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${sizeClasses[size]} 
          relative cursor-pointer rounded-2xl 
          bg-gradient-to-br from-yellow-300 to-yellow-600
          border-4 border-yellow-400
          shadow-xl transition-all duration-300
          ${isHovered ? 'transform -translate-y-2 shadow-2xl' : ''}
          ${isMatched ? 'opacity-0 pointer-events-none' : ''}
          overflow-hidden
        `}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-red-500 border-2 border-white"></div>
          <div className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-black border-2 border-white"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-2xl transform -rotate-12 opacity-50">POKEMON</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${sizeClasses[size]} 
        relative cursor-pointer rounded-2xl 
        bg-gradient-to-br ${typeGradient}
        border-4 border-yellow-400
        shadow-xl transition-all duration-300
        ${isHovered ? 'transform -translate-y-2 shadow-2xl' : ''}
        ${isMatched ? 'opacity-50 pointer-events-none' : ''}
        overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
        <span className="text-white font-bold text-lg capitalize drop-shadow-lg">
          {pokemon.name}
        </span>
        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-sm font-bold border-2 border-white">
          HP {hp}
        </span>
      </div>

      <div className="absolute top-10 left-0 right-0 flex justify-center">
        <div className="w-24 h-24 bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center border-2 border-white">
          <img 
            src={pokemonImage} 
            alt={pokemon.name}
            className="w-20 h-20 object-contain drop-shadow-xl"
          />
        </div>
      </div>

      <div className="absolute bottom-12 left-2 right-2">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2 text-white">
          <div className="flex justify-between items-center border-b border-white/30 pb-1 mb-1">
            <span className="font-bold">Ataque Rapido</span>
            <span className="bg-yellow-400 text-black px-2 rounded-full text-sm font-bold">20</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Placaje</span>
            <span className="bg-gray-600 px-2 rounded-full">10</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-xs">
        <span>ATA {attack}</span>
        <span>DEF {defense}</span>
        <span className="capitalize">{pokemon.types[0]?.type.name}</span>
      </div>

      <div className="absolute top-2 right-2">
        <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs border border-white capitalize">
          {pokemon.types[0]?.type.name}
        </span>
      </div>
    </div>
  );
};