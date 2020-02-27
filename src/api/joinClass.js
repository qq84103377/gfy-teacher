import axios from '../utils/http'
import * as qs from 'qs'

// 根据二维码id获取二维码相关信息
export const getQrcodeInfo = params => {
  return axios.post(`/school/getJoinClassQrcodeInfo`, qs.stringify(params))
}
// 查询班级
export const getClassByGrade = params => {
  return axios.post(`/school/getClassByGrade`, qs.stringify(params))
}

// 老师加入班级
export const teacherAddToClass = params => {
  return axios.post(`/school/teacherAddToClass`, qs.stringify(params))
}

// 学生加入班级
export const studentAddToClass = params => {
  return axios.post(`/school/operClassStudent`, qs.stringify(params))
}

// 获取教材版本
export const getVersionBySubjectType = params => {
  return axios.post(`/resource/getVersionBySubjectType`, qs.stringify(params))
}


