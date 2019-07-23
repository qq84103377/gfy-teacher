import Vue from 'vue'
import axios from 'axios'
import {
  Toast
} from 'vant'
Vue.use(Toast)
const baseUrl = process.env.VUE_APP_BASE_URL
if (process.env.NODE_ENV === 'development') {} else {}
axios.defaults.baseURL = baseUrl
axios.defaults.withCredentials = false

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
  return Promise.reject(error)
})

export default axios
