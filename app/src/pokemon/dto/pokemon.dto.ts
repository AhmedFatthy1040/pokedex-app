import { ApiProperty } from '@nestjs/swagger';

export class PokemonTypeDto {
  @ApiProperty({ example: { name: 'grass' } })
  type: {
    name: string;
  };

  @ApiProperty({ example: 1 })
  slot: number;
}

export class PokemonSpriteDto {
  @ApiProperty({ example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' })
  front_default: string;
}

export class PokemonDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'bulbasaur' })
  name: string;

  @ApiProperty({ type: PokemonSpriteDto })
  sprites: PokemonSpriteDto;

  @ApiProperty({ type: [PokemonTypeDto] })
  types: PokemonTypeDto[];
}
