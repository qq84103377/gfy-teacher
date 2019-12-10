import axios from '../utils/http'
import * as qs from 'qs'

// 获取banner广告
export const getBanner = (params) => {
  return axios.post('opr/getAdvertisementRandom', qs.stringify(params))
}
// 获取随机栏目数据
export const getRandColomn = (params) => {
  return axios.post('oprInformationPublish/getParentRecommendList', qs.stringify(params))
}
// 获取大栏目数据
export const getBigColomn = (params) => {
  return axios.post('oprInformationPublish/getParentInfomationList', qs.stringify(params))
}
// 获取详情相关栏目数据
export const getRelateColomn = (params) => {
  return axios.post('oprInformationPublish/getRelatedInfomation', qs.stringify(params))
}
// 获取详情内容html
export const getContent = (url) => {
  return axios.get(url)
}
// 点赞
export const addPraise = (params) => {
  return axios.get('public/addPraise', {params:params})
}
// 获取是否点赞和点赞次数
export const getPraise = (params) => {
  return axios.get('public/getPraise',  {params:params})
}
// 取消点赞
export const delPraise = (params) => {
  return axios.get('public/delPraise',  {params:params})
}
// 文章点击次数+1
export const addClickNum = (params) => {
  return axios.post('oprInformationPublish/addInformationClickCount', qs.stringify(params))
}
// 获取搜索热搜词
export const getHotWord = (params) => {
  return axios.post('oprInformationPublish/getPopularKeywordList', qs.stringify(params))
}
// 获取搜索结果
export const getSearchResult = (params) => {
  return axios.post('oprInformationPublish/searchParentInfomation', qs.stringify(params))
}

//获取学校信息
export const getMySchoolInfo =(params)=>{
  return axios.post('school/getMySchoolInfo', qs.stringify(params))
}


// 获取未结束任务
export const getUnFinishCourseTask =(params)=>{
  return axios.post('teach/getUnFinishCourseTask', qs.stringify(params))
}

//获取课程列表
export const getClassTeachCourseInfo = (params)=>{
  return axios.post('teach/getClassTeachCourseInfo', qs.stringify(params))
}

//查询系统课程
export const getTextBookCourseByParam =(params) =>{
  return axios.post('resource/getTextBookCourseByParam', qs.stringify(params));
}

//获取共享系统课程
export const getShareCourseDetailV2 =(params) =>{
  return axios.post("resource/getShareCourseDetailV2", qs.stringify(params))
}
//获取教材课程
export const getTextBookCourseInfo =(params)=>{
  return axios.post("resource/getTextBookCourseInfo", qs.stringify(params))
}
//获取班级学生信息
export const getClassStudent = (params)=>{
  return axios.post("school/getClassStudent", qs.stringify(params))
}

//获取分组信息
export const getSubGroupStudent = (params)=>{
  return axios.post("teach/getSubGroupStudent", qs.stringify(params))
}
//创建课程
export const createTeachCourse =(params)=>{
  return axios.post("teach/createTeachCourse", qs.stringify(params))
}
//获取年级学期信息
export const getGradeTermInfo=(params)=>{
  return axios.post("resource/getGradeTermInfo", qs.stringify(params))
}
//获取轮播图
export const getPublishByRole=(params)=>{
  return axios.post("oprInformationPublish/getPublishByRole", qs.stringify(params))
}
//
//查询老师建课配置
export const getClassTeacherCourseDeploy=(params)=>{
  return axios.post("school/getClassTeacherCourseDeploy", qs.stringify(params))
}
//获取任务列表
export const getCourseTaskList =(params)=>{
  return axios.post('teach/getCourseTaskList', qs.stringify(params))
}
//删除讲义/课件
export const deleteCourseSummitInfo =(params)=>{
  return axios.post('teach/deleteCourseSummitInfo', qs.stringify(params))
}
//上下移动讲义/课件
export const setDataTaskOrder =(params)=>{
  return axios.post('teach/setDataTaskOrder', qs.stringify(params))
}
//批量选择课件
export const createCourseSummitInfoList =(params)=>{
  return axios.post('teach/createCourseSummitInfoList', qs.stringify(params))
}
//微课添加课件
export const createCourseSummitInfo =(params)=>{
  return axios.post('teach/createCourseSummitInfo', qs.stringify(params))
}
//添加课件资源
export const addTeachCourseRes =(params)=>{
  return axios.post('teach/addTeachCourseRes', qs.stringify(params))
}
//素材上传图片添加到教学课程关系表
export const addTeachCourseResList =(params)=>{
  return axios.post('teach/addTeachCourseResList', qs.stringify(params))
}
//删除堂测统计
export const deleteCourseTask =(params)=>{
  return axios.post('teachNew/deleteCourseTask', qs.stringify(params))
}
//删除课中资源(微课、素材、试卷、试题、口语、讨论)
export const modifyTeachCourseRes =(params)=>{
  return axios.post('teach/modifyTeachCourseRes', qs.stringify(params))
}
//修改课程
export const modifyTeachCourse = (params) => {
  return axios.post('teach/modifyTeachCourse', qs.stringify(params))
}
//添加课中资源(微课、素材、试卷、试题、口语、讨论)
export const addCourseWare =(params)=>{
  return axios.post('resource/addCourseWare', qs.stringify(params))
}
//创建试卷
export const addTestPaper =(params)=>{
  return axios.post('resource/addTestPaper', qs.stringify(params))
}
//编辑试卷
export const modifyTestPaper =(params)=>{
  return axios.post('resource/modifyTestPaper', qs.stringify(params))
}
//复制试卷
export const copyTestPaper =(params)=>{
  return axios.post('resource/copyTestPaper', qs.stringify(params))
}
//试题列表题型下拉列表
export const getExamSectionTypeRelation =(params)=>{
  return axios.post('resource/getExamSectionTypeRelation', qs.stringify(params))
}
//试题添加收藏
export const createCollectInfo =(params)=>{
  return axios.post('resource/createCollectInfo', qs.stringify(params))
}
//试题取消收藏
export const delCollectInfo =(params)=>{
  return axios.post('resource/delCollectInfo', qs.stringify(params))
}
//添加试题
export const addTestPaperExamInfo =(params)=>{
  return axios.post('resource/addTestPaperExamInfo', qs.stringify(params))
}
//获取试卷详情
export const getTestPaperExamInfo =(params)=>{
  return axios.post('resource/getTestPaperExamInfo', qs.stringify(params))
}
//试题有小题设置分数
export const updateTestPaperSubExamScore =(params)=>{
  return axios.post('resource/updateTestPaperSubExamScore', qs.stringify(params))
}
//试题无小题设置分数
export const updateTestPaperExamScore =(params)=>{
  return axios.post('resource/updateTestPaperExamScore', qs.stringify(params))
}
//移除试卷内的试题
export const delTestPaperExamInfo =(params)=>{
  return axios.post('resource/delTestPaperExamInfo', qs.stringify(params))
}
//试卷详情上下移动章节
export const updateTestPaperSectonIndex =(params)=>{
  return axios.post('resource/updateTestPaperSectonIndex', qs.stringify(params))
}
//新建论题
export const addDiscussInfo =(params)=>{
  return axios.post('resource/addDiscussInfo', qs.stringify(params))
}
//编辑论题
export const modifyDiscussInfo =(params)=>{
  return axios.post('resource/modifyDiscussInfo', qs.stringify(params))
}
//字典值查询
export const getSysDictList =(params)=>{
  return axios.post('sysDict/getSysDictList', qs.stringify(params))
}
//试题纠错
export const addErrorCorrectInfo =(params)=>{
  return axios.post('oprExamCorrect/addErrorCorrectInfo', qs.stringify(params))
}
//任务统计详情
export const statTaskStat =(params)=>{
  return axios.post('teachNew/statTaskStat', qs.stringify(params))
}
//获取版本信息
export const getTextBookVersionInfo =(params)=>{
  return axios.post('resource/getTextBookVersionInfo', qs.stringify(params))
}
//创建任务
export const createCourseTask = (params) => {
  return axios.post('teachNew/createCourseTask', qs.stringify(params))
}
//获取科目信息
export const getSubjectType =(params)=>{
  return axios.post('resource/getSubjectType', qs.stringify(params))
}
//获取答题详情
export const getExamItemDetail =(params)=>{
  return axios.post('teach/getExamItemDetail', qs.stringify(params))
}
//试卷分析
export const getTestPaperAnalysis =(params)=>{
  return axios.post('teach/getTestPaperAnalysis', qs.stringify(params))
}
//得分分析
export const getTestPaperScoreAnalysis =(params)=>{
  return axios.post('teach/getTestPaperScoreAnalysis', qs.stringify(params))
}
//加分/减分
export const saveRewardScore =(params)=>{
  return axios.post('teach/saveRewardScore', qs.stringify(params))
}
//获取资源详情
export const getCourseTaskDetail =(params)=>{
  return axios.post('teachNew/getCourseTaskDetail', qs.stringify(params))
}
//获取资源详情
export const getCourseTaskDetailV2 =(params)=>{
  return axios.post('teach/getCourseTaskDetail', qs.stringify(params))
}
//获取评价
export const getAppraiseV2 =(params)=>{
  return axios.post('public/getAppraiseV2', qs.stringify(params))
}
//获取评价里面的回复
export const getReply =(params)=>{
  return axios.post('public/getReply', qs.stringify(params))
}
//置顶评价
export const topAppraise =(params)=>{
  return axios.post('public/topAppraise', qs.stringify(params))
}
//取消置顶评价
export const untopAppraise =(params)=>{
  return axios.post('public/untopAppraise', qs.stringify(params))
}
//评价加精华
export const essAppraise =(params)=>{
  return axios.post('public/essAppraise', qs.stringify(params))
}
//取消评价加精华
export const unessAppraise =(params)=>{
  return axios.post('public/unessAppraise', qs.stringify(params))
}
//评价添加回复
export const addReply =(params)=>{
  return axios.post('public/addReply', qs.stringify(params))
}
//任务统计一键提醒
export const saveDailyReminder =(params)=>{
  return axios.post('operate/saveDailyReminder', qs.stringify(params))
}
//任务统计获取每日提醒状态
export const getDailyRemindStatus =(params)=>{
  return axios.post('operate/getDailyRemindStatus', qs.stringify(params))
}
//主观题批改列表
export const getExamFinishInfo =(params)=>{
  return axios.post('teach/getExamFinishInfo', qs.stringify(params))
}
//上下移动任务
export const setCourseTaskOrder =(params)=>{
  return axios.post('teach/setCourseTaskOrder', qs.stringify(params))
}
//任务置顶
export const topCourseTask = (params) => {
  return axios.post('teach/topCourseTask', qs.stringify(params))
}
//任务分享详情
export const getCourseTaskDetailByShare = (params) => {
  return axios.post('teach/getCourseTaskDetailByShare', qs.stringify(params))
};
//主观题批改点评
export const addAppraise =(params)=>{
  return axios.post('public/addAppraise', qs.stringify(params))
}
//主观题批改打分
export const examResultScroe =(params)=>{
  return axios.post('teach/examResultScroe', qs.stringify(params))
}
//主观题点赞/取消点赞
export const updateExamQuality =(params)=>{
  return axios.post('teach/updateExamQuality', qs.stringify(params))
}
//口语详情
export const getSpokenResourceSingle =(params)=>{
  return axios.post('resource/getSpokenResourceSingle', qs.stringify(params))
}
//视频转换
export const addImportTask =(params)=>{
  return axios.post('public/addImportTask', qs.stringify(params))
}
//任务统计(旧)
export const statTaskStatV2 =(params)=>{
  return axios.post('teach/statTaskStat', qs.stringify(params))
}
//课程删除
export const deleteTeachCourse =(params)=>{
  return axios.post('teach/deleteTeachCourse', qs.stringify(params))
}
//获取班级老师
export const getClassTeacher =(params)=>{
  return axios.post('school/getClassTeacher', qs.stringify(params))
}
//更新班长信息
export const updateClassStudent =(params)=>{
  return axios.post('school/updateClassStudent', qs.stringify(params))
}
//更新组长信息
export const setSubGroupStudentType =(params)=>{
  return axios.post('teach/setSubGroupStudentType', qs.stringify(params))
}
//新建小组
export const createClassSubGroup =(params)=>{
  return axios.post('teach/createClassSubGroup', qs.stringify(params))
}
//复制老师分组
export const copyGroupByTeacherInfo =(params)=>{
  return axios.post('teach/copyGroupByTeacherInfo', qs.stringify(params))
}
//教学统计-任务统计
export const statCourseByTeacher =(params)=>{
  return axios.post('teach/statCourseByTeacher', qs.stringify(params))
}
//教学统计-教师统计
export const statByTeacher =(params)=>{
  return axios.post('teach/statByTeacher', qs.stringify(params))
}
//教师统计-课堂情况
export const getClassroomInfoByTeacher =(params)=>{
  return axios.post('teach/getClassroomInfoByTeacher', qs.stringify(params))
}
//教师统计-交互功能
export const getClassroomDetailInfo =(params)=>{
  return axios.post('teach/getClassroomDetailInfo', qs.stringify(params))
}
//教学统计-班级统计
export const statByClass =(params)=>{
  return axios.post('teach/statByClass', qs.stringify(params))
}
//教学统计-个人统计
export const statByPersonal =(params)=>{
  return axios.post('teach/statByPersonal', qs.stringify(params))
}
//学情数据
export const getUserKnowledgePointCounter =(params)=>{
  return axios.post('counter/getUserKnowledgePointCounter', qs.stringify(params))
}
//错题本列表
export const getTeacherErrorExamList =(params)=>{
  return axios.post('teach/getTeacherErrorExamList', qs.stringify(params))
}
//批量添加小组成员
export const addSubGroupStudentByBatch =(params)=>{
  return axios.post('teach/addSubGroupStudentByBatch', qs.stringify(params))
}
//批量删除小组成员
export const delSubGroupStudentByBatch =(params)=>{
  return axios.post('teach/delSubGroupStudentByBatch', qs.stringify(params))
}
//获取课程内错题的试题详情
export const getTeacherErrorExamDetail =(params)=>{
  return axios.post('teach/getTeacherErrorExamDetail', qs.stringify(params))
}
//获取所有试题题型
export const getAllExamTypeList =(params)=>{
  return axios.post('resource/getAllExamTypeList', qs.stringify(params))
}
//添加口语资源
export const addSpokenResource =(params)=>{
  return axios.post('resource/addSpokenResource', qs.stringify(params))
}
//添加口语资源(共享)
export const addShareSpokenResource =(params)=>{
  return axios.post('resource/addShareSpokenResource', qs.stringify(params))
}
//修改口语资源
export const modifySpokenResource =(params)=>{
  return axios.post('resource/modifySpokenResource', qs.stringify(params))
}
//修改口语资源(共享)
export const modifyShareSpokenResource =(params)=>{
  return axios.post('resource/modifyShareSpokenResource', qs.stringify(params))
}
//学生任务完成情况
export const statStuTaskFinishInfo =(params)=>{
  return axios.post('teach/statStuTaskFinishInfo', qs.stringify(params))
}
//成绩趋势分析
export const getStudentScoreStatistics =(params)=>{
  return axios.post('counter/getStudentScoreStatistics', qs.stringify(params))
}
//更新已发布任务
export const modifyCourseTask =(params)=>{
  return axios.post('teach/modifyCourseTask', qs.stringify(params))
}
//学情数据
export const getUserKnowledgePointCounterV2 =(params)=>{
  return axios.post('counter/getUserKnowledgePointCounterV2', qs.stringify(params))
}
//重发任务
export const redoCourseTask =(params)=>{
  return axios.post('teachNew/redoCourseTask', qs.stringify(params))
}
//获取地区列表
export const getAreaInfo =(params)=>{
  return axios.post('resource/getAreaInfo', qs.stringify(params))
}
//获取资源中心微课&素材列表
export const getResCourseWareInfo =(params)=>{
  return axios.post('resource/getResCourseWareInfo', qs.stringify(params))
}
//获取资源中心试卷列表
export const getSysCourseTestPaperList =(params)=>{
  return axios.post('resource/getSysCourseTestPaperList', qs.stringify(params))
}
//获取资源中心试题列表
export const getResExamInfo =(params)=>{
  return axios.post('resource/getResExamInfo', qs.stringify(params))
}
//获取资源中心私人资源
export const getCollectInfoDetailV2 =(params)=>{
  return axios.post('resource/getCollectInfoDetailV2', qs.stringify(params))
}
//删除资源中心微课/素材
export const delCourseWare =(params)=>{
  return axios.post('resource/delCourseWare', qs.stringify(params))
}
//删除资源中心试卷
export const delTestPaper =(params)=>{
  return axios.post('resource/delTestPaper', qs.stringify(params))
}
//获取APP最新版本
export const getLatestModuleVerion =(params)=>{
  return axios.post('sysModuleVersion/getLatestModuleVerion', qs.stringify(params))
}
//获取课中白板课程下的班级信息
export const getClassDataGroupByClass =(params)=>{
  return axios.post('teach/getClassDataGroupByClass', qs.stringify(params))
}
//班级学生白板按老师白板归类统计
export const getClassDataGroupByTeacher =(params)=>{
  return axios.post('teach/getClassDataGroupByTeacher', qs.stringify(params))
}
//获取课程下的堂测任务归类的班级信息列表
export const getTaskGroupByClass =(params)=>{
  return axios.post('teach/getTaskGroupByClass', qs.stringify(params))
}
//获取分层任务列表
export const getLayerTaskInfoList =(params)=>{
  return axios.post('teach/getLayerTaskInfoList', qs.stringify(params))
}
//获取分层任务详情
export const getLayerTaskInfoDetail =(params)=>{
  return axios.post('teach/getLayerTaskInfoDetail', qs.stringify(params))
}
