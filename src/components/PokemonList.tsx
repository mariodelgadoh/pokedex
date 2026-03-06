import React, { useEffect, useState, useCallback } from 'react';
import { Pokemon } from '../types/pokemon.types';
import { pokemonApi } from '../services/pokemonApi';
import { PokemonCard } from './PokemonCard';
import { PokemonDetail } from './PokemonDetail';
import { SearchBar } from './SearchBar';

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
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-blue-600 p-8">
      {/* Header estilo Pokédex */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 relative">
          <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-lg 
            [text-shadow:_0_4px_0_#3B4CCA,_0_8px_8px_rgba(0,0,0,0.3)]">
            POKÉDEX
          </h1>
          <div className="w-32 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          <p className="text-white/80 mt-2 text-lg">¡Atrapa todos los Pokémon!</p>
        </div>

        <SearchBar onSearch={handleSearch} />
        
        {error && (
          <div className="bg-red-700 text-white p-4 rounded-lg text-center my-4 shadow-lg">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {filteredPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => handlePokemonClick(pokemon)}
            />
          ))}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        )}
        
        {hasMore && !loading && filteredPokemons.length === pokemons.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 
                font-bold py-3 px-8 rounded-full shadow-lg 
                transform hover:scale-105 transition-all duration-300
                border-2 border-white/50 hover:border-white
                text-lg tracking-wider"
            >
              Cargar más Pokémon ↓
            </button>
          </div>
        )}
        
        {filteredPokemons.length === 0 && !loading && (
          <div className="text-center text-white text-xl my-8 p-8 bg-black/30 rounded-lg backdrop-blur-sm">
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
    </div>
  );
};