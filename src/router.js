import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      // component: () => import('./views/login/index.vue'),
      redirect: '/login',
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
        },
        {
          path: '/resource',
          name: 'resource',
          component: () => import('./views/resource/index.vue'),
          meta: {
            isShowHeader: true,
            title: '资源'
          }
        },
        {
          path: '/lessonList',
          name: 'lessonList',
          component: () => import('./views/resource/lessonList.vue'),
          meta: {
            isShowHeader: true,
            title: '微课'
          }
        },
        {
          path: '/uploadLesson',
          name: 'uploadLesson',
          component: () => import('./views/resource/uploadLesson.vue'),
          meta: {
            isShowHeader: true,
            title: '上传微课'
          }
        },
        {
          path: '/teamSelect',
          name: 'teamSelect',
          component: () => import('./views/resource/teamSelect.vue'),
          meta: {
            isShowHeader: true,
            title: '选择发布范围'
          }
        },
        {
          path: '/taskDetail',
          name: 'taskDetail',
          component: () => import('./views/resource/taskDetail.vue'),
          meta: {
            isShowHeader: true,
            title: '任务详情'
          }
        },
        {
          path: '/materialList',
          name: 'materialList',
          component: () => import('./views/resource/materialList.vue'),
          meta: {
            isShowHeader: true,
            title: '素材'
          }
        },
        {
          path: '/uploadImg',
          name: 'uploadImg',
          component: () => import('./views/resource/uploadImg.vue'),
          meta: {
            isShowHeader: true,
            title: '上传图片'
          }
        },
        {
          path: '/uploadWare',
          name: 'uploadWare',
          component: () => import('./views/resource/uploadWare.vue'),
          meta: {
            isShowHeader: true,
            title: '上传课件'
          }
        },
        {
          path: '/examList',
          name: 'examList',
          component: () => import('./views/resource/examList.vue'),
          meta: {
            isShowHeader: true,
            title: '试卷'
          }
        },
        {
          path: '/questionList',
          name: 'questionList',
          component: () => import('./views/resource/questionList.vue'),
          meta: {
            isShowHeader: true,
            title: '试题'
          }
        },
        {
          path: '/discussList',
          name: 'discussList',
          component: () => import('./views/resource/discussList.vue'),
          meta: {
            isShowHeader: true,
            title: '讨论'
          }
        },
        {
          path: '/discussDetail',
          name: 'discussDetail',
          component: () => import('./views/resource/discussDetail.vue'),
          meta: {
            isShowHeader: true,
            title: '讨论详情'
          }
        },
        {
          path: '/spokenList',
          name: 'spokenList',
          component: () => import('./views/resource/spokenList.vue'),
          meta: {
            isShowHeader: true,
            title: '口语'
          }
        },
        {
          path: '/spokenDetail',
          name: 'spokenDetail',
          component: () => import('./views/resource/spokenDetail.vue')
        },
        {
          path: '/examDetail',
          name: 'examDetail',
          component: () => import('./views/resource/examDetail.vue')
        },
        {
          path: '/materialDetail',
          name: 'materialDetail',
          component: () => import('./views/resource/materialDetail.vue')
        },
        {
          path: '/addTask',
          name: 'addTask',
          component: () => import('./views/resource/addTask.vue')
        },
        {
          path: '/inClass',
          name: 'inClass',
          component: () => import('./views/inClass/index.vue'),
          meta: {
            isShowHeader: true,
            title: '课中'
          }
        },
        {
          path: '/lectureList',
          name: 'lectureList',
          component: () => import('./views/inClass/lectureList.vue'),
          meta: {
            isShowHeader: true,
            title: '讲义'
          }
        },
        {
          path: '/boardList',
          name: 'boardList',
          component: () => import('./views/inClass/boardList.vue'),
          meta: {
            isShowHeader: true,
            title: '白板'
          }
        },
        {
          path: '/classStatList',
          name: 'classStatList',
          component: () => import('./views/inClass/classStatList.vue'),
          meta: {
            isShowHeader: true,
            title: '堂测统计'
          }
        },
        {
          path: '/boardDetail',
          name: 'boardDetail',
          component: () => import('./views/inClass/boardDetail.vue')
        },
        {
          path: '/resCentre',
          name: 'resCentre',
          component: () => import('./views/resCentre/index.vue'),
          meta: {
            isShowNav: true
          }
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login/index.vue')
    },
    {
      path: '/forgetPwd',
      name: 'forgetPwd',
      component: () => import('./views/login/forgetPwd.vue')
    },
    {
      path: '/resetPwd',
      name: 'resetPwd',
      component: () => import('./views/login/resetPwd.vue')
    },{
      path: '/mine',
      name: 'mine',
      component: () => import('./views/mine/index.vue'),
      meta: {
        isShowNav: true,
      }
    },
  ]
})
