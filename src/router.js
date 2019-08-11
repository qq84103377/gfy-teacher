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
          path: '/examAnalyse',
          name: 'examAnalyse',
          component: () => import('./views/preview/examAnalyse.vue'),
          meta: {
            isShowHeader: true,
            title: '试卷分析'
          }
        },
        {
          path: '/subjectAnalyse',
          name: 'subjectAnalyse',
          component: () => import('./views/preview/subjectAnalyse.vue'),
          meta: {
            isShowHeader: true,
            title: '题目分析'
          }
        },
        {
          path: '/stuAnalyse',
          name: 'stuAnalyse',
          component: () => import('./views/preview/stuAnalyse.vue'),
        },
        {
          path: '/addSubScore',
          name: 'addSubScore',
          component: () => import('./views/preview/addSubScore.vue'),
          meta: {
            isShowHeader: true,
            title: '加分/减分'
          }
        },
        {
          path: '/briefing',
          name: 'briefing',
          component: () => import('./views/preview/briefing.vue'),
          meta: {
            isShowHeader: true,
            title: '简报'
          }
        },
        {
          path: '/subjectList',
          name: 'subjectList',
          component: () => import('./views/preview/subjectList.vue'),
          meta: {
            isShowHeader: true,
            title: '题目分析'
          }
        },
        {
          path: '/subjectCorrect',
          name: 'subjectCorrect',
          component: () => import('./views/preview/subjectCorrect.vue')
        },
        {
          path: '/imgCorrect',
          name: 'imgCorrect',
          component: () => import('./views/preview/imgCorrect.vue')
        },
        {
          path: '/spokenAnalyse',
          name: 'spokenAnalyse',
          component: () => import('./views/preview/spokenAnalyse.vue')
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
