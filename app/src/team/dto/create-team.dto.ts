import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'My Awesome Team' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
