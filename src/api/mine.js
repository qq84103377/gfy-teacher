import axios from '../utils/http'
import * as qs from 'qs'

// 获取我的学校信息
export const getMySchoolInfo = (params) => {
  return axios.post('school/getMySchoolInfo', qs.stringify(params))
}

//查询老师完成课程数和任务数
export const getUserCurriculum = (params) => {
  return axios.post('counter/getUserCurriculum', qs.stringify(params))
}

// 获取用户的积分，等级，郎币等汇总信息
export const getUserCounterSummary = (params) => {
  return axios.post('counter/getUserCounterSummary', qs.stringify(params))
}

// 获取我的等级/朗币来源明细
export const getUserCounterDetailGroupByDay = (params) => {
  return axios.post('counter/getUserCounterDetailGroupByDay', qs.stringify(params))
}

// 修改个人信息（头像、性别）
export const updateUserInfo = (params) => {
  return axios.post('user/updateUserInfo', qs.stringify(params))
}

// 重置密码（教师app的密码修改调用接口）
export const resetPassword = (params) => {
  return axios.post('user/resetPassword', qs.stringify(params))
}

// 更换手机（教师app的修改手机号调用接口）
export const replacementPhone = (params) => {
  return axios.post('user/replacementPhone', qs.stringify(params))
}

// 获取提醒信息
export const getPubRemindInfo = (params) => {
  return axios.post('public/getPubRemindInfo', qs.stringify(params))
}
