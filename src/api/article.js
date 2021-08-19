// 用户相关请求模块
import request from '@/utils/request'


// 获取文章列表(频道新闻推荐_V1.1)
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/app/v1_1/articles',
        params
    })
}