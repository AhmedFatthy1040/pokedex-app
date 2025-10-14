import apiClient from './api'
import type { Pokemon, PokemonListItem } from '@/types/pokemon'

export const pokemonService = {
  /**
   * Get list of all Pokemon
   */
  async getPokemons(params?: {
    sort?: string
    limit?: number
    offset?: number
  }): Promise<PokemonListItem[]> {
    const response = await apiClient.get('/pokemons', { params })
    return response.data
  },

  /**
   * Get Pokemon by ID
   */
  async getPokemonById(id: number): Promise<Pokemon> {
    const response = await apiClient.get(`/pokemons/${id}`)
    return response.data
  },

  /**
   * Search Pokemon by name or type
   */
  async searchPokemons(query: string): Promise<PokemonListItem[]> {
    const response = await apiClient.get('/search', {
      params: { query }
    })
    return response.data
  },
}
