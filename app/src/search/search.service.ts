import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Pokemon } from '../pokemon/entities/pokemon.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async search(query: string, limit?: number): Promise<Pokemon[]> {
    const searchTerm = query.toLowerCase().trim();

    // Create query builder
    const queryBuilder = this.pokemonRepository
      .createQueryBuilder('pokemon')
      .where('LOWER(pokemon.name) LIKE :name', { name: `%${searchTerm}%` });

    // Also search by type using JSON query
    // Types are stored as JSONB array like: [{"type": {"name": "grass"}, "slot": 1}]
    queryBuilder.orWhere(
      `EXISTS (
        SELECT 1 FROM jsonb_array_elements(pokemon.types) AS type_element
        WHERE LOWER(type_element->'type'->>'name') LIKE :type
      )`,
      { type: `%${searchTerm}%` },
    );

    // Apply limit if provided
    if (limit) {
      queryBuilder.limit(limit);
    }

    // Order by ID for consistent results
    queryBuilder.orderBy('pokemon.id', 'ASC');

    return queryBuilder.getMany();
  }
}
