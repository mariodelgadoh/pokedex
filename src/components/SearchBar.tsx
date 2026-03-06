import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-3 sm:px-0">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:relative">
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-full 
            bg-white/95 backdrop-blur-sm
            border-2 border-blue-500 focus:border-yellow-400
            outline-none shadow-lg
            transition-all duration-300
            pr-4 sm:pr-36
            placeholder:text-gray-500
            text-gray-800"
        />
        <button
          type="submit"
          className="w-full sm:w-auto sm:absolute sm:right-2 sm:top-2
            bg-gradient-to-r from-red-500 to-red-600
            text-white font-bold py-3 sm:py-2 px-6 rounded-full
            hover:from-red-600 hover:to-red-700
            transition-all duration-300 transform hover:scale-105 active:scale-95
            shadow-lg border-2 border-white
            text-base sm:text-sm
            touch-manipulation"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};