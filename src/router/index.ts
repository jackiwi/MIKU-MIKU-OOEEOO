import { createRouter, createWebHistory, RouteComponent } from 'vue-router'
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
    component: () : Promise<RouteComponent> => import('../views/LetMeIn.vue')
  },
  {
    path:'/ap',
    name: 'ap tracker',
    component: () : Promise<RouteComponent> => import('../views/APTracker.vue')
  },
  {
    path:'/stats',
    name: 'tracker stats',
    component: () : Promise<RouteComponent> => import('../views/TrackerStats.vue')
  },
  {
    path: '/events',
    name: 'events',
    component: () : Promise<RouteComponent> => import('../views/Events.vue')
  },
  {
    path: '/ep',
    name: 'ep',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () : Promise<RouteComponent> => import(/* webpackChunkName: "about" */ '../views/EPCalc.vue')
  },
  {
    path: '/exp',
    name: 'exp',
    component: () : Promise<RouteComponent> => import('../views/ExpCalc.vue')
  },
  {
    path: '/resourceCalc',
    name: 'resourceCalc',
    component: () : Promise<RouteComponent> => import('../views/ResourceCalc.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
