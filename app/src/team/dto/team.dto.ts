import { ApiProperty } from '@nestjs/swagger';

export class TeamDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My Awesome Team' })
  name: string;

  @ApiProperty({ 
    example: [1, 4, 7, 25, 133, 151],
    type: [Number],
    description: 'Array of Pokemon IDs'
  })
  pokemons: number[];
}
