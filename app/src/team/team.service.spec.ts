import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamService } from './team.service';
import { Team } from './entities/team.entity';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: Repository<Team>;
  let pokemonRepository: Repository<Pokemon>;

  const mockPokemon: Partial<Pokemon> = {
    id: 1,
    name: 'bulbasaur',
  };

  const mockTeam: Partial<Team> = {
    id: 1,
    name: 'My Team',
    pokemons: [mockPokemon as Pokemon],
  };

  const mockTeamRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPokemonRepository = {
    find: jest.fn(),
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
        {
          provide: getRepositoryToken(Pokemon),
          useValue: mockPokemonRepository,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
    pokemonRepository = module.get<Repository<Pokemon>>(getRepositoryToken(Pokemon));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const createTeamDto = { name: 'Elite Four' };
      const newTeam = { id: 1, name: 'Elite Four', pokemons: [] };

      mockTeamRepository.create.mockReturnValue(newTeam);
      mockTeamRepository.save.mockResolvedValue(newTeam);

      const result = await service.create(createTeamDto);

      expect(result).toEqual({ id: 1, name: 'Elite Four', pokemons: [] });
      expect(mockTeamRepository.create).toHaveBeenCalledWith({
        name: 'Elite Four',
        pokemons: [],
      });
      expect(mockTeamRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      mockTeamRepository.find.mockResolvedValue([mockTeam]);

      const result = await service.findAll();

      expect(result).toEqual([mockTeam]);
      expect(mockTeamRepository.find).toHaveBeenCalledWith({
        relations: ['pokemons'],
        order: { id: 'ASC' },
      });
    });

    it('should return empty array when no teams exist', async () => {
      mockTeamRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a team when found', async () => {
      mockTeamRepository.findOne.mockResolvedValue(mockTeam);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTeam);
      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['pokemons'],
      });
    });

    it('should throw NotFoundException when team not found', async () => {
      mockTeamRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Team with ID 999 not found');
    });
  });

  describe('setPokemons', () => {
    it('should set pokemons for a team', async () => {
      const pokemonIds = [1, 4, 7];
      const pokemons = pokemonIds.map((id) => ({ id, name: `pokemon-${id}` }));

      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockPokemonRepository.find.mockResolvedValue(pokemons);
      mockTeamRepository.save.mockResolvedValue({
        ...mockTeam,
        pokemons,
      });

      const result = await service.setPokemons(1, { pokemons: pokemonIds });

      expect(result.pokemons).toEqual(pokemons);
      expect(mockPokemonRepository.find).toHaveBeenCalled();
      expect(mockTeamRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when more than 6 pokemon provided', async () => {
      const pokemonIds = [1, 2, 3, 4, 5, 6, 7];

      await expect(service.setPokemons(1, { pokemons: pokemonIds })).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.setPokemons(1, { pokemons: pokemonIds })).rejects.toThrow(
        'A team can have a maximum of 6 Pokemon',
      );
    });

    it('should throw BadRequestException when not all pokemon IDs exist', async () => {
      const pokemonIds = [1, 999];
      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockPokemonRepository.find.mockResolvedValue([{ id: 1, name: 'bulbasaur' }]);

      await expect(service.setPokemons(1, { pokemons: pokemonIds })).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.setPokemons(1, { pokemons: pokemonIds })).rejects.toThrow(
        'Pokemon with IDs 999 not found',
      );
    });

    it('should throw NotFoundException when team not found', async () => {
      mockTeamRepository.findOne.mockResolvedValue(null);

      await expect(service.setPokemons(999, { pokemons: [1] })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should allow empty pokemon list', async () => {
      mockTeamRepository.findOne.mockResolvedValue(mockTeam);
      mockPokemonRepository.find.mockResolvedValue([]);
      mockTeamRepository.save.mockResolvedValue({
        ...mockTeam,
        pokemons: [],
      });

      const result = await service.setPokemons(1, { pokemons: [] });

      expect(result.pokemons).toEqual([]);
    });
  });

  describe('transformToDto', () => {
    it('should transform team entity to DTO format', () => {
      const team = {
        id: 1,
        name: 'Champions',
        pokemons: [
          { id: 1, name: 'bulbasaur' },
          { id: 4, name: 'charmander' },
        ],
      } as Team;

      const result = service.transformToDto(team);

      expect(result).toEqual({
        id: 1,
        name: 'Champions',
        pokemons: [1, 4],
      });
    });

    it('should handle team with no pokemons', () => {
      const team = {
        id: 1,
        name: 'Empty Team',
        pokemons: [],
      } as Team;

      const result = service.transformToDto(team);

      expect(result).toEqual({
        id: 1,
        name: 'Empty Team',
        pokemons: [],
      });
    });
  });
});
