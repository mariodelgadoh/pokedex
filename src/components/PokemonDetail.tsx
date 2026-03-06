import React from 'react';
import { Pokemon } from '../types/pokemon.types';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  const getStatBarWidth = (statValue: number): string => {
    const percentage = (statValue / 255) * 100;
    return `${percentage}%`;
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

  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all z-10"
        >
          ×
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 flex items-center justify-center border-4 border-yellow-400 shadow-xl mb-4">
            <img 
              src={pokemonImage} 
              alt={pokemon.name}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold capitalize text-gray-800">
            {pokemon.name} <span className="text-gray-500 text-xl">#{pokemon.id.toString().padStart(3, '0')}</span>
          </h2>
        </div>

        {/* Tipos */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Tipos</h3>
          <div className="flex gap-2">
            {pokemon.types.map((typeInfo) => (
              <span
                key={typeInfo.type.name}
                className={`${getTypeColor(typeInfo.type.name)} text-white px-4 py-2 rounded-full capitalize font-semibold shadow-md`}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>

        {/* Información básica */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Información Básica</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-blue-600 text-sm font-semibold">Altura</p>
              <p className="text-2xl font-bold text-gray-800">{pokemon.height / 10} m</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
              <p className="text-green-600 text-sm font-semibold">Peso</p>
              <p className="text-2xl font-bold text-gray-800">{pokemon.weight / 10} kg</p>
            </div>
          </div>
        </div>

        {/* Habilidades */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((abilityInfo) => (
              <span
                key={abilityInfo.ability.name}
                className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full capitalize font-semibold border-2 border-purple-300"
              >
                {abilityInfo.ability.name.replace('-', ' ')}
                {abilityInfo.is_hidden && <span className="ml-2 text-xs bg-purple-200 px-2 py-0.5 rounded-full">Oculta</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Estadísticas Base</h3>
          <div className="space-y-3">
            {pokemon.stats.map((statInfo) => {
              const statName = {
                hp: 'HP',
                attack: 'Attack',
                defense: 'Defense',
                'special-attack': 'Special Attack',
                'special-defense': 'Special Defense',
                speed: 'Speed'
              }[statInfo.stat.name] || statInfo.stat.name;

              return (
                <div key={statInfo.stat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">{statName}:</span>
                    <span className="font-bold text-gray-900">{statInfo.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: getStatBarWidth(statInfo.base_stat) }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};