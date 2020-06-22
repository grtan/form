import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home')
  },
  {
    path: '/list',
    name: 'list',
    component: () => import(/* webpackChunkName: "list" */ '../views/list')
  },
  {
    path: '/gen',
    component: () => import(/* webpackChunkName: "gen" */ '../generator/index')
  }
]

const router = new VueRouter({
  routes
})

export default router
