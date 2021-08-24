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

// 获取新闻文章详情
export const getArticleById = articleId => {
    return request({
        method: 'GET',
        url: `/app/v1_0/articles/${articleId}`,
    })
}

// 收藏文章
export const addCollect = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/article/collections',
        data: {
            target
        }
    })
}

// 取消收藏文章
export const delCollect = targetId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/article/collections/${targetId}`,
    })
}

// 点赞文章
export const addLike = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/article/likings',
        data: {
            target
        }
    })
}

// 取消点赞文章
export const delLike = targetId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/article/likings/${targetId}`,
    })
}