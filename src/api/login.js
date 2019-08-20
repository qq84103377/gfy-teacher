import axios from '../utils/http'
import * as qs from 'qs'

export const getList = params => {
  return axios.post(`/sysDict/getSysDictList`, qs.stringify(params))
}

// 获取验证码
export const getVailCode = (params) => {
  return axios.get(`user/genCode`, { params})
}
// 手机号登录
export const doMobileLogin = params => {
  return axios.post(`user/registerByVerificationCode`, qs.stringify(params))
}
// 手机号/用户名登录
export const doUserLogin = params => {
  return axios.post(`user/phoneLogin`, qs.stringify(params))
}
// 查看用户名是否可用
export const checkUserName = params => {
  return axios.get(`user/checkLoginName`, { params});
}
// 设置用户基本信息
export const setUserBaseInfo = params => {
  return axios.post(`user/thirtPartySetBaseInfo`, qs.stringify(params))
}
// 绑定手机
export const bindMobile = params => {
  return axios.post(`user/bingdingPhone`, qs.stringify(params))
}
// 第三方登录
export const thirtPartyLogin = params => {
  return axios.post(`/user/thirtPartyLogin`, qs.stringify(params))
}
//忘记密码
export const findUserPassWd = (params) => {
  return axios.get(`user/findUserPassWd`, { params})
}