# 🎮 Pokedex Backend API

REST API for managing the original 151 Pokemon. Built with NestJS, TypeScript, and PostgreSQL.

## 🚀 Features

- ✅ Browse all 151 Pokemon with sorting and pagination
- ✅ Search Pokemon by name or type
- ✅ Detailed Pokemon information (stats, abilities, moves)
- ✅ Manage Pokemon teams (max 6 per team)
- ✅ Bearer token authentication for team routes
- ✅ Local image storage for Pokemon sprites
- ✅ OpenAPI/Swagger documentation
- ✅ Docker support
- ✅ TypeORM migrations
- ✅ Import commands for seeding data

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose (optional)

## 🛠️ Installation

### Option 1: Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Start PostgreSQL:**
```bash
# Using Docker:
docker-compose up -d postgres

# Or use your local PostgreSQL instance
```

4. **Run migrations (if needed):**
```bash
npm run migration:run
```

5. **Seed database with Pokemon data:**
```bash
npm run seed
# This will:
# - Import all 151 Pokemon from pokemons.json
# - Download sprite images locally to public/images/pokemon/
# - May take a few minutes to download all images
```

6. **Start the application:**
```bash
npm run start:dev
```

The API will be available at http://localhost:3000

### Option 2: Docker Compose

```bash
# Start all services (PostgreSQL + API)
docker-compose up -d

# View logs
docker-compose logs -f app

# Access container to run commands
docker-compose exec app npm run seed
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:3000/api-docs
- **API Base:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

### Testing the API

**Quick Test Commands:**

```bash
# Get all Pokemon
curl http://localhost:3000/api/v1/pokemons

# Get Pikachu details (ID 25)
curl http://localhost:3000/api/v1/pokemons/25

# View Pikachu's sprite image
curl http://localhost:3000/images/pokemon/25-front_default.png --output pikachu.png

# Search for fire-type Pokemon
curl "http://localhost:3000/api/v1/search?query=fire"

# Get paginated results
curl "http://localhost:3000/api/v2/pokemons?limit=10&offset=0"

# Create a team (requires auth)
curl -X POST http://localhost:3000/api/v1/teams \
  -H "Authorization: Bearer pokemon-master-token-2024" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Team","trainerName":"Ash"}'

# Get all teams (requires auth)
curl http://localhost:3000/api/v1/teams \
  -H "Authorization: Bearer pokemon-master-token-2024"
```

## 🔑 API Endpoints

### Pokemon Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/pokemons` | List all Pokemon (with sorting) |
| GET | `/api/v1/pokemons/:id` | Get Pokemon details |
| GET | `/api/v2/pokemons` | Paginated Pokemon list |
| GET | `/api/v1/search?query=fire` | Search by name or type |

**Query Parameters for `/api/v1/pokemons`:**
- `sort`: `name-asc`, `name-desc`, `id-asc`, `id-desc`

**Query Parameters for `/api/v2/pokemons`:**
- `limit`: Number of results (default: 20)
- `offset`: Offset for pagination
- `sort`: Same as v1

### Team Routes (Requires Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/teams` | List all teams |
| POST | `/api/v1/teams` | Create a new team |
| GET | `/api/v1/teams/:id` | Get team details |
| POST | `/api/v1/teams/:id` | Set team Pokemon (max 6) |

**Authentication:**
Add header: `Authorization: Bearer pokemon-master-token-2024`

## 🎯 Commands

### Development
```bash
npm run start:dev       # Start in watch mode
npm run build           # Build for production
npm run start:prod      # Run production build
```

### Database
```bash
npm run migration:generate  # Generate migration
npm run migration:run       # Run migrations
npm run migration:revert    # Revert last migration
```

### Data Import
```bash
npm run seed                    # Import all 151 Pokemon from pokemons.json
                                # Downloads all sprite images automatically
                                
npm run import:pokemon 25       # Import Pikachu from PokeAPI
npm run import:pokemon pikachu  # Import by name
                                # Both commands also download sprite images
```

**Note:** Sprite images are downloaded to `backend/public/images/pokemon/` and served at `/images/pokemon/{id}-{sprite-type}.png`

### Testing
```bash
npm run test           # Run unit tests
npm run test:watch     # Watch mode
npm run test:cov       # Coverage report
npm run test:e2e       # E2E tests
```

**Manual API Testing:**

```bash
# Test Pokemon endpoint
npm run test:api:pokemon

# Or manually:
curl http://localhost:3000/api/v1/pokemons/1 | jq

# Test image serving
curl -I http://localhost:3000/images/pokemon/25-front_default.png

# Test search
curl "http://localhost:3000/api/v1/search?query=pika" | jq

# Test team creation (with auth)
curl -X POST http://localhost:3000/api/v1/teams \
  -H "Authorization: Bearer pokemon-master-token-2024" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Team","trainerName":"Tester"}' | jq
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run format         # Format with Prettier
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.config.ts
│   ├── pokemon/             # Pokemon module
│   │   ├── pokemon.service.ts
│   │   ├── pokemon.controller.ts
│   │   └── entities/
│   ├── team/                # Team module (with auth)
│   │   ├── team.service.ts
│   │   ├── team.controller.ts
│   │   └── entities/
│   ├── search/              # Search module
│   │   ├── search.service.ts
│   │   └── search.controller.ts
│   ├── images/              # Image storage module
│   │   ├── images.service.ts
│   │   └── images.module.ts
│   ├── auth/                # Authentication module
│   │   ├── bearer-auth.guard.ts
│   │   └── bearer.strategy.ts
│   ├── commands/            # CLI commands
│   │   ├── import-pokemon.command.ts
│   │   └── import-seed.command.ts
│   ├── app.module.ts
│   └── main.ts
├── public/
│   └── images/
│       └── pokemon/         # Locally stored sprite images
│           ├── 1-front_default.png
│           ├── 1-front_shiny.png
│           └── ... (auto-generated, git-ignored)
├── test/                    # E2E tests
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🔐 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=pokedex
DB_PASSWORD=pokedex123
DB_DATABASE=pokedex

# Application
PORT=3000
NODE_ENV=development

# Auth
AUTH_TOKEN=pokemon-master-token-2024

# External API
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

**Note:** 
- For **local development**, use the credentials above (PostgreSQL runs on port `5433`)
- For **Docker Compose**, the app service uses different internal credentials (see `docker-compose.yml`)
- The `.env.example` file has the correct local development values

## 🖼️ Image Storage

Pokemon sprite images are automatically downloaded and stored locally during data import:

- **Storage Location:** `backend/public/images/pokemon/`
- **URL Pattern:** `/images/pokemon/{pokemon-id}-{sprite-type}.png`
- **Sprite Types:** 
  - `front_default`, `front_shiny`, `front_female`, `front_shiny_female`
  - `back_default`, `back_shiny`, `back_female`, `back_shiny_female`
  - `official-artwork`, `dream-world`, `home`

**Example URLs:**
- http://localhost:3000/images/pokemon/25-front_default.png (Pikachu normal)
- http://localhost:3000/images/pokemon/25-front_shiny.png (Pikachu shiny)
- http://localhost:3000/images/pokemon/25-official-artwork.png (High-res artwork)

**Note:** Images are excluded from git via `.gitignore` but the directory structure is preserved.

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild
docker-compose up -d --build

# Seed data in Docker
docker-compose exec app npm run seed
```

## 🧪 Verification & Testing

After setup, verify everything works:

### 1. Check Database Connection
```bash
# The app should start without errors
npm run start:dev

# Look for: "Database connected successfully"
```

### 2. Verify Pokemon Data
```bash
# Should return 151 Pokemon
curl http://localhost:3000/api/v1/pokemons | jq '. | length'

# Should return Pikachu's details
curl http://localhost:3000/api/v1/pokemons/25 | jq '.name'
```

### 3. Test Image Storage
```bash
# Check if images directory exists
ls -la backend/public/images/pokemon/ | head -10

# Test image serving (should return 200 OK)
curl -I http://localhost:3000/images/pokemon/25-front_default.png

# Download and view an image
curl http://localhost:3000/images/pokemon/25-official-artwork.png --output pikachu.png
open pikachu.png  # macOS
# or
xdg-open pikachu.png  # Linux
```

### 4. Test Search Functionality
```bash
# Search by name
curl "http://localhost:3000/api/v1/search?query=pikachu" | jq '.[].name'

# Search by type
curl "http://localhost:3000/api/v1/search?query=fire" | jq '.[].name'
```

### 5. Test Authentication
```bash
# Should return 401 Unauthorized
curl http://localhost:3000/api/v1/teams

# Should return 200 OK with empty array
curl http://localhost:3000/api/v1/teams \
  -H "Authorization: Bearer pokemon-master-token-2024"
```

### 6. Test Team Management
```bash
# Create a team
TEAM_ID=$(curl -X POST http://localhost:3000/api/v1/teams \
  -H "Authorization: Bearer pokemon-master-token-2024" \
  -H "Content-Type: application/json" \
  -d '{"name":"Dream Team","trainerName":"Ash"}' \
  | jq -r '.id')

# Add Pokemon to team (max 6)
curl -X POST http://localhost:3000/api/v1/teams/$TEAM_ID \
  -H "Authorization: Bearer pokemon-master-token-2024" \
  -H "Content-Type: application/json" \
  -d '{"pokemonIds":[25,6,9,3,130,149]}'

# View team
curl http://localhost:3000/api/v1/teams/$TEAM_ID \
  -H "Authorization: Bearer pokemon-master-token-2024" | jq
```

### 7. Run Unit Tests
```bash
# All tests should pass
npm run test

# Expected output: 32 passing tests
# - PokemonService: 10 tests
# - SearchService: 12 tests  
# - TeamService: 10 tests
```

### 8. Check Swagger Documentation
Open http://localhost:3000/api-docs in your browser and verify:
- All endpoints are documented
- You can test endpoints directly from Swagger UI
- Authentication is configured for team routes

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Commit with clear messages
5. Push and create a pull request

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps
# or
sudo systemctl status postgresql

# Check database credentials in .env
cat .env | grep DB_
```

### Images Not Loading
```bash
# Check if images directory exists
ls -la backend/public/images/pokemon/

# Re-download images
npm run seed

# Check static file serving
curl -I http://localhost:3000/images/pokemon/1-front_default.png
```

### Import Command Fails
```bash
# Check PokeAPI connectivity
curl https://pokeapi.co/api/v2/pokemon/1

# Clear and re-seed
npm run migration:revert
npm run migration:run
npm run seed
```

### Tests Failing
```bash
# Install dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run specific test file
npm run test -- pokemon.service.spec.ts
```

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Credits

- Pokemon data from [PokeAPI](https://pokeapi.co/)
- Built with [NestJS](https://nestjs.com/)
- Database: [PostgreSQL](https://www.postgresql.org/)

---

**Happy Coding! 🚀**
