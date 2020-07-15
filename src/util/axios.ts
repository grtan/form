import axios from 'axios'
import qs from 'qs'

const instance = axios.create({
  withCredentials: true,
  timeout: 10000, // 请求超时时间
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  },
  paramsSerializer (params) {
    return qs.stringify(params, {
      arrayFormat: 'repeat'
    })
  }
})

export default instance
