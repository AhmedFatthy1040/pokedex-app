import { ApiProperty } from '@nestjs/swagger';
import { PokemonDto } from './pokemon.dto';

export class PaginationMetadataDto {
  @ApiProperty({ example: 'http://localhost:3000/api/v2/pokemons?limit=20&offset=20', required: false })
  next?: string;

  @ApiProperty({ example: null, required: false })
  previous?: string;

  @ApiProperty({ example: 151 })
  total: number;

  @ApiProperty({ example: 8 })
  pages: number;

  @ApiProperty({ example: 1 })
  page: number;
}

export class PaginatedPokemonDto {
  @ApiProperty({ type: [PokemonDto] })
  data: PokemonDto[];

  @ApiProperty({ type: PaginationMetadataDto })
  metadata: PaginationMetadataDto;
}
