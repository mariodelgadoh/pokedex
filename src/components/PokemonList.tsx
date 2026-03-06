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
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cargar todos los Pokémon (primeros 151 de Kanto)
  const loadAllPokemons = useCallback(async () => {
    try {
      setLoading(true);
      // Cargar los primeros 151 Pokémon (Kanto)
      const listResponse = await pokemonApi.getPokemonList(151, 0);
      
      const pokemonDetails = await pokemonApi.getMultiplePokemon(
        listResponse.results.map(p => p.url)
      );
      
      // Ordenar por ID
      const sortedPokemons = pokemonDetails.sort((a, b) => a.id - b.id);
      
      setPokemons(sortedPokemons);
      setFilteredPokemons(sortedPokemons);
    } catch (err) {
      setError('Error al cargar los Pokémon');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllPokemons();
  }, [loadAllPokemons]);

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
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/forest-bg.jpg')" }}
    >
      {/* Capa semitransparente para mejorar legibilidad */}
      <div className="min-h-screen bg-black/40 backdrop-blur-sm p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header estilo Pokédex */}
          <div className="text-center mb-6 sm:mb-8 relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg 
              [text-shadow:_2px_2px_0_#3B4CCA,_4px_4px_0_#00000050]">
              POKÉDEX
            </h1>
            <div className="w-20 sm:w-24 md:w-32 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            <p className="text-white/90 mt-2 text-sm sm:text-base md:text-lg">
              ¡Atrapa todos los Pokémon!
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />
          
          {error && (
            <div className="bg-red-600/90 backdrop-blur-sm text-white p-4 rounded-lg text-center my-4 shadow-lg border-2 border-yellow-400">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center my-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 mt-6 sm:mt-8">
                {filteredPokemons.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={() => handlePokemonClick(pokemon)}
                  />
                ))}
              </div>
              
              {filteredPokemons.length === 0 && (
                <div className="text-center text-white text-base sm:text-lg md:text-xl my-8 p-6 bg-black/40 backdrop-blur-sm rounded-lg border-2 border-yellow-400">
                  No se encontraron Pokémon con "{searchTerm}"
                </div>
              )}
            </>
          )}
          
          {selectedPokemon && (
            <PokemonDetail
              pokemon={selectedPokemon}
              onClose={handleCloseDetail}
            />
          )}
        </div>
      </div>
    </div>
  );
};