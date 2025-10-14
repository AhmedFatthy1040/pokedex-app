import { IsArray, IsInt, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetPokemonsDto {
  @ApiProperty({ 
    example: [1, 4, 7, 25, 133, 151],
    description: 'Array of Pokemon IDs (max 6)',
    type: [Number]
  })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(6, { message: 'A team can have a maximum of 6 Pokemon' })
  @IsInt({ each: true })
  pokemons: number[];
}
