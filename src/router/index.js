import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/lihu',
    name: 'lihu',
    component: () => import('@/views/Lihu/Index.vue')
  },
  {
    path: '/young',
    name: 'young',
    component: () => import('@/views/Young/Index.vue')
  },
  {
    path: '/summary',
    name: 'summary',
    component: () => import('@/views/Summary/Index.vue')
  },
  {
    path: '/record',
    name: 'record',
    component: () => import('@/views/Record/List.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
