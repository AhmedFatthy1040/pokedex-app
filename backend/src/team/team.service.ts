import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './entities/team.entity';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { SetPokemonsDto } from './dto/set-pokemons.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create({
      name: createTeamDto.name,
      pokemons: [],
    });

    return this.teamRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      relations: ['pokemons'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['pokemons'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async setPokemons(id: number, setPokemonsDto: SetPokemonsDto): Promise<Team> {
    const team = await this.findOne(id);

    // Validate max 6 Pokemon (also validated by DTO, but double-check)
    if (setPokemonsDto.pokemons.length > 6) {
      throw new BadRequestException('A team can have a maximum of 6 Pokemon');
    }

    // Check if all Pokemon IDs exist
    if (setPokemonsDto.pokemons.length > 0) {
      const pokemons = await this.pokemonRepository.find({
        where: { id: In(setPokemonsDto.pokemons) },
      });

      // Verify all requested Pokemon exist
      if (pokemons.length !== setPokemonsDto.pokemons.length) {
        const foundIds = pokemons.map((p) => p.id);
        const missingIds = setPokemonsDto.pokemons.filter((id) => !foundIds.includes(id));
        throw new BadRequestException(
          `Pokemon with IDs ${missingIds.join(', ')} not found`,
        );
      }

      team.pokemons = pokemons;
    } else {
      team.pokemons = [];
    }

    return this.teamRepository.save(team);
  }

  // Transform Team entity to DTO format
  transformToDto(team: Team) {
    return {
      id: team.id,
      name: team.name,
      pokemons: team.pokemons ? team.pokemons.map((p) => p.id) : [],
    };
  }
}
