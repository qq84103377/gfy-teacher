import * as url from './urlConfig'
import axios from '../utils/http'
import * as qs from 'qs'

export default {}

//用户
export const userApi = {

  /**
   * 批量查询家长信息
   * */

  getParentInfoByIds (param) {
    return axios.post(url.user + '/getParentInfoByIds', qs.stringify(param)).then((respone) => {
      console.log(respone)
      return respone
    })
  },
  /**
   * 登录
   * 已通过
   * **/
  checkUsrLogin (param) {
    return axios.post(url.user + '/checkUsrLogin', qs.stringify(param)).then((respone) => {
      console.log(respone)
      return respone
    })
  },

  /**
   * 登录者的孩子列表
   * 已通过
   * **/
  getChildrenList (param) {
    return axios.post(url.school + '/getParentStudentInfo', qs.stringify(param)).then((respone) => {
      console.log('我的孩子列表', respone)
      return respone
    })
  },

  /**
   * 关联孩子
   *已通过
   * **/
  parentRelationStudent (param) {
    return axios.post(url.school + '/parentRelationStudent', qs.stringify(param)).then((respone) => {
      console.log('关联孩子孩子列表', respone)
      return respone
    })
  },

  /**
   * 解除关联孩子
   * 已通过
   */
  removeRelation (param) {
    return axios.post(url.school + '/parentUnrelationStudent', qs.stringify(param)).then((respone) => {
      console.log('解除关联孩子', respone)
      return respone
    })
  },

  /**
   * 更新用户信息
   *已通过
   * **/
  updataUserInfo (param) {
    return axios.post(url.user + '/updateUserInfo', qs.stringify(param)).then((respone) => {
      console.log('updataUserInfo', respone)
      return respone
    })
  },

  /**
   * 更新QQ微信邮箱
   *  已通过
   * **/
  updataConcatInfo (param) {

    return axios.post(url.user + '/saveContactInfo', qs.stringify(param)).then((respone) => {
      console.log('updataUserInfo', respone)
      return respone
    })
  },
  /**
   * 一次发送多个请求分别更新用户信息，QQ,邮箱
   * 已通过
   * */

  updateUserCob (param1, param2, param3) {
    // axios.post(url.user + '/saveContactInfo', qs.stringify(param2)),
    // axios.post(url.user + '/saveContactInfo', qs.stringify(param3))
    return axios.all([
      axios.post(url.user + '/updateUserInfo', qs.stringify(param1))
    ]).then((data) => {
      console.log('updateUserCob', data)
      return data

    })
  },

  /**
   * 根据schoolId和 年级id查学科列表
   * */
  querySubjectListByVo (param) {
    return axios.get(url.school + '/querySubjectListByVo', qs.stringify(param)).then((respone) => {
      console.log(respone)
      return respone
    })
  },

  /**
   * 获取验证码
   * @param param
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  genCode (param) {
    return axios.post(url.user + '/genCode', qs.stringify(param)).then((respone) => {
      console.log(respone)
      return respone
    })
  },
  /**
   * 验证手机验证码
   * @param param
   */
  async checkPhoneValidateCode (param) {
    return axios.post(url.user + '/checkValidateCode', qs.stringify(param)).then((respone) => {
      console.log(respone)
      return respone
    })
  },
  /**
   * 校验登录账号
   * @param param
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  checkLoginName (param) {
    return axios.post(url.user + '/checkLoginName', qs.stringify(param)).then((respone) => {
      console.log('checkLoginName success :' + respone)
      return respone
    })
  },

  /**
   * 注册账号
   * @param param
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  registerUser (param) {
    return axios.post(url.user + '/registerUser', qs.stringify(param)).then((respone) => {
      console.log('registerUser success :' + respone)
      return respone
    })
  },
  /**
   * 找回密码
   * @param param
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  findUserPassWd (param) {
    return axios.post(url.user + '/findUserPassWd', qs.stringify(param)).then((respone) => {
      console.log('findUserPassWd success :' + respone)
      return respone
    })
  },

  // 获取用户信息
  getUserInfo (param) {
    return axios.post(url.user + '/getUserInfo', qs.stringify(param)).then((respone) => {
      console.log('getUserInfo success :' + respone)
      return respone
    })
  },

  // 获取用户信息列表
  getUserInfoList (param) {
    return axios.post(url.user + '/getUserInfoList', qs.stringify(param)).then((respone) => {
      console.log('getUserInfoList success :' + respone)
      return respone
    })
  },

  // 获取老师信息
  getUsrTeacherInfo (param) {
    return axios.post(url.user + '/getUsrTeacherInfo', qs.stringify(param)).then((respone) => {
      console.log('getUsrTeacherInfo success :' + respone)
      return respone
    })
  },

  //绑定微信
  bindParentWechat (param) {
    return axios.post(url.user + '/bindParentWechat', qs.stringify(param)).then((respone) => {
      console.log('bindParentWechat success :' + respone)
      return respone
    })
  }
}

//资源
export const resApi = {
  /***
   * 首页轮播图加载
   * 已通过
   */
  getPicList (param) {
    //测试用
    // var urla = "http://119.23.113.71:9001/service-soa/oprInformationPublish/getPublishByRole?requestJson=%7B%22interUser%22:%22runLfb%22,%22interPwd%22:%2225d55ad283aa400af464c76d713c07ad%22,%22belongSchoolId%22:24,%22roleType%22:%22A04%22,%22type%22:%22T06%22,%22pageSize%22:%2210%22,%22currentPage%22:%221%22%7D";
    return axios.post(url.root + '/oprInformationPublish/getPublishByRole', qs.stringify(param)).then((respone) => {
      console.log(respone)
      return respone
    })
  },

  /***
   * 获取用户朗币信息
   * 已通过
   */
  getUserData (param) {
    return axios.post(url.counter + '/getUserCounterSummary', qs.stringify(param)).then((respone) => {
      console.log('getUserData', respone)
      return respone
    })
  },

  /***
   * 获取用户信息
   * 已通过
   */
  updataUserInfo (param) {
    return axios.post(url.user + '/updateUserInfo', qs.stringify(param)).then((respone) => {
      console.log('updataUserInfo', respone)
      return respone
    })
  },

  /**
   * 成绩统计散点图
   * T01 散点数据 T02折线数据
   *
   * **/
  getScoreStatistics (param) {
    return axios.post(url.counter + '/getStudentScoreStatistics', qs.stringify(param)).then((respone) => {
      console.log('getStudentScoreStatistics', respone)
      return respone
    })
  },

  /***
   * 分布图
   * */
  getUserKnowledgePointCounter (param) {
    return axios.post(url.counter + '/getUserKnowledgePointCounter', qs.stringify(param)).then((respone) => {
      console.log('getUserKnowledgePointCounter', respone)
      return respone
    })
  },

  /**
   * 积分来源详细
   *
   * **/
  getUserCounterDetail (param) {
    return axios.post(url.counter + '/getUserCounterDetail', qs.stringify(param)).then((respone) => {
      console.log('getUserCounterDetail', respone)
      return respone
    })
  },
  /**
   * 统计用户一个月的积分来源 和积分消费
   *
   * **/
  getUsrCounterByMonth (param) {
    return axios.post(url.counter + '/getUsrCounterByMonth', qs.stringify(param)).then((respone) => {
      console.log('getUsrCounterByMonth', respone)
      return respone
    })
  },
  /**
   * 积分统计
   *
   * **/
  getMyCoinInfo (param) {
    return axios.post(url.counter + '/getMyCoinInfo', qs.stringify(param)).then((respone) => {
      console.log('getMyCoinInfo', respone)
      return respone
    })
  },

  /**
   * 获取试卷信息
   *
   * **/
  getTestPaperExamInfo (param) {
    console.log('getTestPaperExamInfo params', JSON.stringify(param))
    return axios.post(url.resource + '/getTestPaperExamInfo', qs.stringify(param)).then((respone) => {
      console.log('getTestPaperExamInfo', respone)
      return respone
    })
  },

  // 收藏资源
  createCollectInfo (param) {
    console.log('createCollectInfo params ', param)
    return axios.post(url.resource + '/createCollectInfo', qs.stringify(param)).then((respone) => {
      console.log('createCollectInfo success ', respone)
      return respone
    })
  },

  // 取消收藏
  delCollectInfo (param) {
    console.log('delCollectInfo params ', param)
    return axios.post(url.resource + '/delCollectInfo', qs.stringify(param)).then((respone) => {
      console.log('delCollectInfo success ', respone)
      return respone
    })
  },
}

//学校
export const schoolApi = {

  /**
   * 加载孩子信息
   * **/
  getChildrenInfoList (param) {

    return axios.post(url.school + '/getChildrenInfoList', qs.stringify(param)).then((respone) => {
      console.log(respone)
      return respone
    })
  },

  /**
   * 获取孩子的学校
   * 已通过
   *
   * **/
  getMySchoolInfo (param) {
    return axios.post(url.school + '/getMySchoolInfo', qs.stringify(param)).then((respone) => {
      console.log('getMySchoolInfo' + respone)
      return respone
    })
  },
  /*
   * 获取班级学生
   * @param classId
   */
  getClassStudent (param) {
    return axios.post(url.school + '/getClassStudent', qs.stringify(param)).then((respone) => {
      console.log('getClassStudent' + respone)
      return respone
    })
  }
}

// 教学域
export const teachApi = {
  /**
   * 获取未完成任务
   * ***/
  // getUnfinishCourseTaskList(params) {
  //   return axios.post(url.teach + '/getUnfinishCourseTaskList', qs.stringify(params)).then((respone) => {
  //     console.log('getUnfinishCourseTaskList success :' + respone);
  //     return respone;
  //   })
  // },

  getUnfinishCourseTaskList (param1, param2) {
    return axios.all([
      axios.post(url.teach + '/getUnfinishCourseTaskList', qs.stringify(param1)),
      axios.post(url.teach + '/getUnfinishCourseTaskList', qs.stringify(param2)),
    ]).then((data) => {
      console.log('getUnfinishCourseTaskList', data)
      return data
    })
  },

  /**
   * 获取未完成任务详情列表
   * */
  getCourseTaskList (params) {
    return axios.post(url.teach + '/getCourseTaskList', qs.stringify(params)).then((respone) => {
      console.log('getCourseTaskList success :' + respone)
      return respone
    })
  },

  // 获取班级教学课程信息
  getClassTeachCourseInfo (params) {
    return axios.post(url.teach + '/getClassTeachCourseInfo', qs.stringify(params)).then((respone) => {
      // console.log('getClassTeachCourseInfo success :' + JSON.stringify(respone));
      return respone
    })
  },
  // 获取课程任务列表
  // getCourseTaskList(parmas) {
  //   return axios.post(url.teach + '/getCourseTaskList', qs.stringify(parmas)).then((respone) => {
  //     console.log("getCourseTaskList", respone);
  //     return respone;
  //   })
  // },
  // 获取课程任务详情
  getCourseTaskDetail (parmas) {
    return axios.post(url.teach + '/getCourseTaskDetail', qs.stringify(parmas)).then((respone) => {
      console.log('getCourseTaskList', respone)
      return respone
    })
  },
  // 获取资源详情
  getTeachCourseResDetail (param) {
    // var urla = "http://119.23.113.71:8080/service-soa/teach/getTeachCourseResDetail";
    return axios.post(url.teach + '/getTeachCourseResDetail', qs.stringify(param)).then((respone) => {
      console.log('getTeachCourseResDetail success :', respone)
      return respone
    })
  },
  // 获取课中详细信息
  getCourseSummitInfo (params) {
    return axios.post(url.teach + '/getCourseSummitInfo', qs.stringify(params)).then((respone) => {
      console.log('getCourseSummitInfo', respone)
      return respone
    })
  },

  /**
   * 家长或者孩子错题详细列表
   *已通过
   * **/
  getErrorExamList (param) {
    return axios.post(url.teach + '/getErrorExamList', qs.stringify(param)).then((respone) => {
      console.log('家长或者孩子详细列表', respone)
      return respone
    })

  },

  /**
   * 孩子错题分类
   * 已通过
   * */
  getErrorExamBySubjectType (param) {
    return axios.post(url.teach + '/getErrorExamBySubjectType', qs.stringify(param)).then((respone) => {
      console.log('孩子错题分类', respone)
      return respone
    })
  },
  /**
   * 错题详细
   * 已通过
   * */
  getErrorExamDetail (param) {

    return axios.post(url.teach + '/getErrorExamDetail', qs.stringify(param)).then((respone) => {
      console.log('错题详细', respone)
      return respone
    })
  },

  /**
   * 查找当前学生的所学的课程
   * 已通过
   * */
  getCurSubjectList (param) {
    return axios.post(url.teach + '/getClassTeachCourseInfo', qs.stringify(param)).then((respone) => {
      console.log('查找当前学生的所学的课程', respone)
      return respone
    })
  },

  /**
   * 查询任务完成情况
   * statStuTaskFinishInfo
   *
   * ***/
  statStuTaskFinishInfo (param) {
    return axios.post(url.teach + '/statStuTaskFinishInfo', qs.stringify(param)).then((respone) => {
      console.log('查询任务完成情况', respone)
      return respone
    })
  },

  /**
   * 试卷信息提交
   * statStuTaskFinishInfo
   *
   * ***/
  commitExamResultV3 (param) {
    console.log('commitExamResultV3 param' + param)
    return axios.post(url.teach + '/commitExamResultV3', qs.stringify(param)).then((respone) => {
      console.log('commitExamResultV3 success', respone)
      return respone
    })
  },

  // 保存学生任务
  saveStudentTask (param) {
    console.log('saveStudentTask param' + param)
    return axios.post(url.teach + '/saveStudentTask', qs.stringify(param)).then((respone) => {
      console.log('saveStudentTask success', respone)
      return respone
    })
  },
  statTaskStat (param) {
    return axios.post(url.teach + '/statTaskStat', qs.stringify(param)).then((respone) => {
      console.log('statTaskStat' + respone)
      return respone
    })
  },

}

// 教学域2，由于后台是这样命名，防止错乱所以前台也跟着这样命名
export const teachNewApi = {
  // 获取课程任务统计
  statTaskStat (param) {
    return axios.post(url.teachNew + '/statTaskStat', qs.stringify(param)).then((respone) => {
      console.log('statTaskStat' + respone)
      return respone
    })
  },
  // 获取课程任务详情
  getCourseTaskDetail (parmas) {
    return axios.post(url.teachNew + '/getCourseTaskDetail', qs.stringify(parmas)).then((respone) => {
      console.log('getCourseTaskList', respone)
      return respone
    })
  },
}
// 公共
export const pubApi = {
  /**
   * 获取工作人员回复
   */
  getReply (param) {
    // var aa=" http://127.0.0.1:8082/service-soa/resource";
    return axios.post(url.pub + '/getReply', param).then((respone) => {
      return respone
    })
  },
  /**
   * 结束提问
   */
  updateFeedback (param) {
    // var aa=" http://127.0.0.1:8082/service-soa/resource";
    return axios.post(url.parentFb + '/updateFeedback', qs.stringify(param)).then((respone) => {
      return respone
    })
  },
  /**
   * 收藏列表
   * 已通过
   */
  getMyCollectionsList (param) {
    // var aa=" http://127.0.0.1:8082/service-soa/resource";
    return axios.post(url.resource + '/myCollectionsList', param).then((respone) => {
      console.log('myCollectionsList ', respone)
      return respone
    })
  },

  /**
   * 添加收藏
   * **/
  addCollect (param) {
    return axios.post(url.pub + '/addCollect', qs.stringify(param)).then((respone) => {
      console.log('addCollect ', respone)
      return respone
    })
  },

  // 取消收藏
  delCollect (param) {
    return axios.post(url.resource + '/delMyCollection', qs.stringify(param)).then((respone) => {
      console.log('delCollect ', respone)
      return respone
    })
  },

  // 获取评论列表
  getAppraise (param) {
    return axios.post(url.pub + '/getAppraiseV2', qs.stringify(param)).then((respone) => {
      // console.log('getAppraise ', respone);
      return respone
    })
  },
  // 添加评论
  addAppraise (param) {
    console.log('addAppraise params', param)
    return axios.post(url.pub + '/addAppraise', qs.stringify(param)).then((respone) => {
      console.log('addAppraise success ', respone)
      return respone
    })
  },
  noticeList (param) {

    //
    return axios.post(url.pub + '/getPubRemindInfoByIds', qs.stringify(param)).then((respone) => {
      console.log('getPubRemindInfoByIds ', respone)
      return respone
    })
  },
  // OSS鉴权
  checkUrlPermission (param) {
    return axios.post(url.pub + '/stsAuthAccessUrl', qs.stringify(param)).then((respone) => {
      console.log('checkUrlPermission ', respone)
      return respone
    })
  },

  // 评论点赞
  addPraise (param) {
    return axios.post(url.pub + '/addPraise', qs.stringify(param)).then((respone) => {
      console.log('addPraise ', respone)
      return respone
    })
  },
  // 取消点赞
  delPraise (param) {
    return axios.post(url.pub + '/delPraise', qs.stringify(param)).then((respone) => {
      console.log('delPraise ', respone)
      return respone
    })
  },
  /**
   * 问题反馈
   * */
  uploadFeedback (param) {
    return axios.post(url.root + '/oprParentFeedback/uploadFeedback', qs.stringify(param)).then((respone) => {
      console.log('uploadFeedback ', respone)
      return respone
    })
  },

  /**
   * 问题反馈列表
   * */
  getMyFeedBackList (param) {
    return axios.post(url.root + '/oprParentFeedback/getMyFeedBackList', qs.stringify(param)).then((respone) => {
      console.log('getMyFeedBackList ', respone)
      return respone
    })
  },

  //家长圈-我的测试-获取测试列表
  getPsychologyList (param) {
    return axios.post(url.pub + '/getPsychologicalTestList', qs.stringify(param)).then((respone) => {
      console.log('getPsychologicalTestList ', respone)
      return respone
    })
  },
  //家长圈-我的测试-获取测试列表详情
  getPsychologyIntroduce (param) {
    return axios.post(url.pub + '/getPsychologicalExamList', qs.stringify(param)).then((respone) => {
      console.log('getPsychologyIntroduce ', respone)
      return respone
    })
  },
  //家长圈-我的测试-获取试题信息
  getPsychologicalExamList (param) {
    return axios.post(url.pub + '/getPsychologicalExamList', qs.stringify(param)).then((respone) => {
      console.log('getPsychologicalExamList ', respone)
      return respone
    })
  },
  //家长圈-我的测试-答案提交
  commitPsychologicalTestResult (param) {
    return axios.post(url.pub + '/commitPsychologicalTestResult', qs.stringify(param)).then((respone) => {
      console.log('commitPsychologicalTestResult ', respone)
      return respone
    })
  },
  //家长圈-我的测试-答案详情查询
  getPsychologicalTestRecordInfo (param) {
    return axios.post(url.pub + '/getPsychologicalTestRecordInfo', qs.stringify(param)).then((respone) => {
      console.log('getPsychologicalTestRecordInfo ', respone)
      return respone
    })
  },
  //家长圈-我的测试-申请解读-获取验证码
  getPsychologicalSaveApply (param) {
    return axios.post(url.pub + '/saveApply', qs.stringify(param)).then((respone) => {
      console.log('getPsychologicalSaveApply ', respone)
      return respone
    })
  },

  /**
   * 获取检测结果
   */
  getDetectionResult (param) {
    return axios.post(url.pub + '/getDetectionResult', qs.stringify(param)).then((respone) => {
      console.log('getPsychologicalSaveApply ', respone)
      return respone
    })
  }

}

// 统计
export const counterApi = {
  /**
   * 获取班级积分列表
   */
  getClassCounterSummary (param) {
    // let u = 'http://localhost:8091/service-soa/counter';
    return axios.post(url.counter + '/getClassCounterSummary', qs.stringify(param)).then((respone) => {
      console.log('getClassCounterSummary ', respone)
      return respone
    })
  },
}

export const sysModuleVersionApi = {
  //获取最新版本
  getLatestModuleVerion (param) {
    return axios.post(url.sysModuleVersion + '/getLatestModuleVerion', qs.stringify(param)).then((respone) => {
      console.log('getLatestModuleVerion ', respone)
      return respone
    })
  }

}
export const sysAreaApi = {
  //获取最新版本
  getSysAreaList (param) {
    return axios.post(url.sysArea + '/getSysAreaList', qs.stringify(param)).then((respone) => {
      console.log('getSysAreaList ', respone)
      return respone
    })
  }

}
export const wxApi = {
  //获取最新版本
  wxConfig (param) {
    return axios.post(url.wxConfig + '/sign', qs.stringify(param)).then((respone) => {
      console.log('sign ', param, respone)
      return respone
    })
  }

}
export const feedbackApi = {
  //获取问题分类
  getSysDictList (param) {
    return axios.post(url.feedback + '/getSysDictList', qs.stringify(param)).then((respone) => {
      console.log(param, '=3=3=3')
      return respone
    })
  },

  // 获取评论列表
  getAppraise (param) {
    return axios.post(url.pub + '/getAppraise', qs.stringify(param)).then((respone) => {
      // console.log('getAppraise ', respone);
      return respone
    })
  },
}
