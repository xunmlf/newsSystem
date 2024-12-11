// 封装axios

import axios from 'axios'


import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 创建axios 实例
const request = axios.create({
  baseURL: 'http://localhost:5001', // url = base url + request url

  timeout: 20000 // request timeout
})

// 设置请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    NProgress.start()
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    NProgress.done()
    return response;
})

export   {request}
