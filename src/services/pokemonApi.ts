import axios from 'axios';
import { Pokemon, PokemonListResponse } from '../types/pokemon.types';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  // Obtener lista de pokemons con paginación
  getPokemonList: async (limit: number = 20, offset: number = 0) => {
    const response = await axios.get<PokemonListResponse>(
      `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  // Obtener detalles de un pokemon específico
  getPokemonDetail: async (nameOrId: string | number) => {
    const response = await axios.get<Pokemon>(
      `${API_BASE_URL}/pokemon/${nameOrId}`
    );
    return response.data;
  },

  // Obtener múltiples pokemons por sus URLs
  getMultiplePokemon: async (urls: string[]) => {
    const promises = urls.map(url => axios.get<Pokemon>(url));
    const responses = await Promise.all(promises);
    return responses.map(res => res.data);
  }
};