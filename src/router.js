import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      // component: () => import('./views/login/Index.vue')
      redirect: '/login',
      children: [
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login/Index.vue')
    }
  ]
})
