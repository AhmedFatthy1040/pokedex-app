# Pokédex Backend API

A RESTful API for managing Pokémon and teams built with NestJS, TypeORM, and PostgreSQL.

## Features

- ✅ Browse Pokémon (list, details, pagination)
- ✅ Search Pokémon by name and types
- ✅ Manage teams (CRUD operations)
- ✅ Team validation (max 6 Pokémon per team)
- ✅ Import Pokémon from external API (PokeAPI)
- ✅ Bulk seed data from JSON dump
- ✅ TypeORM migrations
- ✅ Swagger/OpenAPI documentation

## Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- npm or yarn

## Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=pokedex
DB_PASSWORD=pokedex123
DB_DATABASE=pokedex

# Application
NODE_ENV=development
PORT=3000
```

### 3. Start Database

```bash
# Start PostgreSQL with Docker Compose
docker compose up -d
```

### 4. Run Migrations

```bash
# Run database migrations
npm run migration:run
```

### 5. Seed Data (Optional)

You have two options to populate the database:

**Option A: Bulk Import from JSON (151 Pokémon)**

1. Place your `pokemons.json` file in `backend/data/`
2. Run the seed command:

```bash
npm run seed
```

**Option B: Import Individual Pokémon from PokeAPI**

```bash
# Import by name
npm run import:pokemon bulbasaur

# Import by ID
npm run import:pokemon 1

# Import multiple
npm run import:pokemon charmander
npm run import:pokemon squirtle
```

### 6. Start the Server

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at: http://localhost:3000

## API Documentation

### Swagger UI

Interactive API documentation is available at:
- **URL**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs-json

### Endpoints

#### Pokémon Endpoints

```
GET    /api/v1/pokemons          # List all Pokémon
GET    /api/v1/pokemons/:id      # Get Pokémon details
GET    /api/v1/pokemons/search   # Search Pokémon (supports pagination)
```

**Search Query Parameters:**
- `name`: Filter by Pokémon name (partial match)
- `type`: Filter by type (grass, fire, water, etc.)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Example:**
```bash
# Get all Pokémon
curl http://localhost:3000/api/v1/pokemons

# Get Bulbasaur details
curl http://localhost:3000/api/v1/pokemons/1

# Search for grass-type Pokémon
curl "http://localhost:3000/api/v1/pokemons/search?type=grass&page=1&limit=10"

# Search by name
curl "http://localhost:3000/api/v1/pokemons/search?name=char"
```

#### Team Endpoints

```
GET    /api/v1/teams             # List all teams
POST   /api/v1/teams             # Create a new team
GET    /api/v1/teams/:id         # Get team details
POST   /api/v1/teams/:id         # Update team's Pokémon roster
```

**Example:**
```bash
# Create a team
curl -X POST http://localhost:3000/api/v1/teams \
  -H "Content-Type: application/json" \
  -d '{"name": "Elite Four Champions"}'

# Add Pokémon to team (max 6)
curl -X POST http://localhost:3000/api/v1/teams/1 \
  -H "Content-Type: application/json" \
  -d '{"pokemonIds": [1, 4, 7, 25, 133, 143]}'

# Get team details
curl http://localhost:3000/api/v1/teams/1
```

## Database Migrations

### Available Commands

```bash
# Generate a new migration from entity changes
npm run migration:generate src/migrations/MigrationName

# Create an empty migration file
npm run migration:create src/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

### Migration Workflow

1. **Modify entities** in `src/**/entities/*.entity.ts`
2. **Generate migration**: `npm run migration:generate src/migrations/UpdateSchema`
3. **Review** the generated migration file in `src/migrations/`
4. **Run migration**: `npm run migration:run`

### Production Deployment

For production, disable auto-sync and use migrations:

1. Set `NODE_ENV=production` in `.env`
2. Ensure `synchronize: false` in `database.config.ts`
3. Run `npm run migration:run` before starting the app

## Data Import Commands

### Seed Command

Bulk import 151 Pokémon from a JSON dump file:

```bash
npm run seed
```

**Requirements:**
- Place `pokemons.json` in `backend/data/` directory
- File should contain an array of Pokémon data matching PokeAPI format

**Features:**
- ✅ Imports all 151 Pokémon in seconds
- ✅ Shows progress for each Pokémon
- ✅ Transforms PokeAPI format to database schema
- ✅ Handles types, stats, abilities, moves, sprites

### Import Pokémon Command

Fetch and import individual Pokémon from PokeAPI:

```bash
# By name
npm run import:pokemon bulbasaur

# By ID
npm run import:pokemon 25
```

**Features:**
- ✅ Fetches from https://pokeapi.co/api/v2/pokemon/{idOrName}
- ✅ Validates Pokémon exists before importing
- ✅ Upserts data (creates or updates)
- ✅ Displays detailed import summary

## Project Structure

```
backend/
├── src/
│   ├── commands/             # CLI commands (seed, import)
│   ├── config/               # Configuration files
│   │   └── database.config.ts
│   ├── migrations/           # TypeORM migrations
│   │   └── *-InitialSchema.ts
│   ├── pokemon/              # Pokémon module
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── pokemon.controller.ts
│   │   ├── pokemon.service.ts
│   │   └── pokemon.module.ts
│   ├── search/               # Search module
│   ├── team/                 # Team module
│   └── main.ts               # Application entry point
├── data/                     # Data files (place pokemons.json here)
├── docker-compose.yml        # PostgreSQL container
├── .env                      # Environment variables
└── README.md
```

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting & Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Database Management

```bash
# View PostgreSQL logs
docker compose logs -f postgres

# Connect to PostgreSQL
docker compose exec postgres psql -U pokedex -d pokedex

# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d
npm run migration:run
npm run seed
```

## Tech Stack

- **Framework**: NestJS 10.2.10
- **Database**: PostgreSQL 17
- **ORM**: TypeORM 0.3.17
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **HTTP Client**: axios (for PokeAPI)
- **Containerization**: Docker & Docker Compose

## Architecture

### Design Patterns

- **Module-based architecture**: Separated concerns (Pokemon, Search, Team)
- **DTO pattern**: Request/response validation and transformation
- **Repository pattern**: TypeORM repositories for data access
- **JSONB columns**: Flexible storage for complex Pokemon data
- **Eager/lazy loading**: Optimized relationship queries

### Database Schema

**pokemons**
- `id` (integer, PK): Pokémon ID from PokeAPI
- `name` (varchar): Pokémon name
- `sprites` (jsonb): Image URLs
- `types` (jsonb): Array of type objects
- `stats` (jsonb): HP, Attack, Defense, etc.
- `abilities` (jsonb): Pokémon abilities
- `moves` (jsonb): Learnable moves
- `height`, `weight` (integer)

**teams**
- `id` (integer, PK, auto-increment)
- `name` (varchar): Team name

**team_pokemons** (junction table)
- `teamsId` (integer, FK → teams.id)
- `pokemonsId` (integer, FK → pokemons.id)
- Many-to-many relationship with CASCADE delete/update

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5433 |
| `DB_USERNAME` | Database username | pokedex |
| `DB_PASSWORD` | Database password | pokedex123 |
| `DB_DATABASE` | Database name | pokedex |
| `NODE_ENV` | Environment | development |
| `PORT` | API server port | 3000 |

## Troubleshooting

### Port Conflicts

If port 5433 is already in use, update `docker-compose.yml` and `.env`:

```yaml
# docker-compose.yml
ports:
  - "5434:5432"  # Change left port
```

```env
# .env
DB_PORT=5434
```

### Migration Issues

If migrations fail:

```bash
# Check migration status
npm run typeorm -- migration:show -d src/config/database.config.ts

# Manual migration table reset (DANGEROUS)
docker compose exec postgres psql -U pokedex -d pokedex -c "DROP TABLE IF EXISTS typeorm_metadata, migrations CASCADE;"
```

### Import Errors

**Seed command fails:**
- Ensure `data/pokemons.json` exists
- Verify JSON format matches PokeAPI structure

**PokeAPI import fails:**
- Check internet connection
- Verify Pokémon name/ID is valid
- Try again (PokeAPI rate limiting)

## License

MIT

## Author

AhmedFatthy1040
