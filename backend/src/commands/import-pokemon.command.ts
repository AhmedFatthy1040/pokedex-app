import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import axios from 'axios';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

interface PokeAPIResponse {
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
  sprites: any;
  types: any[];
  stats: any[];
  abilities: any[];
  moves: any[];
}

async function importPokemon(idOrName: string) {
  console.log(`🔍 Fetching Pokemon: ${idOrName} from PokeAPI...`);

  // Initialize database connection
  const dataSource = new DataSource(databaseConfig);
  await dataSource.initialize();
  console.log('✅ Database connected');

  try {
    // Fetch Pokemon from PokeAPI
    const response = await axios.get<PokeAPIResponse>(
      `${POKEAPI_BASE_URL}/pokemon/${idOrName.toLowerCase()}`
    );
    
    const pokemon = response.data;
    console.log(`📦 Found Pokemon: ${pokemon.name} (ID: ${pokemon.id})`);

    // Transform the data to match our database schema
    const transformedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      order: pokemon.order,
      species: pokemon.species,
      form: pokemon.forms && pokemon.forms.length > 0 ? pokemon.forms[0] : { name: pokemon.name, url: '' },
      sprites: pokemon.sprites,
      types: pokemon.types,
      stats: pokemon.stats,
      abilities: pokemon.abilities,
      moves: pokemon.moves,
    };

    // Save to database (upsert)
    const pokemonRepository = dataSource.getRepository('Pokemon');
    await pokemonRepository.save(transformedPokemon);

    console.log(`✅ Successfully imported Pokemon: ${pokemon.name} (ID: ${pokemon.id})`);
    console.log(`   - Height: ${pokemon.height}`);
    console.log(`   - Weight: ${pokemon.weight}`);
    console.log(`   - Types: ${pokemon.types.map((t: any) => t.type.name).join(', ')}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.error(`❌ Pokemon "${idOrName}" not found in PokeAPI`);
      } else {
        console.error('❌ Error fetching from PokeAPI:', error.message);
      }
    } else {
      console.error('❌ Error importing Pokemon:', error);
    }
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Get command line argument
const idOrName = process.argv[2];

if (!idOrName) {
  console.error('❌ Usage: npm run import:pokemon <id|name>');
  console.error('   Example: npm run import:pokemon 25');
  console.error('   Example: npm run import:pokemon pikachu');
  process.exit(1);
}

// Run the import
importPokemon(idOrName)
  .then(() => {
    console.log('✨ Pokemon import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Pokemon import failed');
    process.exit(1);
  });
