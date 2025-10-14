import { ApiProperty } from '@nestjs/swagger';

export class PokemonDetailsSpriteDto {
  @ApiProperty({ example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' })
  front_default: string;

  @ApiProperty({ example: null, required: false })
  front_female?: string;

  @ApiProperty({ example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png' })
  front_shiny: string;

  @ApiProperty({ example: null, required: false })
  front_shiny_female?: string;

  @ApiProperty({ example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png' })
  back_default: string;

  @ApiProperty({ example: null, required: false })
  back_female?: string;

  @ApiProperty({ example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png' })
  back_shiny: string;

  @ApiProperty({ example: null, required: false })
  back_shiny_female?: string;
}

export class PokemonStatDto {
  @ApiProperty({ example: 'hp' })
  stat: string;

  @ApiProperty({ example: 45 })
  base_stat: number;

  @ApiProperty({ example: 0 })
  effort: number;
}

export class PokemonAbilityDto {
  @ApiProperty({ example: 'overgrow' })
  ability: string;

  @ApiProperty({ example: false })
  is_hidden: boolean;

  @ApiProperty({ example: 1 })
  slot: number;
}

export class PokemonMoveVersionDetailDto {
  @ApiProperty({ example: 'level-up' })
  move_learn_method: string;

  @ApiProperty({ example: 'red-blue' })
  version_group: string;

  @ApiProperty({ example: 0 })
  level_learned_at: number;
}

export class PokemonMoveDto {
  @ApiProperty({ example: 'tackle' })
  move: string;

  @ApiProperty({ type: [PokemonMoveVersionDetailDto] })
  version_group_details: PokemonMoveVersionDetailDto[];
}

export class PokemonDetailsDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'bulbasaur' })
  name: string;

  @ApiProperty({ type: PokemonDetailsSpriteDto })
  sprites: PokemonDetailsSpriteDto;

  @ApiProperty({ type: [Object], example: [{ type: 'grass', slot: 1 }] })
  types: any[];

  @ApiProperty({ example: 7 })
  height: number;

  @ApiProperty({ example: 69 })
  weight: number;

  @ApiProperty({ type: [PokemonMoveDto] })
  moves: PokemonMoveDto[];

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 'bulbasaur' })
  species: string;

  @ApiProperty({ type: [PokemonStatDto] })
  stats: PokemonStatDto[];

  @ApiProperty({ type: [PokemonAbilityDto] })
  abilities: PokemonAbilityDto[];

  @ApiProperty({ example: 'bulbasaur' })
  form: string;
}
