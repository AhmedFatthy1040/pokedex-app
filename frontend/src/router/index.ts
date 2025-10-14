import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pokedex',
      component: () => import('../views/PokedexView.vue'),
      meta: { title: 'Pokédex' },
    },
    {
      path: '/pokemon/:id',
      name: 'pokemon-detail',
      component: () => import('../views/PokemonDetailView.vue'),
      meta: { title: 'Pokemon Detail' },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { title: 'Favorites' },
    },
  ],
})

// Update page title based on route meta
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || 'Pokédex'
  next()
})

export default router

