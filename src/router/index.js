import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { showTabbar: true },
  },
  {
    path: '/analyze',
    name: 'Analyze',
    component: () => import('../views/AnalyzePage.vue'),
    meta: { showTabbar: false },
  },
  {
    path: '/poster',
    name: 'Poster',
    component: () => import('../views/PosterPage.vue'),
    meta: { showTabbar: false },
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../views/MapPage.vue'),
    meta: { showTabbar: true },
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('../views/MinePage.vue'),
    meta: { showTabbar: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
