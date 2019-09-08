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
