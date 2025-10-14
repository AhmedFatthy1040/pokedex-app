import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { SetPokemonsDto } from './dto/set-pokemons.dto';
import { TeamDto } from './dto/team.dto';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(BearerAuthGuard)
@Controller('api/v1/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'List of all teams', type: [TeamDto] })
  async findAll(): Promise<TeamDto[]> {
    const teams = await this.teamService.findAll();
    return teams.map((team) => this.teamService.transformToDto(team));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully', type: TeamDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTeamDto: CreateTeamDto): Promise<TeamDto> {
    const team = await this.teamService.create(createTeamDto);
    return this.teamService.transformToDto(team);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by id' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Team details', type: TeamDto })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    const team = await this.teamService.findOne(id);
    return this.teamService.transformToDto(team);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Set Pokemons of a team' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 200, description: 'Team updated successfully', type: TeamDto })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 400, description: 'Invalid Pokemon IDs or team size exceeded' })
  async setPokemons(
    @Param('id', ParseIntPipe) id: number,
    @Body() setPokemonsDto: SetPokemonsDto,
  ): Promise<TeamDto> {
    const team = await this.teamService.setPokemons(id, setPokemonsDto);
    return this.teamService.transformToDto(team);
  }
}
