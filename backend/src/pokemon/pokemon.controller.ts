import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { PokemonDto } from './dto/pokemon.dto';
import { PokemonDetailsDto } from './dto/pokemon-details.dto';
import { PaginatedPokemonDto } from './dto/paginated-pokemon.dto';
import { PokemonQueryDto, PaginatedPokemonQueryDto } from './dto/query-params.dto';

@ApiTags('Pokemons')
@Controller()
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('api/v1/pokemons')
  @ApiOperation({ summary: 'Get all pokemons' })
  @ApiResponse({ status: 200, description: 'List of all pokemons', type: [PokemonDto] })
  async findAll(@Query() query: PokemonQueryDto): Promise<PokemonDto[]> {
    const pokemons = await this.pokemonService.findAll(query.sort);
    return pokemons.map((pokemon) => this.pokemonService.transformToListDto(pokemon));
  }

  @Get('api/v1/pokemons/:id')
  @ApiOperation({ summary: 'Get a pokemon by id' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Pokemon details', type: PokemonDetailsDto })
  @ApiResponse({ status: 404, description: 'Pokemon not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PokemonDetailsDto> {
    const pokemon = await this.pokemonService.findOne(id);
    return this.pokemonService.transformToDetailsDto(pokemon);
  }

  @Get('api/v2/pokemons')
  @ApiOperation({ summary: 'Get all pokemons paginated' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of pokemons',
    type: PaginatedPokemonDto,
  })
  async findPaginated(@Query() query: PaginatedPokemonQueryDto): Promise<PaginatedPokemonDto> {
    const { limit = 20, offset = 0, sort } = query;
    const { data, total } = await this.pokemonService.findPaginated(limit, offset, sort);

    const pages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const baseUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/v2/pokemons`;

    const metadata = {
      total,
      pages,
      page: currentPage,
      next:
        offset + limit < total
          ? `${baseUrl}?limit=${limit}&offset=${offset + limit}${sort ? `&sort=${sort}` : ''}`
          : null,
      previous:
        offset > 0
          ? `${baseUrl}?limit=${limit}&offset=${Math.max(0, offset - limit)}${sort ? `&sort=${sort}` : ''}`
          : null,
    };

    return {
      data: data.map((pokemon) => this.pokemonService.transformToListDto(pokemon)),
      metadata,
    };
  }
}
