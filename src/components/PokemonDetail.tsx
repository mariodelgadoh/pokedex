import React, { useEffect } from 'react';
import { Pokemon } from '../types/pokemon.types';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  // Disparar evento cuando se abre el modal
  useEffect(() => {
    window.dispatchEvent(new Event('pokemonModalOpen'));
    
    return () => {
      window.dispatchEvent(new Event('pokemonModalClose'));
    };
  }, []);

  // Obtener el color principal basado en el tipo del Pokémon
  const getPokemonColor = (): string => {
    const mainType = pokemon.types[0]?.type.name || 'normal';
    
    const colors: { [key: string]: { bg: string, bgLight: string, text: string } } = {
      normal: { bg: 'bg-gray-500', bgLight: 'bg-gray-50', text: 'text-gray-700' },
      fire: { bg: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-700' },
      water: { bg: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-700' },
      electric: { bg: 'bg-yellow-400', bgLight: 'bg-yellow-50', text: 'text-yellow-700' },
      grass: { bg: 'bg-green-500', bgLight: 'bg-green-50', text: 'text-green-700' },
      ice: { bg: 'bg-cyan-400', bgLight: 'bg-cyan-50', text: 'text-cyan-700' },
      fighting: { bg: 'bg-red-700', bgLight: 'bg-red-50', text: 'text-red-700' },
      poison: { bg: 'bg-purple-500', bgLight: 'bg-purple-50', text: 'text-purple-700' },
      ground: { bg: 'bg-yellow-700', bgLight: 'bg-yellow-50', text: 'text-yellow-700' },
      flying: { bg: 'bg-indigo-400', bgLight: 'bg-indigo-50', text: 'text-indigo-700' },
      psychic: { bg: 'bg-pink-500', bgLight: 'bg-pink-50', text: 'text-pink-700' },
      bug: { bg: 'bg-lime-500', bgLight: 'bg-lime-50', text: 'text-lime-700' },
      rock: { bg: 'bg-yellow-600', bgLight: 'bg-yellow-50', text: 'text-yellow-700' },
      ghost: { bg: 'bg-purple-700', bgLight: 'bg-purple-50', text: 'text-purple-700' },
      dragon: { bg: 'bg-indigo-600', bgLight: 'bg-indigo-50', text: 'text-indigo-700' },
      dark: { bg: 'bg-gray-700', bgLight: 'bg-gray-50', text: 'text-gray-700' },
      steel: { bg: 'bg-gray-400', bgLight: 'bg-gray-50', text: 'text-gray-700' },
      fairy: { bg: 'bg-pink-400', bgLight: 'bg-pink-50', text: 'text-pink-700' }
    };

    return colors[mainType]?.bgLight || 'bg-gray-50';
  };

  const getPokemonHeaderColor = (): string => {
    const mainType = pokemon.types[0]?.type.name || 'normal';
    
    const colors: { [key: string]: string } = {
      normal: 'bg-gradient-to-r from-gray-500 to-gray-600',
      fire: 'bg-gradient-to-r from-orange-500 to-red-500',
      water: 'bg-gradient-to-r from-blue-500 to-blue-600',
      electric: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
      grass: 'bg-gradient-to-r from-green-500 to-green-600',
      ice: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
      fighting: 'bg-gradient-to-r from-red-700 to-red-800',
      poison: 'bg-gradient-to-r from-purple-500 to-purple-600',
      ground: 'bg-gradient-to-r from-yellow-700 to-yellow-800',
      flying: 'bg-gradient-to-r from-indigo-400 to-indigo-500',
      psychic: 'bg-gradient-to-r from-pink-500 to-pink-600',
      bug: 'bg-gradient-to-r from-lime-500 to-lime-600',
      rock: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
      ghost: 'bg-gradient-to-r from-purple-700 to-purple-800',
      dragon: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
      dark: 'bg-gradient-to-r from-gray-700 to-gray-800',
      steel: 'bg-gradient-to-r from-gray-400 to-gray-500',
      fairy: 'bg-gradient-to-r from-pink-400 to-pink-500'
    };

    return colors[mainType] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-500',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-600',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-400'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getTypeTextColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: 'text-gray-800',
      fire: 'text-white',
      water: 'text-white',
      electric: 'text-gray-800',
      grass: 'text-white',
      ice: 'text-gray-800',
      fighting: 'text-white',
      poison: 'text-white',
      ground: 'text-gray-800',
      flying: 'text-white',
      psychic: 'text-white',
      bug: 'text-white',
      rock: 'text-gray-800',
      ghost: 'text-white',
      dragon: 'text-white',
      dark: 'text-white',
      steel: 'text-gray-800',
      fairy: 'text-gray-800'
    };
    return colors[type] || 'text-white';
  };

  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default;

  // Estadísticas principales para mostrar
  const mainStats = {
    hp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
    attack: pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
    defense: pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
    spAttack: pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
    spDefense: pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
    speed: pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0
  };

  // Calcular color de barra según el valor y el tipo
  const getStatBarColor = (value: number, statName: string): string => {
    const mainType = pokemon.types[0]?.type.name || 'normal';
    
    const typeColors: { [key: string]: string } = {
      normal: 'bg-gray-500',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-600',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-400'
    };

    return typeColors[mainType] || 'bg-blue-500';
  };

  const backgroundColor = getPokemonColor();
  const headerColor = getPokemonHeaderColor();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`${backgroundColor} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-200`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header con degradado del tipo */}
        <div className={`${headerColor} px-8 py-6 rounded-t-2xl`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-white/80 text-sm font-mono">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white capitalize mt-1">
                {pokemon.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {/* Imagen y tipos */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-2xl p-4 flex items-center justify-center border-4 border-white shadow-xl">
              <img 
                src={pokemonImage} 
                alt={pokemon.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {pokemon.types.map((typeInfo) => (
                  <span
                    key={typeInfo.type.name}
                    className={`${getTypeColor(typeInfo.type.name)} ${getTypeTextColor(typeInfo.type.name)} px-4 py-2 rounded-full capitalize font-medium shadow-md text-sm tracking-wide`}
                  >
                    {typeInfo.type.name}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-lg">
                Pokémon de tipo {pokemon.types.map(t => t.type.name).join(' y ')}
              </p>
            </div>
          </div>

          {/* Tarjetas de información en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Información Básica */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Información Básica
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Altura</span>
                  <span className="text-gray-900 font-medium">{pokemon.height / 10} m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Peso</span>
                  <span className="text-gray-900 font-medium">{pokemon.weight / 10} kg</span>
                </div>
              </div>
            </div>

            {/* Habilidades */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Habilidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((abilityInfo) => (
                  <span
                    key={abilityInfo.ability.name}
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full capitalize text-sm font-medium"
                  >
                    {abilityInfo.ability.name.replace('-', ' ')}
                    {abilityInfo.is_hidden && <span className="ml-1.5 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">Oculta</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Estadísticas Base */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-5 pb-2 border-b border-gray-100">
              Estadísticas Base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">HP</span>
                    <span className="text-gray-900 font-medium">{mainStats.hp}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.hp, 'hp')} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.hp / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Ataque</span>
                    <span className="text-gray-900 font-medium">{mainStats.attack}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.attack, 'attack')} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.attack / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Defensa</span>
                    <span className="text-gray-900 font-medium">{mainStats.defense}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.defense, 'defense')} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.defense / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Ataque Esp.</span>
                    <span className="text-gray-900 font-medium">{mainStats.spAttack}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.spAttack, 'spAttack')} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.spAttack / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Defensa Esp.</span>
                    <span className="text-gray-900 font-medium">{mainStats.spDefense}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.spDefense, 'spDefense')} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.spDefense / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Velocidad</span>
                    <span className="text-gray-900 font-medium">{mainStats.speed}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.speed, 'speed')} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.speed / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};