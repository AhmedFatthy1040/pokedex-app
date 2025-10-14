import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { PokemonDto } from '../pokemon/dto/pokemon.dto';
import { PokemonService } from '../pokemon/pokemon.service';

@ApiTags('Search')
@Controller('api/v1')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly pokemonService: PokemonService,
  ) {}

  @Get('search')
  @ApiOperation({ 
    summary: 'Search for pokemons',
    description: 'Search Pokemon by name or type. Returns Pokemon matching the search query in their name or type.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of matching pokemons', 
    type: [PokemonDto] 
  })
  async search(@Query() searchQuery: SearchQueryDto): Promise<PokemonDto[]> {
    const pokemons = await this.searchService.search(
      searchQuery.query,
      searchQuery.limit,
    );

    return pokemons.map((pokemon) => this.pokemonService.transformToListDto(pokemon));
  }
}
