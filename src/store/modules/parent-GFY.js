const state = {
  version: 'V1.0.0',
  $userInfo: null,
  currTermType: null,
  subjectList: null,
  subjectType: null,
  currClassId: null,
  noticList: null,
  collectionObject: null,

  /**最新的**/
  allStuList: null,
  allSchoolList: null,
  allClassList: null,
  newCurStu: null,
  newCurSchool: null,
  newCurClass: null,
  loadSubjectList: true,
  loadStatic: true,
  wkNav: 'C03',
  staticNav: 1,

  userCount: {
    userLevel: null,
    userCoins: null,
    userCourseCount: null,
    userTaskCount: null,
  },
  imgList: null,
  lectureList: null,
  activityList: null,
  showComment: false,
  showWriteBt: false,
  showAnswer: false,
  feedBackList: [],
  oprType: true,
  contentType: 'preview',
  resourceType: 'wk',
  optType: true,
  contentType1: 'study',

  /**错题本***/
  listChild: null,
  listParent: null,
  tipBookSubjectList: null,

  /******课程模块************/
  courseSubjectList: [],  // 学科列表
  courseList: [], // 学生课程列表
  courseSubject: '',

  /****首页任务*****/
  childList: [],

  taskTypeList: {
    'T01': '微课+试卷',
    'T02': '微课+心得',
    'T03': '测试',
    'T04': '学资源',
    'T04_1':'学资源+心得',
    'T04_2':'学资源+试卷',
    'T05': '自测',
    'T06': '讨论',
    'T07': '直播课',
    'T08': '做题',
    'T09': '白板',
    'T10': '随堂测验',
    'T11': '自主学习',
    'T12': 'CRM检测',
    'T13': '口语评测',
    'T14': '游戏关卡',
    'T15': '关卡口语评测'
  },
  GradeLevel: {
    'G01': '一年级',
    'G02': '二年级',
    'G03': '三年级',
    'G04': '四年级',
    'G05': '五年级',
    'G06': '六年级',
    'G07': '初一',
    'G08': '初二',
    'G09': '初三',
    'G09&1': '中考总复习',
    'G10': '高一',
    'G11': '高二',
    'G12': '高三',
    'G99': '所有年级',
  },
  JFType: {
    'O01': '	用户登录',
    'O02': '	用户任务完成',
    'O03': '	用户课堂表现',
    'O04': '	用户课外学习',
    'O05': '	课程创建',
    'O06': '	课程任务创建',
    'O07': '	资源上传',
    'O08': '	资源共享',
    'O09': '	信息发布',
    'O10': '	资源收藏',
    'O11': '	资源创建',
    'O12': '	资源被使用',
    'O13': '	微课任务',
    'O14': '	测验',
    'O15': '	做题',
    'O16': '	习惯方法训练营报名',
    'O17': '	刷错题本',
    'O18': '	学生做题正确率',
    'O19': '	上传微课',
    'O20': '	上传试卷',
    'O21': '	上传试题',
    'O22': '	上传其他课件',
    'O23': '	共享课程被使用',
    'O24': '	微课被使用',
    'O25': '	课件被使用',
    'O26': '	试题被使用',
    'O27': '	试卷被使用',
    'O28': '	共享课程',
    'O29': '	组卷',
    'O30': '	训练营报名',
    'O31': '	做卷正确率（高）',
    'O32': '做卷正确率（偏高）',
    'O33': '	刷错题本(高)',
    'O34': '	刷错题本(高)',
    'O35': '	创建试题',
    'O36': '	创建试卷',
    'O37': '	课程讨论',
    'O38': '	做卷正确率',
    'O39': '	刷错题本',
    'O40': '	游戏关卡测试任务',
    'O41': '	参与评价',
    'O42': '	手动调整',
  },
  eventType: {
    'R01': '审批',
    'R02': '跟进',
    'R03': '审批',
    'R06': '到期',
    'R04': '积分',
    'R51': '积分',
    'R52': '任务',
    'R53': '纠错',
    'R54': '资源',
    'R55': '作业',
    'R56': '任务',
    'R57': '点名',
    'R58': '反馈',
  },
  eventTypeDeatil: {
    'R01': '审批提醒',
    'R02': '跟进客户提醒',
    'R03': '审批结束提醒',
    'R06': '到期学员提醒',
    'R51': '积分奖励提醒',
    'R52': '批改任务提醒',
    'R53': '纠错提醒',
    'R54': '资源被使用提醒',
    'R55': '作业通知提醒',
    'R56': '完成任务提醒',
    'R57': '上课点名提醒',
    'R58': '问题反馈提醒',
  },
  examQuestionType: {
    'T01': '单选题',
    'T02': '多选题',
    'T03': '判断题',
    'T04': '填空题',
    'T05': '计算题',
    'T06': '阅读题',
    'T08': '作文',
    'T10': '解答题',
    'T11': '单词拼写',
    'T12': '完成句子',
    'T13': '形式填空',
    'T14': '翻译',
    'T15': '单项选择',
    'T16': '完形填空',
    'T17': '阅读理解',
    'T18': '配对阅读',
    'T19': '短文填空',
    'T20': '读写综合',
    'T21': '听力理解',
    'T23': '作图题',
    'T24': '综合能力题',
    'T25': '实验探究题',
    'T26': '推断题',
    'T28': '文言文阅读',
    'T31': '简答题',
    'T32': '古诗文默写',
    'T34': '连词成句',
    'T36': '论述题',
    'T37': '材料解析题',
    'T40': '诗歌鉴赏',
    'T41': '诗词鉴赏',
    'T42': '图文材料题',
    'T43': '语言表达',
    'T44': '分析说明题',
    'T45': '综合探究题',
    'T46': '辨析题',
    'T47': '用所给单词的适当形式填空',
    'T48': '名著导读',
    'T49': '基础题',
    'T50': '名篇名句默写',
    'T51': '短文改错',
    'T97': '实验题',
  },
  reviewTestType:{
    'T01': '真题',
    'T02': '模拟题',
    'T31': '预测',
    'M03': '期中',
    'M04': '期末',
    'M01': '练习卷',
    'M02': '练习卷',
  },
  // 家长圈-测试页面
  decrition: '',
  title: '',
  psyDetectionId: '',
  psyProjectType: '',
  psyScoreType: '',
  psyAge: '', //用户年龄
  detectionPersonal: '',//检测人姓名
  detectionPhone: '',//检测人电话
  psychologyResult: {},//心理测试结果
  psyDuration: 0,//答题时长
  groupInfo: []
}

const mutations = {
  SET_LOGININFO (state, data) {
    if (data && data.birthDate) {
      data.birthDate = data.birthDate.replace(/-/g, '/')
    }
    state.$userInfo = data

    window.localStorage.removeItem('$userInfo')
    window.localStorage.setItem('$userInfo', JSON.stringify(data))
  },
  SET_USERCOUNT (state, data) {
    state.userCount = data
    // window.localStorage.removeItem("userCount");
    // window.localStorage.setItem("userCount",JSON.stringify(data));
  },

  SET_CURRTERMTYPE (state, data) {
    state.currTermType = data
    window.localStorage.removeItem('currTermType')
    window.localStorage.setItem('currTermType', JSON.stringify(data))
  },
  //
  SET_SUBJECTLIST (state, data) {

    state.subjectList = data
    window.localStorage.removeItem('subjectList')
    window.localStorage.setItem('subjectList', JSON.stringify(data))
  },
  SET_SUBJECTTYPE (state, data) {
    state.subjectType = data
    state.loadStatic = !state.loadStatic
    window.localStorage.removeItem('subjectType')
    window.localStorage.setItem('subjectType', JSON.stringify(data))
  },

  SET_CURRCLASSID (state, data) {
    state.currClassId = data
    state.loadSubjectList = !state.loadSubjectList
    window.localStorage.removeItem('currClassId')
    window.localStorage.setItem('currClassId', JSON.stringify(data))
  },
  SET_COLLECTIONOBJECT (state, data) {
    state.collectionObject = data
    window.localStorage.removeItem('collectionObject')
    window.localStorage.setItem('collectionObject', JSON.stringify(data))
  },

  SET_allStuList (state, data) {
    state.allStuList = data
    window.localStorage.removeItem('allStuList')
    window.localStorage.setItem('allStuList', JSON.stringify(data))
  },
  SET_allSchoolList (state, data) {
    state.allSchoolList = data
    window.localStorage.removeItem('allSchoolList')
    window.localStorage.setItem('allSchoolList', JSON.stringify(data))
  },
  SET_allClassList (state, data) {
    state.allClassList = data
    window.localStorage.removeItem('allClassList')
    window.localStorage.setItem('allClassList', JSON.stringify(data))
  },

  SET_newCurStu (state, data) {
    state.newCurStu = data
    window.localStorage.removeItem('newCurStu')
    window.localStorage.setItem('newCurStu', JSON.stringify(data))
  },
  SET_newCurSchool (state, data) {
    state.newCurSchool = data
    window.localStorage.removeItem('newCurSchool')
    window.localStorage.setItem('newCurSchool', JSON.stringify(data))
  },
  SET_newCurClass (state, data) {
    state.newCurClass = data
    window.localStorage.removeItem('newCurClass')
    window.localStorage.setItem('newCurClass', JSON.stringify(data))
  },

  SET_loadSubjectList (state, data) {
    state.loadSubjectList = data
    window.localStorage.removeItem('loadSubjectList')
    window.localStorage.setItem('loadSubjectList', JSON.stringify(data))
  },
  SET_wkNav (state, data) {
    state.wkNav = data
    window.localStorage.removeItem('wkNav')
    window.localStorage.setItem('wkNav', JSON.stringify(data))
  },
  SET_staticNav (state, data) {
    state.staticNav = data
    window.localStorage.removeItem('staticNav')
    window.localStorage.setItem('staticNav', JSON.stringify(data))
  },

  SET_showCommentFlag (state, data) {
    console.log('SET_showCommentFlag：' + data)
    state.showCommentFlag = data
    window.localStorage.removeItem('showCommentFlag')
    window.localStorage.setItem('SET_showCommentFlag', JSON.stringify(data))
  },

  SET_imgList (state, data) {
    state.imgList = data
    window.localStorage.removeItem('imgList')
    window.localStorage.setItem('imgList', JSON.stringify(data))
  },

  SET_lectureList (state, data) {
    state.lectureList = data
    window.localStorage.removeItem('lectureList')
    window.localStorage.setItem('lectureList', JSON.stringify(data))
  },

  SET_activityList (state, data) {
    state.activityList = data
    window.localStorage.removeItem('activityList')
    window.localStorage.setItem('activityList', JSON.stringify(data))
  },

  SET_showWriteBt (state, data) {
    state.showWriteBt = data
    window.localStorage.removeItem('showWriteBt')
    window.localStorage.setItem('showWriteBt', JSON.stringify(data))
  },

  SET_showComment (state, data) {
    state.showComment = data
    window.localStorage.removeItem('showComment')
    window.localStorage.setItem('showComment', JSON.stringify(data))
  },

  SET_showAnswer (state, data) {
    state.showAnswer = data
    window.localStorage.removeItem('showAnswer')
    window.localStorage.setItem('showAnswer', JSON.stringify(data))
  },

  //数据初始化
  SET_clear (state) {
    state.$userInfo = null
    state.currTermType = null
    state.subjectList = null
    state.subjectType = null
    state.currClassId = null
    state.noticList = null
    state.collectionObject = null
    state.allStuList = null
    state.allSchoolList = null
    state.allClassList = null
    state.newCurStu = null
    state.newCurSchool = null
    state.newCurClass = null
    state.loadSubjectList = true
    state.loadStatic = true
    state.wkNav = 'C03'
    state.staticNav = 1
    state.userCount.userLevel = null
    state.userCount.userCoins = null
    state.userCount.userCourseCount = null
    state.userCount.userTaskCount = null
    state.imgList = []
    state.lectureList = []
    state.activityList = []
    state.imgList = null
    state.lectureList = null
    state.activityList = null
    state.showComment = false
    state.showWriteBt = false
    state.showAnswer = false
    state.feedBackList = []
    state.oprType = true
    state.contentType = 'preview'
    state.resourceType = 'wk'
    state.optType = true
    state.contentType1 = 'study'
    state.listChild = null
    state.listParent = null
    state.tipBookSubjectList = null
    state.courseSubjectList = []  // 学科列表
    state.courseList = [] // 学生课程列表
    state.courseSubject = ''
    state.childList = []
  },
  DESCRITION (state, decrition) {
    state.decrition = decrition
  },
  TITLE (state, title) {
    state.title = title
  },
  PSY_detectionId (state, psyDetectionId) {
    state.psyDetectionId = psyDetectionId
  },
  PSY_projectType (state, psyProjectType) {
    state.psyProjectType = psyProjectType
  },
  PSY_scoreType (state, psyScoreType) {
    state.psyScoreType = psyScoreType
  },
  PSY_duration (state, psyDuration) {
    state.psyDuration = psyDuration
  },
  PSY_ChologyResult (state, psychologyResult) {
    state.psychologyResult = psychologyResult
  },
  PSY_age (state, psyAge) {
    state.psyAge = psyAge
  },
  PSY_DetectionPersonal (state, psyDetectionPersonal) {
    state.detectionPersonal = psyDetectionPersonal
  },
  PSY_DetectionPhone (state, psyDetectionPhone) {
    state.detectionPhone = psyDetectionPhone
  },
  PSY_GroupInfo (state, psyGroupInfo) {
    state.groupInfo = psyGroupInfo
  }
}

const actions = {
  decriTion (context, decrition) {
    context.commit('DESCRITION', decrition)
  },
  titLe (context, title) {
    context.commit('TITLE', title)
  },
  psyDetectionId (context, psyDetectionId) {
    context.commit('PSY_detectionId', psyDetectionId)
  },
  psyProjectType (context, psyProjectType) {
    context.commit('PSY_projectType', psyProjectType)
  },
  psyScoreType (context, psyScoreType) {
    context.commit('PSY_scoreType', psyScoreType)
  },
  psyDuration (context, psyDuration) {
    context.commit('PSY_duration', psyDuration)
  },
  psyChologyResult (context, psyChologyResult) {
    context.commit('PSY_ChologyResult', psyChologyResult)
  },
  psyAge (context, psyAge) {
    context.commit('PSY_age', psyAge)
  },
  psyDetectionPersonal (context, psyDetectionPersonal) {
    context.commit('PSY_DetectionPersonal', psyDetectionPersonal)
  },
  psyDetectionPhone (context, psyDetectionPhone) {
    context.commit('PSY_DetectionPhone', psyDetectionPhone)
  },
  psyGroupInfo (context, groupInfo) {
    context.commit('PSY_GroupInfo', groupInfo)
  }
}

const getters = {
  GET_LOGININFO (state) {
    let userInfo = state.$userInfo
    if (!userInfo) {
      userInfo = JSON.parse(window.localStorage.getItem('$userInfo') || null)
    }
    return userInfo
  },
  GET_USERCOUNT (state) {
    let userCount = state.userCount
    // if (!userCount) {
    //   userCount = JSON.parse(window.localStorage.getItem('userCount') || null)
    // }
    return userCount
  },

  GET_CURRTERMTYPE (state) {
    let currTermType = state.currTermType
    if (!currTermType) {
      currTermType = JSON.parse(window.localStorage.getItem('currTermType') || null)
    }
    return currTermType
  },
  GET_SUBJECTLIST (state) {
    let subjectList = state.subjectList
    if (!subjectList) {
      subjectList = JSON.parse(window.localStorage.getItem('subjectList') || null)
    }
    return subjectList
  },
  GET_SUBJECTTYPE (state) {
    let subjectType = state.subjectType
    if (!subjectType) {
      subjectType = JSON.parse(window.localStorage.getItem('subjectType') || null)
    }
    return subjectType
  },

  GET_CURRCLASSID (state) {
    let currClassId = state.currClassId
    if (!currClassId) {
      currClassId = JSON.parse(window.localStorage.getItem('currClassId') || null)
    }
    return currClassId
  },
  GET_COLLECTIONOBJECT (state) {
    let collectionObject = state.collectionObject
    if (!collectionObject) {
      collectionObject = JSON.parse(window.localStorage.getItem('collectionObject') || null)
    }
    return collectionObject
  },

  GET_allStuList (state) {
    let allStuList = state.allStuList
    if (!allStuList) {
      allStuList = JSON.parse(window.localStorage.getItem('allStuList') || null)
    }
    return allStuList
  },

  GET_allSchoolList (state) {
    let allSchoolList = state.allSchoolList
    if (!allSchoolList) {
      allSchoolList = JSON.parse(window.localStorage.getItem('allSchoolList') || null)
    }
    return allSchoolList
  },

  GET_allClassList (state) {
    let allClassList = state.allClassList
    if (!allClassList) {
      allClassList = JSON.parse(window.localStorage.getItem('allClassList') || null)
    }
    return allClassList
  },

  GET_newCurStu (state) {
    let newCurStu = state.newCurStu
    if (!newCurStu) {
      newCurStu = JSON.parse(window.localStorage.getItem('newCurStu') || null)
    }
    return newCurStu
  },

  GET_newCurSchool (state) {
    let newCurSchool = state.newCurSchool
    if (!newCurSchool) {
      newCurSchool = JSON.parse(window.localStorage.getItem('newCurSchool') || null)
    }
    return newCurSchool || {}
  },

  GET_newCurClass (state) {
    let newCurClass = state.newCurClass
    if (!newCurClass) {
      newCurClass = JSON.parse(window.localStorage.getItem('newCurClass') || null)
    }
    return newCurClass
  },

  GET_loadSubjectList (state) {
    let loadSubjectList = state.loadSubjectList
    if (!loadSubjectList) {
      loadSubjectList = JSON.parse(window.localStorage.getItem('loadSubjectList') || null)
    }
    return loadSubjectList
  },
  GET_wkNav (state) {
    let wkNav = state.wkNav
    if (!wkNav) {
      wkNav = JSON.parse(window.localStorage.getItem('wkNav') || null)
    }
    return wkNav
  },
  GET_staticNav (state) {
    let staticNav = state.staticNav
    if (!staticNav) {
      staticNav = JSON.parse(window.localStorage.getItem('staticNav') || null)
    }
    return staticNav
  },

  GET_showCommentFlag (state) {

    let showCommentFlag = state.showCommentFlag
    /*if (!showCommentFlag) {
      showCommentFlag = JSON.parse(window.localStorage.getItem('showCommentFlag') || null)
    }*/
    console.log('GET_showCommentFlag', showCommentFlag)
    return showCommentFlag
  },

  GET_imgList (state) {

    let imgList = state.imgList
    if (!imgList) {
      imgList = JSON.parse(window.localStorage.getItem('imgList') || null)
    }
    return imgList
  },
  GET_lectureList (state) {

    let lectureList = state.lectureList
    if (!lectureList) {
      lectureList = JSON.parse(window.localStorage.getItem('lectureList') || null)
    }
    return lectureList
  },
  GET_activityList (state) {

    let activityList = state.activityList
    if (!activityList) {
      activityList = JSON.parse(window.localStorage.getItem('activityList') || null)
    }
    return activityList
  },

  GET_showComment (state) {

    let showComment = state.showComment
    if (!showComment) {
      showComment = JSON.parse(window.localStorage.getItem('showComment') || null)
    }
    return showComment
  },
  GET_showWriteBt (state) {

    let showWriteBt = state.showWriteBt
    if (!showWriteBt) {
      showWriteBt = JSON.parse(window.localStorage.getItem('showWriteBt') || null)
    }
    return showWriteBt
  },
  GET_showAnswer (state) {
    let showAnswer = state.showAnswer
    if (!showAnswer) {
      showAnswer = JSON.parse(window.localStorage.getItem('showAnswer') || null)
    }
    return showAnswer
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
