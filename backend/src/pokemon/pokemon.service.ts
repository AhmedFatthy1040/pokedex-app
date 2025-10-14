import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { SortOrder } from './dto/query-params.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async findAll(sort?: SortOrder): Promise<Pokemon[]> {
    const query = this.pokemonRepository.createQueryBuilder('pokemon');

    // Apply sorting
    if (sort) {
      switch (sort) {
        case SortOrder.NAME_ASC:
          query.orderBy('pokemon.name', 'ASC');
          break;
        case SortOrder.NAME_DESC:
          query.orderBy('pokemon.name', 'DESC');
          break;
        case SortOrder.ID_ASC:
          query.orderBy('pokemon.id', 'ASC');
          break;
        case SortOrder.ID_DESC:
          query.orderBy('pokemon.id', 'DESC');
          break;
        default:
          query.orderBy('pokemon.id', 'ASC');
      }
    } else {
      query.orderBy('pokemon.id', 'ASC');
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    return pokemon;
  }

  async findPaginated(
    limit: number = 20,
    offset: number = 0,
    sort?: SortOrder,
  ): Promise<{ data: Pokemon[]; total: number }> {
    const query = this.pokemonRepository.createQueryBuilder('pokemon');

    // Apply sorting
    if (sort) {
      switch (sort) {
        case SortOrder.NAME_ASC:
          query.orderBy('pokemon.name', 'ASC');
          break;
        case SortOrder.NAME_DESC:
          query.orderBy('pokemon.name', 'DESC');
          break;
        case SortOrder.ID_ASC:
          query.orderBy('pokemon.id', 'ASC');
          break;
        case SortOrder.ID_DESC:
          query.orderBy('pokemon.id', 'DESC');
          break;
        default:
          query.orderBy('pokemon.id', 'ASC');
      }
    } else {
      query.orderBy('pokemon.id', 'ASC');
    }

    const [data, total] = await query.skip(offset).take(limit).getManyAndCount();

    return { data, total };
  }

  // Helper method to transform Pokemon entity to list DTO format
  transformToListDto(pokemon: Pokemon) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprites: {
        front_default: pokemon.sprites?.front_default || null,
      },
      types: pokemon.types || [],
    };
  }

  // Helper method to transform Pokemon entity to details DTO format
  transformToDetailsDto(pokemon: Pokemon) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprites: {
        front_default: pokemon.sprites?.front_default || null,
        front_female: pokemon.sprites?.front_female || null,
        front_shiny: pokemon.sprites?.front_shiny || null,
        front_shiny_female: pokemon.sprites?.front_shiny_female || null,
        back_default: pokemon.sprites?.back_default || null,
        back_female: pokemon.sprites?.back_female || null,
        back_shiny: pokemon.sprites?.back_shiny || null,
        back_shiny_female: pokemon.sprites?.back_shiny_female || null,
      },
      types: this.transformTypes(pokemon.types),
      height: pokemon.height,
      weight: pokemon.weight,
      moves: this.transformMoves(pokemon.moves),
      order: pokemon.order,
      species: pokemon.species,
      stats: this.transformStats(pokemon.stats),
      abilities: this.transformAbilities(pokemon.abilities),
      form: pokemon.form,
    };
  }

  private transformTypes(types: any[]): any[] {
    if (!types || !Array.isArray(types)) return [];
    return types.map((t) => ({
      type: typeof t.type === 'object' ? t.type.name : t.type,
      slot: t.slot,
    }));
  }

  private transformStats(stats: any[]): any[] {
    if (!stats || !Array.isArray(stats)) return [];
    return stats.map((s) => ({
      stat: typeof s.stat === 'object' ? s.stat.name : s.stat,
      base_stat: s.base_stat,
      effort: s.effort,
    }));
  }

  private transformAbilities(abilities: any[]): any[] {
    if (!abilities || !Array.isArray(abilities)) return [];
    return abilities.map((a) => ({
      ability: typeof a.ability === 'object' ? a.ability.name : a.ability,
      is_hidden: a.is_hidden,
      slot: a.slot,
    }));
  }

  private transformMoves(moves: any[]): any[] {
    if (!moves || !Array.isArray(moves)) return [];
    return moves.map((m) => ({
      move: typeof m.move === 'object' ? m.move.name : m.move,
      version_group_details: (m.version_group_details || []).map((vg) => ({
        move_learn_method:
          typeof vg.move_learn_method === 'object'
            ? vg.move_learn_method.name
            : vg.move_learn_method,
        version_group:
          typeof vg.version_group === 'object' ? vg.version_group.name : vg.version_group,
        level_learned_at: vg.level_learned_at,
      })),
    }));
  }
}
