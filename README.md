# 🎮 Pokédex Full-Stack Application

A modern, responsive Pokédex application featuring the original 151 Pokémon. Built with Vue 3, NestJS, TypeScript, and PostgreSQL.

## 📱 Live Demo

- **Frontend:** Vue.js web application with mobile-first responsive design
- **Backend:** RESTful API with comprehensive Pokémon data management
- **Features:** Search, filter, favorites, team management, and detailed Pokémon information

## 🚀 Features

### Frontend (Vue.js)
- ✅ Browse all 151 Pokémon with beautiful card-based UI
- ✅ Real-time search by name, number, or type
- ✅ Sort Pokémon by ID or name (ascending/descending)
- ✅ Detailed Pokémon view with stats, abilities, and moves
- ✅ Image lightbox with zoom (1x-4x) and pan functionality
- ✅ Mark Pokémon as favorites with persistent storage
- ✅ Dedicated favorites page with remove/clear all
- ✅ Offline support with localStorage caching
- ✅ Mobile-first responsive design
- ✅ Loading states and error handling
- ✅ Smooth animations and transitions

### Backend (NestJS)
- ✅ RESTful API for all 151 Pokémon
- ✅ Search by name or type
- ✅ Sorting and pagination
- ✅ Pokémon team management (max 6 per team)
- ✅ Bearer token authentication
- ✅ Local image storage for sprites
- ✅ OpenAPI/Swagger documentation
- ✅ Docker support
- ✅ Comprehensive test coverage (32 passing tests)

## 📋 Prerequisites

- Node.js 20+
- npm or pnpm
- PostgreSQL 16+
- Docker & Docker Compose (optional)

## 🏗️ Tech Stack

### Frontend
- **Framework:** Vue 3.5.22 (Composition API with `<script setup>`)
- **Build Tool:** Vite 7.1.9
- **Routing:** Vue Router 4.5.1
- **State Management:** Pinia 3.0.3
- **Styling:** Tailwind CSS 4.1.14
- **HTTP Client:** Axios 1.12.2
- **Language:** TypeScript 5.9

### Backend
- **Framework:** NestJS 10.2.10
- **Database:** PostgreSQL 17
- **ORM:** TypeORM
- **Authentication:** Passport (Bearer strategy)
- **Testing:** Jest (32 passing tests)
- **Documentation:** Swagger/OpenAPI
- **Language:** TypeScript 5.3

## 🛠️ Installation & Setup

### Quick Start (Recommended)

1. **Clone the repository:**
```bash
git clone <repository-url>
cd pokedex-app
```

2. **Backend Setup:**
```bash
cd app

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start PostgreSQL (using Docker)
docker-compose up -d postgres

# Run migrations
npm run migration:run

# Seed database with all 151 Pokémon
npm run seed

# Start backend server
npm run start:dev
```

Backend will be available at **http://localhost:3000**

3. **Frontend Setup:**
```bash
cd ../web

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at **http://localhost:5173**

### Full Setup Instructions

#### Backend Setup (Detailed)

1. **Navigate to backend:**
```bash
cd app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Start PostgreSQL:**
```bash
# Using Docker:
docker-compose up -d postgres

# Or use your local PostgreSQL instance
```

5. **Run migrations (if needed):**
```bash
npm run migration:run
```

6. **Seed database with Pokemon data:**
```bash
npm run seed
# This will:
# - Import all 151 Pokemon from pokemons.json
# - Download sprite images locally to public/images/pokemon/
# - May take a few minutes to download all images
```

7. **Start the application:**
```bash
npm run start:dev
```

The API will be available at http://localhost:3000

#### Frontend Setup (Detailed)

1. **Navigate to frontend:**
```bash
cd web
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment (optional):**
```bash
# Create .env file if you need to customize the API URL
echo "VITE_API_BASE_URL=http://localhost:3000/api/v1" > .env
```

4. **Start development server:**
```bash
npm run dev
```

The app will be available at http://localhost:5173

5. **Build for production:**
```bash
npm run build
npm run preview
```

### Option 2: Docker Compose (Full Stack)

```bash
# Start all backend services (PostgreSQL + API)
cd app
docker-compose up -d

# View logs
docker-compose logs -f app

# Access container to run commands
docker-compose exec app npm run seed

# For frontend, run locally
cd ../web
npm install
npm run dev
```

## 🎯 Project Structure

```
pokedex-app/
├── app/                        # NestJS Backend API
│   ├── src/
│   │   ├── pokemon/           # Pokemon module
│   │   │   ├── pokemon.service.ts
│   │   │   ├── pokemon.controller.ts
│   │   │   └── entities/
│   │   ├── team/              # Team management module
│   │   │   ├── team.service.ts
│   │   │   ├── team.controller.ts
│   │   │   └── entities/
│   │   ├── search/            # Search functionality
│   │   ├── images/            # Image storage module
│   │   ├── auth/              # Authentication (Bearer)
│   │   ├── commands/          # CLI import commands
│   │   └── config/            # Configuration files
│   ├── public/
│   │   └── images/pokemon/    # Locally stored sprites
│   ├── test/                  # E2E tests
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── package.json
│
├── web/                        # Vue.js Frontend App
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── AppHeader.vue
│   │   │   ├── BottomNavigation.vue
│   │   │   ├── PokemonCard.vue
│   │   │   ├── SearchBar.vue
│   │   │   ├── SortModal.vue
│   │   │   └── ImageLightbox.vue
│   │   ├── views/             # Page components
│   │   │   ├── PokedexView.vue
│   │   │   ├── PokemonDetailView.vue
│   │   │   └── FavoritesView.vue
│   │   ├── stores/            # Pinia state management
│   │   │   ├── pokemon.ts
│   │   │   ├── favorites.ts
│   │   │   └── index.ts
│   │   ├── services/          # API services
│   │   │   ├── api.ts
│   │   │   └── pokemon.service.ts
│   │   ├── router/            # Vue Router
│   │   │   └── index.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── pokemon.ts
│   │   ├── assets/            # CSS and static files
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/                # Static assets
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
└── README.md                  # This file
```

## 📚 API Documentation

### Backend API

Once the backend is running, visit:
- **Swagger UI:** http://localhost:3000/api-docs
- **API Base:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

### Frontend Application

Once the frontend is running:
- **Main App:** http://localhost:5173
- **Pokédex List:** http://localhost:5173/
- **Pokémon Detail:** http://localhost:5173/pokemon/:id
- **Favorites:** http://localhost:5173/favorites

### Testing the API

**Quick Test Commands:**

```bash
# Backend API Tests
# -----------------

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

# Frontend Testing
# ----------------

# The frontend is a web application - test in browser at:
# http://localhost:5173

# Test features:
# 1. Browse Pokémon list
# 2. Search by name, number, or type (e.g., "fire", "25", "pikachu")
# 3. Click filter icon to sort (ID/Name, Asc/Desc)
# 4. Click a Pokémon to view details
# 5. Click the image for lightbox zoom/pan
# 6. Click heart icon to add to favorites
# 7. Navigate to Favorites page via bottom navigation
# 8. Remove or clear all favorites
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

## 🎯 Available Commands

### Backend Commands

#### Development
```bash
cd app
npm run start:dev       # Start in watch mode
npm run build           # Build for production
npm run start:prod      # Run production build
```

#### Database
```bash
npm run migration:generate  # Generate migration
npm run migration:run       # Run migrations
npm run migration:revert    # Revert last migration
```

#### Data Import
```bash
npm run seed                    # Import all 151 Pokémon from pokemons.json
                                # Downloads all sprite images automatically
                                
npm run import:pokemon 25       # Import Pikachu from PokeAPI
npm run import:pokemon pikachu  # Import by name
                                # Both commands also download sprite images
```

#### Testing
```bash
npm run test           # Run unit tests (32 passing)
npm run test:watch     # Watch mode
npm run test:cov       # Coverage report
npm run test:e2e       # E2E tests
npm run lint           # Run ESLint
npm run format         # Format with Prettier
```

### Frontend Commands

```bash
cd web
npm run dev            # Start development server (http://localhost:5173)
npm run build          # Build for production
npm run preview        # Preview production build
npm run type-check     # TypeScript type checking
```

## 🔐 Environment Variables

### Backend (app/.env)

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

### Frontend (.env - Optional)

```env
# API Base URL (defaults to http://localhost:3000/api/v1)
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

The frontend uses Vite's proxy configuration, so you typically don't need to set this.

**Note:** The frontend `.env` file is located at `web/.env`

## 🖼️ Image Storage

Pokemon sprite images are automatically downloaded and stored locally during data import:

- **Storage Location:** `app/public/images/pokemon/`
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

### Backend Only (Recommended for Development)

```bash
cd app

# Start PostgreSQL only
docker-compose up -d postgres

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f postgres
```

### Full Stack (PostgreSQL + Backend API)

```bash
cd app

# Start all services
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

Frontend runs separately with `npm run dev` in the web directory.

## 🧪 Testing & Verification

### Backend Tests

```bash
cd app

# Run all unit tests (32 passing tests)
npm run test

# Run with coverage
npm run test:cov

# Test breakdown:
# - PokemonService: 10 tests
# - SearchService: 12 tests  
# - TeamService: 10 tests
```

### Manual Verification

#### 1. Check Backend Database Connection
```bash
cd app
npm run start:dev

# Look for: "Database connected successfully"
```

#### 2. Verify Pokémon Data
```bash
# Should return 151 Pokémon
curl http://localhost:3000/api/v1/pokemons | jq '. | length'

# Should return Pikachu's details
curl http://localhost:3000/api/v1/pokemons/25 | jq '.name'
```

#### 3. Test Image Storage
```bash
# Check if images directory exists
ls -la app/public/images/pokemon/ | head -10

# Test image serving (should return 200 OK)
curl -I http://localhost:3000/images/pokemon/25-front_default.png

# Download and view an image
curl http://localhost:3000/images/pokemon/25-official-artwork.png --output pikachu.png
```

#### 4. Test Search Functionality
```bash
# Search by name
curl "http://localhost:3000/api/v1/search?query=pikachu" | jq '.[].name'

# Search by type
curl "http://localhost:3000/api/v1/search?query=fire" | jq '.[].name'
```

#### 5. Test Frontend Features

Open http://localhost:5173 and verify:

1. **List View:**
   - All 151 Pokémon display with images, names, numbers, types
   - Search works (try "pika", "25", "fire")
   - Sort modal opens with filter icon
   - Sorting works (ID/Name, Asc/Desc)
   - Loading skeleton shows while fetching

2. **Detail View:**
   - Click any Pokémon card
   - URL updates to `/pokemon/:id`
   - Details show: stats, abilities, moves
   - Image click opens lightbox
   - Zoom controls work (1x-4x)
   - Pan/drag works when zoomed
   - Heart icon toggles favorite status

3. **Favorites:**
   - Navigate via bottom nav (mobile) or navigation
   - Favorites persist after page refresh
   - Remove individual favorites works
   - "Clear All" modal appears and works
   - Empty state shows when no favorites

4. **Responsive Design:**
   - Resize browser window
   - Mobile view shows bottom navigation
   - Desktop view hides bottom navigation
   - Cards and grids adapt to screen size
   - Everything remains readable and accessible

5. **Data Persistence:**
   - Add favorites, refresh page → favorites remain
   - Close and reopen browser → favorites still there
   - Clear browser data → favorites reset

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting:
   ```bash
   # Backend
   cd app
   npm run test
   npm run lint
   
   # Frontend
   cd web
   npm run type-check
   ```
4. Commit with clear messages
5. Push and create a pull request

## ✨ Key Features Implemented

### Frontend Architecture
- ✅ **Vue 3 Composition API** with `<script setup>` syntax
- ✅ **Pinia State Management** for global state (pokemon, favorites)
- ✅ **Vue Router** with dynamic routes (`/pokemon/:id`)
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for utility-first styling
- ✅ **Axios** for HTTP requests with interceptors
- ✅ **localStorage** for offline caching and favorites persistence
- ✅ **Responsive Design** with mobile-first approach
- ✅ **Component-based** architecture (8+ reusable components)
- ✅ **Lifecycle Hooks** (`onMounted`, `watch`, computed properties)
- ✅ **Props & Emits** for parent-child communication
- ✅ **Loading States** with skeleton screens
- ✅ **Error Handling** with retry mechanisms

### Backend Architecture
- ✅ **NestJS Modules** for separation of concerns
- ✅ **TypeORM** for database management
- ✅ **Bearer Authentication** with Passport
- ✅ **Image Storage** with local file system
- ✅ **Swagger/OpenAPI** documentation
- ✅ **Unit Tests** (32 passing tests)
- ✅ **CLI Commands** for data import
- ✅ **Docker Support** for easy deployment

## 🐛 Troubleshooting

### Backend Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps
# or
sudo systemctl status postgresql

# Check database credentials in .env
cat app/.env | grep DB_

# Reset database
cd app
docker-compose down -v
docker-compose up -d postgres
npm run migration:run
npm run seed
```

#### Images Not Loading
```bash
# Check if images directory exists
ls -la app/public/images/pokemon/

# Re-download images
cd app
npm run seed

# Check static file serving
curl -I http://localhost:3000/images/pokemon/1-front_default.png
```

#### Import Command Fails
```bash
# Check PokeAPI connectivity
curl https://pokeapi.co/api/v2/pokemon/1

# Clear and re-seed
cd app
npm run migration:revert
npm run migration:run
npm run seed
```

#### Tests Failing
```bash
cd app

# Install dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run specific test file
npm run test -- pokemon.service.spec.ts
```

### Frontend Issues

#### Dev Server Won't Start
```bash
cd web

# Clear cache and reinstall
rm -rf node_modules .vite package-lock.json
npm install

# Check if port 5173 is available
lsof -i :5173
# Kill process if needed: kill -9 <PID>

# Start server
npm run dev
```

#### API Connection Issues
```bash
# Check if backend is running
curl http://localhost:3000/api/v1/pokemons

# Check browser console for CORS errors
# Backend should have CORS enabled in main.ts

# Verify Vite proxy configuration in vite.config.ts
```

#### Build Errors
```bash
cd web

# Type check
npm run type-check

# Clean build
rm -rf dist
npm run build
```

#### Favorites Not Persisting
```bash
# Check browser localStorage
# Open DevTools > Application > Local Storage > http://localhost:5173
# Should see: pokemon-favorites, pokemons, pokemonDetails

# Clear and test
localStorage.clear()
# Reload page and add favorites again
```

### Common Issues

#### Port Already in Use
```bash
# Backend (port 3000)
lsof -i :3000
kill -9 <PID>

# Frontend (port 5173)
lsof -i :5173
kill -9 <PID>

# PostgreSQL (port 5433)
lsof -i :5433
kill -9 <PID>
```

#### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Credits

- Pokémon data from [PokeAPI](https://pokeapi.co/)
- **Backend:** [NestJS](https://nestjs.com/), [PostgreSQL](https://www.postgresql.org/), [TypeORM](https://typeorm.io/)
- **Frontend:** [Vue.js](https://vuejs.org/), [Vite](https://vitejs.dev/), [Pinia](https://pinia.vuejs.org/), [Tailwind CSS](https://tailwindcss.com/)

## 📸 Screenshots

### Desktop View
- Main Pokédex list with search and sort
- Detailed Pokémon view with stats and abilities
- Image lightbox with zoom functionality
- Favorites page

### Mobile View
- Responsive design with bottom navigation
- Touch-friendly cards and controls
- Mobile-optimized modals and lightbox

---

**Built with ❤️ using Vue 3, NestJS, and TypeScript**

**Happy Coding! 🚀**
