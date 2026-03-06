import React, { useEffect, useState, useCallback } from 'react';
import { Pokemon } from '../types/pokemon.types';
import { pokemonApi } from '../services/pokemonApi';
import { PokemonCard } from './PokemonCard';
import { PokemonDetail } from './PokemonDetail';
import { SearchBar } from './SearchBar';
import './PokemonList.css';

export const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const limit = 20;

  const loadPokemons = useCallback(async () => {
    try {
      setLoading(true);
      const listResponse = await pokemonApi.getPokemonList(limit, offset);
      
      if (offset === 0) {
        const pokemonDetails = await pokemonApi.getMultiplePokemon(
          listResponse.results.map(p => p.url)
        );
        setPokemons(pokemonDetails);
        setFilteredPokemons(pokemonDetails);
      } else {
        const newPokemonDetails = await pokemonApi.getMultiplePokemon(
          listResponse.results.map(p => p.url)
        );
        setPokemons(prev => [...prev, ...newPokemonDetails]);
        setFilteredPokemons(prev => [...prev, ...newPokemonDetails]);
      }
      
      setHasMore(!!listResponse.next);
    } catch (err) {
      setError('Error al cargar los Pokémon');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    loadPokemons();
  }, [loadPokemons]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPokemons(pokemons);
    } else {
      const filtered = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filtered);
    }
  }, [searchTerm, pokemons]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setOffset(prev => prev + limit);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="pokemon-list-container">
      <h1 className="title">Pokédex</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {error && <div className="error">{error}</div>}
      
      <div className="pokemon-grid">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => handlePokemonClick(pokemon)}
          />
        ))}
      </div>
      
      {loading && <div className="loading">Cargando Pokémon...</div>}
      
      {hasMore && !loading && filteredPokemons.length === pokemons.length && (
        <button onClick={loadMore} className="load-more-button">
          Cargar más Pokémon
        </button>
      )}
      
      {filteredPokemons.length === 0 && !loading && (
        <div className="no-results">
          No se encontraron Pokémon con "{searchTerm}"
        </div>
      )}
      
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};