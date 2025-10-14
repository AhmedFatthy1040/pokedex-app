import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './entities/pokemon.entity';
import { NotFoundException } from '@nestjs/common';
import { SortOrder } from './dto/query-params.dto';

describe('PokemonService', () => {
  let service: PokemonService;
  let repository: Repository<Pokemon>;

  const mockPokemon: Partial<Pokemon> = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    order: 1,
    sprites: {
      front_default: 'https://example.com/bulbasaur.png',
      front_shiny: 'https://example.com/bulbasaur-shiny.png',
      front_female: null,
      front_shiny_female: null,
      back_default: 'https://example.com/bulbasaur-back.png',
      back_shiny: 'https://example.com/bulbasaur-back-shiny.png',
      back_female: null,
      back_shiny_female: null,
    },
    types: [
      { type: 'grass', slot: 1 },
      { type: 'poison', slot: 2 },
    ],
    stats: [
      { stat: 'hp', base_stat: 45, effort: 0 },
      { stat: 'attack', base_stat: 49, effort: 0 },
    ],
    abilities: [
      { ability: 'overgrow', is_hidden: false, slot: 1 },
      { ability: 'chlorophyll', is_hidden: true, slot: 3 },
    ],
    moves: [],
    species: '{"name":"bulbasaur"}',
    form: '{"name":"bulbasaur"}',
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(Pokemon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    repository = module.get<Repository<Pokemon>>(getRepositoryToken(Pokemon));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of pokemon ordered by ID', async () => {
      const expectedResult = [mockPokemon];
      mockQueryBuilder.getMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('pokemon');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('pokemon.id', 'ASC');
    });

    it('should sort by name ascending when specified', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockPokemon]);

      await service.findAll(SortOrder.NAME_ASC);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('pokemon.name', 'ASC');
    });

    it('should sort by name descending when specified', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockPokemon]);

      await service.findAll(SortOrder.NAME_DESC);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('pokemon.name', 'DESC');
    });

    it('should return empty array when no pokemon exist', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a pokemon when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockPokemon);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPokemon);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Pokemon with ID 999 not found');
    });
  });

  describe('findPaginated', () => {
    it('should return paginated pokemon', async () => {
      const expectedResult = [[mockPokemon], 1];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(expectedResult);

      const result = await service.findPaginated(20, 0);

      expect(result.data).toEqual([mockPokemon]);
      expect(result.total).toBe(1);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should handle pagination correctly', async () => {
      const pokemons = Array(20).fill(mockPokemon);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([pokemons, 100]);

      const result = await service.findPaginated(20, 40);

      expect(result.data.length).toBe(20);
      expect(result.total).toBe(100);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(40);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should sort by name when specified', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockPokemon], 1]);

      await service.findPaginated(20, 0, SortOrder.NAME_ASC);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('pokemon.name', 'ASC');
    });
  });

  describe('transformToListDto', () => {
    it('should transform pokemon to list DTO format', () => {
      const result = service.transformToListDto(mockPokemon as Pokemon);

      expect(result).toEqual({
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_default: 'https://example.com/bulbasaur.png',
        },
        types: [
          { type: { name: 'grass' }, slot: 1 },
          { type: { name: 'poison' }, slot: 2 },
        ],
      });
    });
  });

  describe('transformToDetailsDto', () => {
    it('should transform pokemon to details DTO format', () => {
      const result = service.transformToDetailsDto(mockPokemon as Pokemon);

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', 'bulbasaur');
      expect(result).toHaveProperty('height', 7);
      expect(result).toHaveProperty('weight', 69);
      expect(result.sprites).toHaveProperty('front_default');
      expect(result.types).toHaveLength(2);
      expect(result.stats).toHaveLength(2);
      expect(result.abilities).toHaveLength(2);
    });
  });
});
