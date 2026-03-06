import React from 'react';
import { Pokemon } from '../types/pokemon.types';
import './PokemonDetail.css';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  const getStatBarWidth = (statValue: number): string => {
    const percentage = (statValue / 255) * 100;
    return `${percentage}%`;
  };

  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pokemon-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="detail-header">
          <h2>{pokemon.name} <span>#{pokemon.id.toString().padStart(3, '0')}</span></h2>
        </div>

        <div className="detail-content">
          <div className="detail-image">
            <img src={pokemonImage} alt={pokemon.name} />
          </div>

          <div className="detail-info">
            <div className="info-section">
              <h3>Información Básica</h3>
              <p><strong>Altura:</strong> {pokemon.height / 10}m</p>
              <p><strong>Peso:</strong> {pokemon.weight / 10}kg</p>
            </div>

            <div className="info-section">
              <h3>Habilidades</h3>
              <ul>
                {pokemon.abilities.map((abilityInfo) => (
                  <li key={abilityInfo.ability.name}>
                    {abilityInfo.ability.name.replace('-', ' ')}
                    {abilityInfo.is_hidden && ' (Oculta)'}
                  </li>
                ))}
              </ul>
            </div>

            <div className="info-section">
              <h3>Estadísticas Base</h3>
              <div className="stats">
                {pokemon.stats.map((statInfo) => (
                  <div key={statInfo.stat.name} className="stat-item">
                    <span className="stat-name">
                      {statInfo.stat.name.replace('-', ' ')}:
                    </span>
                    <span className="stat-value">{statInfo.base_stat}</span>
                    <div className="stat-bar-container">
                      <div 
                        className="stat-bar"
                        style={{ width: getStatBarWidth(statInfo.base_stat) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};