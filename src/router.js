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
          path: '/questionDetail',
          name: 'questionDetail',
          component: () => import('./views/resource/questionDetail.vue')
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
        {
          path: '/mine',
          name: 'mine',
          component: () => import('./views/mine/index.vue'),
          meta: {
            isShowNav: true
          }
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('./views/mine/userInfo.vue'),
          meta: {
            isShowHeader: true,
            title: '个人信息'
          }
        },
        {
          path: '/shop',
          name: 'shop',
          component: () => import('./views/mine/shop/index.vue'),
          // meta: {
          //   isShowHeader: true,
          //   title: '积分商城'
          // }
        },
        // {
        //   path: '/convertRule',
        //   name: 'convertRule',
        //   component: () => import('./views/mine/shop/convertRule.vue'),
        // },
        // {
        //   path: '/goodsDetail/:id',
        //   name: 'goodsDetail',
        //   component: () => import('./views/mine/shop/goodsDetail.vue'),
        // },
        // {
        //   path: '/myCollect',
        //   name: 'myCollect',
        //   component: () => import('./views/mine/shop/myCollect.vue'),
        //   meta: {
        //     isShowHeader: true,
        //     title: '我的收藏'
        //   }
        // },
        // {
        //   path: '/converseRecord',
        //   name: 'converseRecord',
        //   component: () => import('./views/mine/shop/converseRecord.vue'),
        //   meta: {
        //     isShowHeader: true,
        //     title: '兑换记录'
        //   }
        // },
        {
          path: '/help',
          name: 'help',
          component: () => import('./views/mine/help.vue'),
          meta: {
            isShowHeader: true,
            title: '使用帮助'
          }
        },
        {
          path: '/myLevel',
          name: 'myLevel',
          component: () => import('./views/mine/myLevel.vue'),
          // meta: {
          //   isShowHeader: true,
          //   title: '我的等级'
          // }
        },
        {
          path: '/myLangCoin',
          name: 'myLangCoin',
          component: () => import('./views/mine/myLangCoin.vue'),
          meta: {
            isShowHeader: true,
            title: '我的朗币'
          }
        },
        {
          path: '/myNotice',
          name: 'myNotice',
          component: () => import('./views/mine/myNotice.vue'),
          meta: {
            isShowHeader: true,
            title: '我的提醒'
          }
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('./views/mine/setting/index.vue'),
          meta: {
            isShowHeader: true,
            title: '个人设置'
          }
        },
        {
          path: '/modifyPhoneNo',
          name: 'modifyPhoneNo',
          component: () => import('./views/mine/setting/modifyPhoneNo.vue'),
          meta: {
            isShowHeader: true,
            title: '修改手机号'
          }
        },
        {
          path: '/modifyPassword',
          name: 'modifyPassword',
          component: () => import('./views/mine/setting/modifyPassword.vue'),
          meta: {
            isShowHeader: true,
            title: '修改密码'
          }
        },
        {
          path: '/service',
          name: 'service',
          component: () => import('./views/mine/service.vue'),
          meta: {
            isShowHeader: true,
            title: '为您服务'
          }
        },
        {
          path: '/feedback',
          name: 'feedback',
          component: () => import('./views/mine/feedback/index.vue'),
          // meta: {
          //   isShowHeader: true,
          //   title: '意见反馈'
          // }
        },
        {
          path: '/feedbackList',
          name: 'FeedbackList',
          component: () => import('./views/mine/feedback/feedbackList.vue'),
          meta: {
            isShowHeader: true,
            title: '问题反馈',
          },
        },
        {
          path: '/feedbackDetail',
          name: 'FeedbackDetail',
          component: () => import('./views/mine/feedback/feedbackDetail.vue'),
          meta: {
            isShowHeader: true,
            title: '反馈详情',
          }
        },
        {
          path: '/unfinishTaskList',
          name: 'unfinishTaskList',
          component: () => import('./views/index/unfinishTaskList.vue'),
          meta: {
            isShowHeader: true,
            title: '未结束任务'
          }
        },
        {
          path: '/myCourseList',
          name: 'myCourseList',
          component: () => import('./views/myCourse/index.vue')
        },
        {
          path: '/courseDetail',
          name: 'courseDetail',
          component: () => import('./views/myCourse/courseDetail.vue')
        },
        {
          path: '/myClassList',
          name: 'myClassList',
          component: () => import('./views/myClass/index.vue'),
          meta: {
            isShowHeader: true,
            title: '我的班级'
          }
        },
        {
          path: '/classDetail',
          name: 'classDetail',
          component: () => import('./views/myClass/classDetail.vue')
        },
        {
          path: '/addGroup',
          name: 'addGroup',
          component: () => import('./views/myClass/addGroup.vue'),
          meta: {
            isShowHeader: true,
            title: '新建小组'
          }
        },
        {
          path: '/',
          component: () => import('./views/teachStat/index.vue'),
          children: [
            {
              path: '/teachStat',
              name: 'teachStat',
              component: () => import('./views/teachStat/teachStat.vue'),
              meta: {
                isShowHeader: true,
                title: '教学统计'
              },
            },
            {
              path: '/taskStat',
              name: 'taskStat',
              component: () => import('./views/teachStat/taskStat.vue'),
              meta: {
                isShowHeader: true,
                title: '任务统计'
              },
            },
          ]
        },
        {
          path: '/copyGroup',
          name: 'copyGroup',
          component: () => import('./views/myClass/copyGroup.vue')
        },
        {
          path: '/groupDetail',
          name: 'groupDetail',
          component: () => import('./views/myClass/groupDetail.vue')
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
    },
  ]
})
