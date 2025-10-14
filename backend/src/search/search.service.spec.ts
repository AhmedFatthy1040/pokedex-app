import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchService } from './search.service';
import { Pokemon } from '../pokemon/entities/pokemon.entity';

describe('SearchService', () => {
  let service: SearchService;
  let repository: Repository<Pokemon>;

  const mockPokemon: Partial<Pokemon> = {
    id: 1,
    name: 'bulbasaur',
    types: [
      { type: { name: 'grass' }, slot: 1 },
      { type: { name: 'poison' }, slot: 2 },
    ],
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(Pokemon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    repository = module.get<Repository<Pokemon>>(getRepositoryToken(Pokemon));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should search pokemon by name', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockPokemon]);

      const result = await service.search('bulba');

      expect(result).toEqual([mockPokemon]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'LOWER(pokemon.name) LIKE :name',
        { name: '%bulba%' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('pokemon.id', 'ASC');
    });

    it('should search pokemon by type using JSONB query', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockPokemon]);

      const result = await service.search('grass');

      expect(result).toEqual([mockPokemon]);
      expect(mockQueryBuilder.orWhere).toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('pokemon.id', 'ASC');
    });

    it('should apply limit when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockPokemon]);

      await service.search('char', 10);

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
    });

    it('should not apply limit when not provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockPokemon]);

      await service.search('char');

      expect(mockQueryBuilder.limit).not.toHaveBeenCalled();
    });

    it('should trim and lowercase search query', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockPokemon]);

      await service.search('  BuLbA  ');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'LOWER(pokemon.name) LIKE :name',
        { name: '%bulba%' },
      );
    });

    it('should return empty array when no matches found', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.search('xyz');

      expect(result).toEqual([]);
    });
  });
});
