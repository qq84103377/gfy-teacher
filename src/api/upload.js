import axios from '../utils/http'
import * as qs from 'qs'

export const stsAuthCoverAccessUrl = param => {
  return axios.post('/public/stsAuthUploadPolicyForDirect', qs.stringify(param)).then((respone) => {
    console.log('stsAuthUploadPolicyForDirect ', respone.data);
    return respone;
  })
}
export const doUpLoad = (url, data) => {
  return new Promise((resolve, reject) => {
    console.log(data);
    axios({
      url: url,
      method: 'post',
      data: data,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
