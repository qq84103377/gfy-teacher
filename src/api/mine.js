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

// 获取用户的积分信息
export const getUserCounterList = (params) => {
  return axios.post('counter/getUserCounterList', qs.stringify(params))
}

// 获取我的等级/朗币来源明细
export const getUserCounterDetailGroupByDay = (params) => {
  return axios.post('counter/getUserCounterDetailGroupByDay', qs.stringify(params))
}

// 获取我的等级信息
export const getMylevelInfo = (params) => {
  return axios.post('counter/getMylevelInfo', qs.stringify(params))
}

// 获取我的朗币
export const getMyCoinInfo = (params) => {
  return axios.post('counter/getMyCoinInfo', qs.stringify(params))
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
  return axios.post('user/updatePhoneNo', qs.stringify(params))
}

// 获取提醒信息
export const getPubRemindInfoGroupByDay = (params) => {
  return axios.post('public/getPubRemindInfoGroupByDay', qs.stringify(params))
}
// 读新消息
export const savePubRemindInfo = (params) => {
  return axios.post('public/savePubRemindInfo', qs.stringify(params))
}

// 全部标为已读
export const oneKeyReadRemindInfo = (params) => {
  return axios.post('public/oneKeyReadRemindInfo', qs.stringify(params))
}

//region==================意见反馈相关API========================================

// 获取我的反馈记录
export const getMyFeedBackList = (params) => {
  return axios.post('oprParentFeedback/getMyFeedBackList', qs.stringify(params))
}


// 更新意见反馈记录
export const updateFeedback = (params) => {
  return axios.post('oprParentFeedback/updateFeedback', qs.stringify(params))
}

//endregion===============意见反馈相关API========================================

//region==================积分商城相关API========================================

// 获取商品列表
export const getGoodsList = (params) => {
  return axios.post('mall/getMallGoodsInfoForSchool', qs.stringify(params))
}

// 获取收藏记录
export const getCollectInfo = (params) => {
  return axios.post('mall/getMallCollectInfo', qs.stringify(params))
}

// 获取兑换记录
export const getConvertRecordInfo = (params) => {
  return axios.post('mall/getMallConvertRecordInfo', qs.stringify(params))
}

// 商品收藏
export const addMallCollectInfo = (params) => {
  return axios.post('mall/addMallCollectInfo', qs.stringify(params))
}

// 取消商品收藏
export const cancelMallCollectInfo = (params) => {
  return axios.post('mall/cancelMallCollectInfo', qs.stringify(params))
}

// 兑换商品
export const addExchangeApplyGoodsInfo = (params) => {
  return axios.post('mall/addExchangeApplyGoodsInfo', qs.stringify(params))
}

// 删除兑换记录
export const delExchangeApplyGoodsInfo = (params) => {
  return axios.post('mall/delExchangeApplyGoodsInfo', qs.stringify(params))
}

// 查询商品兑换详情
export const getMallConvertRecordInfoById = (params) => {
  return axios.post('mall/getMallConvertRecordInfoById', qs.stringify(params))
}

// 取消兑换商品
export const cancelExchangeApplyGoodsInfo = (params) => {
  return axios.post('mall/cancelExchangeApplyGoodsInfo', qs.stringify(params))
}



//endregion===============积分商城相关API========================================


