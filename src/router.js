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
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'index',
          component: () => import('./views/index/index.vue'),
          meta: {
            isShowNav: true,
            // isShowHeader: true,
          }
        },
        {
          path: '/preview',
          name: 'preview',
          component: () => import('./views/preview/index.vue'),
          meta: {
            isShowHeader: true,
            title: '预习'
          }
        },
        {
          path: '/addCourse',
          name: 'addCourse',
          component: () => import('./views/preview/addCourse.vue'),
          meta: {
            isShowHeader: true,
            title: '新建课'
          }
        },
        {
          path: '/statistic',
          name: 'statistic',
          component: () => import('./views/preview/statistic.vue'),
        },
        {
          path: '/examView',
          name: 'examView',
          component: () => import('./views/preview/examView.vue'),
        },
        {
          path: '/analyse',
          name: 'analyse',
          component: () => import('./views/preview/analyse.vue'),
          meta: {
            isShowHeader: true,
            title: '试卷分析'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login/Index.vue')
    }
  ]
})
