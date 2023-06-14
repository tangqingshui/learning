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
    path: '/vform',
    name: 'Vform',
    component: () => import('../views/vForm/vForm.vue')
  },
  {
    path: '/comControl',
    name: 'ComControl',
    component: () => import('../views/shiyan/comControl1.vue')
  },
  {
    path: '/comTable',
    name: 'ComTable',
    component: () => import('../views/comTable/comTable.vue')
  },
  {
    path: '/didaima',
    name: 'Didaima',
    component: () => import('../views/didaima/aa.vue')
  },
  {
    path: '/dtcol',
    name: 'Dtcol',
    component: () => import('../views/didaima/aa.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
