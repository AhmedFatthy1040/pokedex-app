import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SortOrder {
  NAME_ASC = 'name-asc',
  NAME_DESC = 'name-desc',
  ID_ASC = 'id-asc',
  ID_DESC = 'id-desc',
}

export class PokemonQueryDto {
  @ApiProperty({ enum: SortOrder, required: false, example: 'id-asc' })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;
}

export class PaginatedPokemonQueryDto extends PokemonQueryDto {
  @ApiProperty({ required: false, example: 20, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({ required: false, example: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
