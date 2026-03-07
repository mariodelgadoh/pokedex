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
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const limit = 20;

  // Cargar Pokémon por lotes
  const loadPokemons = useCallback(async (offset: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const listResponse = await pokemonApi.getPokemonList(limit, offset);
      
      const newPokemonDetails = await pokemonApi.getMultiplePokemon(
        listResponse.results.map(p => p.url)
      );
      
      if (reset) {
        // Si es reset, reemplazamos los Pokémon existentes
        setPokemons(newPokemonDetails);
        setFilteredPokemons(newPokemonDetails);
        setCurrentOffset(offset);
      } else {
        // Si no es reset, agregamos a los existentes
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
  }, []);

  // Cargar inicial (solo cuando el componente se monta)
  useEffect(() => {
    // Resetear todo cuando el componente se monta
    setPokemons([]);
    setFilteredPokemons([]);
    setCurrentOffset(0);
    setSearchTerm('');
    loadPokemons(0, true);
    
    // Cleanup function para cuando el componente se desmonta
    return () => {
      setPokemons([]);
      setFilteredPokemons([]);
      setCurrentOffset(0);
      setSearchTerm('');
    };
  }, [loadPokemons]);

  // Función de búsqueda
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredPokemons(pokemons);
      return;
    }

    const localFiltered = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(term.toLowerCase())
    );

    if (localFiltered.length > 0) {
      setFilteredPokemons(localFiltered);
    } else {
      try {
        setLoading(true);
        const pokemon = await pokemonApi.getPokemonDetail(term.toLowerCase());
        setFilteredPokemons([pokemon]);
      } catch (error) {
        setFilteredPokemons([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredPokemons(pokemons);
  };

  const handleSelectPokemon = async (pokemonName: string) => {
    try {
      const pokemon = await pokemonApi.getPokemonDetail(pokemonName.toLowerCase());
      setSelectedPokemon(pokemon);
    } catch (error) {
      console.error('Error al cargar el Pokémon seleccionado:', error);
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const newOffset = currentOffset + limit;
      setCurrentOffset(newOffset);
      loadPokemons(newOffset, false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/forest-bg.jpg')" }}
    >
      {/* Capa decorativa con patrón de Pokeballs */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-8 border-white"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-8 border-white"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full border-8 border-white"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 p-8 pb-40">
        <div className="max-w-7xl mx-auto">
          {/* Header con estilo vidrio */}
          <div className="text-center mb-8 relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl -m-4"></div>
            <div className="relative py-6">
              <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-lg 
                [text-shadow:_0_4px_0_#3B4CCA,_0_8px_8px_rgba(0,0,0,0.5)]">
                POKÉDEX
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full"></div>
              <p className="text-white/90 mt-2 text-lg font-semibold drop-shadow-md">
                ¡Explora el mundo Pokémon!
              </p>
              <p className="text-white/80 text-sm mt-1">
                Mostrando {filteredPokemons.length} Pokémon
                {searchTerm && ` • Buscando: "${searchTerm}"`}
              </p>
            </div>
          </div>

          {/* Buscador con estilo acorde */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full -m-1"></div>
            <div className="relative">
              <SearchBar 
                onSearch={handleSearch} 
                onSelectPokemon={handleSelectPokemon}
                onClearSearch={handleClearSearch}
              />
            </div>
          </div>
          
          {error && (
            <div className="relative mt-4 bg-red-500/80 backdrop-blur-md text-white p-4 rounded-lg text-center shadow-lg border-2 border-yellow-400">
              {error}
            </div>
          )}
          
          {/* Grid de Pokémon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {filteredPokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => handlePokemonClick(pokemon)}
              />
            ))}
          </div>
          
          {loading && (
            <div className="flex flex-col justify-center items-center my-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-white opacity-20"></div>
              </div>
              <p className="text-white mt-4 font-semibold drop-shadow-lg">Cargando Pokémon...</p>
            </div>
          )}
          
          {/* Botón Cargar más - con margen inferior extra */}
          {hasMore && !loading && filteredPokemons.length === pokemons.length && (
            <div className="flex justify-center mt-8 mb-16">
              <button
                onClick={loadMore}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500
                  text-gray-900 font-bold px-6 py-3 rounded-full
                  shadow-2xl hover:shadow-3xl
                  transform hover:scale-105 transition-all
                  border-4 border-red-500
                  text-base sm:text-lg
                  touch-manipulation
                  flex items-center gap-2"
              >
                <img 
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                  alt="Pikachu"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg"
                />
                <span>Cargar más Pokémon ↓</span>
              </button>
            </div>
          )}
          
          {filteredPokemons.length === 0 && searchTerm && (
            <div className="relative mt-8 bg-black/40 backdrop-blur-md text-white text-xl p-8 rounded-lg border-2 border-yellow-400 text-center">
              No se encontró ningún Pokémon llamado "{searchTerm}"
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
    </div>
  );
};