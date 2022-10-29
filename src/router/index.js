import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/lemmein',
    name: 'lemmein',
    component: () => import('../views/LetMeIn.vue')
  },
  {
    path:'/ap',
    name: 'ap tracker',
    component: () => import('../views/APTracker.vue')
  },
  {
    path:'/stats',
    name: 'tracker stats',
    component: () => import('../views/TrackerStats.vue')
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('../views/Events.vue')
  },
  {
    path: '/ep',
    name: 'ep',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EPCalc.vue')
  },
  {
    path: '/exp',
    name: 'exp',
    component: () => import('../views/ExpCalc.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
