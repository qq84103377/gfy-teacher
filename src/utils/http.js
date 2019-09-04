import Vue from 'vue'
import axios from 'axios'
import QS from 'qs';

import {
  Toast
} from 'vant'
Vue.use(Toast)
const baseUrl = process.env.VUE_APP_BASE_URL
if (process.env.NODE_ENV === 'development') {} else {}
axios.defaults.baseURL = baseUrl
axios.defaults.withCredentials = false
axios.defaults.headers = {
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
}

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '请求错误(400)';
        break;
      case 401:
        return history.push('/login');
        break;
      case 403:
        error.message = '拒绝访问(403)';
        break;
      case 404:
        error.message = '请求出错(404)';
        break;
      case 408:
        error.message = '请求超时(408)';
        break;
      case 500:
        error.message = '服务器错误(500)';
        break;
      case 501:
        error.message = '服务未实现(501)';
        break;
      case 502:
        error.message = '网络错误(502)';
        break;
      case 503:
        error.message = '服务不可用(503)';
        break;
      case 504:
        error.message = '网络超时(504)';
        break;
      case 505:
        error.message = 'HTTP版本不受支持(505)';
        break;
      default:
        error.message = `连接出错(${error.response.status})!`;
    }
  } else {
    error.message = '网络错误，请求超时!';
  }

  Toast(error.message)
  return Promise.reject(error)
})
// axios.interceptors.request.use(
//     config => {
//       // console.log(config);
//       // const xToken = getXToken()
//       // if (xToken !== null) {
//       //   config.headers['X-Token'] = xToken
//       // }
//       if (config.method === 'post') {
//         let data = QS.parse(config.data);
//         data['_t'] = new Date().getTime()
//         config.data = QS.stringify(data)
//       } else if (config.method === 'get') {
//         config.params = {
//           _t: new Date().getTime(),
//           ...config.params
//         }
//       }
//       return config.data
//     }, function (error) {
//       return Promise.reject(error)
//     }
// )
export default axios
