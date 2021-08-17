// 为每个请求添加自动添加请求路径前缀《请求工具》
import axios from 'axios'
import store from '@/store'

// 接口的基准路径
const request = axios.create({
    baseURL: "http://ttapi.research.itcast.cn",
    // headers: {
    //     'Content-Type': "application/json;charset=utf-8"
    // }
})

// 请求拦截器
request.interceptors.request.use(function(config) {
    // 请求发起会经过这里
    // config：本次请求的请求配置对象
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(user.token);
    // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    return config
}, function(error) {
    // 如果请求出错了（还没有发出去）会进入这里
    return Promise.reject(error)
})

export default request