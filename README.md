# 🎮 Pokedex Backend API

REST API for managing the original 151 Pokemon. Built with NestJS, TypeScript, and PostgreSQL.

## 🚀 Features

- ✅ Browse all 151 Pokemon with sorting and pagination
- ✅ Search Pokemon by name or type
- ✅ Detailed Pokemon information (stats, abilities, moves)
- ✅ Manage Pokemon teams (max 6 per team)
- ✅ Bearer token authentication for team routes
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
```

6. **Start the application:**
```bash
npm run start:dev
```

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
npm run import:pokemon 25       # Import Pikachu from PokeAPI
npm run import:pokemon pikachu  # Import by name
```

### Testing
```bash
npm run test           # Run unit tests
npm run test:watch     # Watch mode
npm run test:cov       # Coverage report
npm run test:e2e       # E2E tests
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
│   ├── pokemon/             # Pokemon module (Phase 2)
│   ├── team/                # Team module (Phase 4)
│   ├── search/              # Search module (Phase 3)
│   ├── commands/            # CLI commands (Phase 6)
│   ├── app.module.ts
│   └── main.ts
├── test/                    # E2E tests
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🔐 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=pokedex

# Application
PORT=3000
NODE_ENV=development

# Auth
AUTH_TOKEN=pokemon-master-token-2024

# External API
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

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

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Commit with clear messages
5. Push and create a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Credits

- Pokemon data from [PokeAPI](https://pokeapi.co/)
- Built with [NestJS](https://nestjs.com/)
- Database: [PostgreSQL](https://www.postgresql.org/)

---

**Happy Coding! 🚀**
