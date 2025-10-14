import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PokemonModule } from '../pokemon/pokemon.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon]), PokemonModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
