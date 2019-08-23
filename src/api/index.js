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
//删除堂测统计
export const deleteCourseTask =(params)=>{
  return axios.post('teachNew/deleteCourseTask', qs.stringify(params))
}
