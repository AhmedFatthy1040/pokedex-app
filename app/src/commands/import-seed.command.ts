import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { ImagesService } from '../images/images.service';
import * as fs from 'fs';
import * as path from 'path';

const imagesService = new ImagesService();

interface PokeAPIType {
  type: {
    name: string;
    url: string;
  };
  slot: number;
}

interface PokeAPIStat {
  stat: {
    name: string;
    url: string;
  };
  effort: number;
  base_stat: number;
}

interface PokeAPIAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokeAPIMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: any[];
}

interface PokeAPIPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  order: number;
  species: {
    name: string;
    url: string;
  };
  forms: Array<{
    name: string;
    url: string;
  }>;
  sprites: {
    front_default: string;
    front_shiny: string;
    front_female: string | null;
    front_shiny_female: string | null;
    back_default: string;
    back_shiny: string;
    back_female: string | null;
    back_shiny_female: string | null;
    other?: any;
    versions?: any;
  };
  types: PokeAPIType[];
  stats: PokeAPIStat[];
  abilities: PokeAPIAbility[];
  moves: PokeAPIMove[];
}

async function importSeed() {
  console.log('🌱 Starting Pokemon seed import...');

  // Initialize database connection
  const dataSource = new DataSource(databaseConfig);
  await dataSource.initialize();
  console.log('✅ Database connected');

  try {
    // Read pokemons.json file
    const dataPath = path.join(__dirname, '../../data/pokemons.json');
    
    if (!fs.existsSync(dataPath)) {
      console.error(`❌ File not found: ${dataPath}`);
      console.log('💡 Please place pokemons.json in the data/ directory');
      console.log('   Expected path: backend/data/pokemons.json');
      throw new Error(`File not found: ${dataPath}`);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const pokemonData: PokeAPIPokemon[] = JSON.parse(rawData);
    
    console.log(`📦 Found ${pokemonData.length} Pokemon to import`);

    // Clear existing Pokemon data
    await dataSource.query('TRUNCATE TABLE "pokemons" RESTART IDENTITY CASCADE');
    console.log('🗑️  Cleared existing Pokemon data');

    // Transform and insert Pokemon
    const pokemonRepository = dataSource.getRepository('Pokemon');
    let imported = 0;

    for (const pokemon of pokemonData) {
      // Download sprites and get local paths
      const localSprites = await imagesService.downloadPokemonSprites(pokemon.id, pokemon.sprites);

      // Transform the data to match our database schema
      const transformedPokemon = {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        order: pokemon.order,
        species: pokemon.species,
        form: pokemon.forms && pokemon.forms.length > 0 ? pokemon.forms[0] : { name: pokemon.name, url: '' },
        sprites: localSprites, // Use local sprite paths
        types: pokemon.types,
        stats: pokemon.stats,
        abilities: pokemon.abilities,
        moves: pokemon.moves,
      };

      await pokemonRepository.save(transformedPokemon);
      imported++;

      if (imported % 10 === 0) {
        console.log(`⏳ Imported ${imported}/${pokemonData.length} Pokemon (with sprites)...`);
      }
    }

    console.log(`✅ Successfully imported ${imported} Pokemon!`);
  } catch (error) {
    console.error('❌ Error importing seed data:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Run the import
importSeed()
  .then(() => {
    console.log('✨ Seed import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed import failed:', error);
    process.exit(1);
  });
