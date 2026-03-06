import React from 'react';
import { Pokemon } from '../types/pokemon.types';
import './PokemonCard.css';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type] || '#777';
  };

  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default 
    || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';

  return (
    <div className="pokemon-card" onClick={onClick}>
      <div className="pokemon-card-header">
        <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
        <h3 className="pokemon-name">{pokemon.name}</h3>
      </div>
      
      <img 
        src={pokemonImage} 
        alt={pokemon.name}
        className="pokemon-image"
        loading="lazy"
      />
      
      <div className="pokemon-types">
        {pokemon.types.map((typeInfo) => (
          <span
            key={typeInfo.type.name}
            className="pokemon-type"
            style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
    </div>
  );
};