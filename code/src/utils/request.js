import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'

// request interceptor
axios.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    const token = Vue.ls.get('Access-Token')
    config.crossDomain = true
    config.withCredentials = true
    if (token) {
      // config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log(response)
    const res = response.data
    return res
  },
  error => {
    if (error.response) {
      const data = error.response.data
      const token = Vue.ls.get('ACCESS_TOKEN')
      if (error.response.status === 403) {
        Message.error({
          message: 'Forbidden',
          description: data.message
        })
      }
      if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
        Message.error({
          message: data,
          description: 'Authorization verification failed'
        })
        windows.localStorage.clear()
        if (token) {
          store.dispatch('logout').then(() => {
            
          })
        }
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    }
    return Promise.reject(error)
  }
)

export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: process.env.VUE_APP_BASE_API + `${url}`,
    headers: {
      'pubkey': sessionStorage.getItem('publicKey')
    }
  })
}

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: process.env.VUE_APP_BASE_API + `${url}`,
    data: params,
    // transformRequest: [
    //   function(data) {
    //     let ret = ''
    //     for (const it in data) {
    //       ret +=
    //         encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //     }
    //     return ret
    //   }
    // ],
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const postJsonRequest = (url, params) => {
  return axios({
    method: 'post',
    url: process.env.VUE_APP_BASE_API + `${url}`,
    data: JSON.stringify(params),
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

// export default service
export const postDataFormRequest = (url, params) => {
  return axios({
    method: 'post',
    url: process.env.VUE_APP_BASE_API + `${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
