import React, { useState, useEffect, useRef } from 'react';
import { pokemonApi } from '../services/pokemonApi';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onSelectPokemon?: (pokemonName: string) => void;
  onClearSearch?: () => void;
}

interface Suggestion {
  name: string;
  url: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onSelectPokemon, 
  onClearSearch 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allPokemon, setAllPokemon] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Cargar todos los nombres de Pokémon al iniciar
  useEffect(() => {
    const loadAllPokemonNames = async () => {
      try {
        setLoading(true);
        const response = await pokemonApi.getPokemonList(2000, 0);
        setAllPokemon(response.results);
      } catch (error) {
        console.error('Error loading pokemon names:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllPokemonNames();
  }, []);

  // Actualizar sugerencias mientras escribe
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = allPokemon
      .filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);

    setSuggestions(filtered);
  }, [searchTerm, allPokemon]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (pokemonName: string) => {
    setSearchTerm(pokemonName);
    onSearch(pokemonName);
    if (onSelectPokemon) {
      onSelectPokemon(pokemonName);
    }
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-0 relative" ref={suggestionRef}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar Pokémon por nombre..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-full 
                bg-white/95 backdrop-blur-sm
                border-2 border-blue-500 focus:border-yellow-400
                outline-none shadow-lg
                transition-all duration-300
                pr-12 sm:pr-36
                placeholder:text-gray-500
                text-gray-800"
            />
            
            {/* Botón X para limpiar búsqueda */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 sm:right-36 top-1/2 transform -translate-y-1/2
                  text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300
                  w-7 h-7 rounded-full flex items-center justify-center
                  transition-all duration-200 text-lg font-bold"
              >
                ×
              </button>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full sm:w-auto sm:absolute sm:right-2 sm:top-2
              bg-gradient-to-r from-red-500 to-red-600
              text-white font-bold py-3 sm:py-2 px-6 rounded-full
              hover:from-red-600 hover:to-red-700
              transition-all duration-300 transform hover:scale-105 active:scale-95
              shadow-lg border-2 border-white
              text-base sm:text-sm
              touch-manipulation
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!searchTerm.trim()}
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Sugerencias de búsqueda */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-2xl border-2 border-yellow-400 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.name}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-200 capitalize border-b border-gray-100 last:border-b-0"
            >
              {suggestion.name}
            </button>
          ))}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-2xl border-2 border-yellow-400 p-4 text-center text-gray-600">
          Cargando Pokémon...
        </div>
      )}
    </div>
  );
};