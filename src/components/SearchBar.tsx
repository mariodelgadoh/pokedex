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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 text-lg rounded-full 
            bg-white/95 backdrop-blur-sm
            border-2 border-yellow-400 focus:border-blue-500
            outline-none shadow-lg
            transition-all duration-300
            group-hover:shadow-xl
            pl-14"
        />
        <svg 
          className="absolute left-5 top-4 w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          type="submit"
          className="absolute right-2 top-2 bg-gradient-to-r from-blue-500 to-blue-600
            text-white font-semibold py-2 px-6 rounded-full
            hover:from-blue-600 hover:to-blue-700
            transition-all duration-300 shadow-md hover:shadow-lg
            border border-white/20"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};