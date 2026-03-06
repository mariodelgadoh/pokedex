import React from 'react';
import { Pokemon } from '../types/pokemon.types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const typeColors = {
  normal: 'bg-gradient-to-br from-[#A8A77A] to-[#C6C6A7]',
  fire: 'bg-gradient-to-br from-[#EE8130] to-[#F5AC78]',
  water: 'bg-gradient-to-br from-[#6390F0] to-[#9DB7F5]',
  electric: 'bg-gradient-to-br from-[#F7D02C] to-[#FAE078]',
  grass: 'bg-gradient-to-br from-[#7AC74C] to-[#A7DB8D]',
  ice: 'bg-gradient-to-br from-[#96D9D6] to-[#BCE6E6]',
  fighting: 'bg-gradient-to-br from-[#C22E28] to-[#D67873]',
  poison: 'bg-gradient-to-br from-[#A33EA1] to-[#C183C1]',
  ground: 'bg-gradient-to-br from-[#E2BF65] to-[#EBD69D]',
  flying: 'bg-gradient-to-br from-[#A98FF3] to-[#C6B7F5]',
  psychic: 'bg-gradient-to-br from-[#F95587] to-[#FA92B2]',
  bug: 'bg-gradient-to-br from-[#A6B91A] to-[#C6D16E]',
  rock: 'bg-gradient-to-br from-[#B6A136] to-[#D1C17D]',
  ghost: 'bg-gradient-to-br from-[#735797] to-[#A292BC]',
  dragon: 'bg-gradient-to-br from-[#6F35FC] to-[#A27DFA]',
  dark: 'bg-gradient-to-br from-[#705746] to-[#A29288]',
  steel: 'bg-gradient-to-br from-[#B7B7CE] to-[#D1D1E0]',
  fairy: 'bg-gradient-to-br from-[#D685AD] to-[#F4BDC9]',
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const bgColor = typeColors[mainType as keyof typeof typeColors] || typeColors.normal;
  
  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default 
    || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';

  return (
    <div
      onClick={onClick}
      className={`
        ${bgColor} 
        relative overflow-hidden rounded-2xl p-4 
        shadow-lg hover:shadow-2xl 
        transform hover:-translate-y-2 hover:scale-105 
        transition-all duration-300 cursor-pointer
        border-4 border-white/30 backdrop-blur-sm
        group
      `}
    >
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Número Pokémon */}
      <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
        #{pokemon.id.toString().padStart(3, '0')}
      </div>

      {/* Imagen */}
      <div className="relative z-10 flex justify-center mb-3">
        <img
          src={pokemonImage}
          alt={pokemon.name}
          className="w-32 h-32 object-contain drop-shadow-xl 
            group-hover:scale-110 group-hover:rotate-3 
            transition-all duration-300"
        />
      </div>

      {/* Nombre */}
      <h3 className="text-center text-white text-xl font-bold capitalize mb-2 drop-shadow-md">
        {pokemon.name}
      </h3>

      {/* Tipos */}
      <div className="flex gap-2 justify-center">
        {pokemon.types.map((typeInfo) => (
          <span
            key={typeInfo.type.name}
            className="px-3 py-1 bg-white/30 backdrop-blur-md rounded-full 
              text-white text-xs font-semibold uppercase tracking-wider
              border border-white/50 shadow-lg"
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>

      {/* Efecto Pokeball */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
    </div>
  );
};