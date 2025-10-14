import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({ 
    example: 'pikachu', 
    description: 'Search by Pokemon name or type (e.g., "fire", "grass")',
    required: true 
  })
  @IsString()
  query: string;

  @ApiProperty({ 
    required: false, 
    example: 20, 
    minimum: 1,
    description: 'Limit the number of results' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
