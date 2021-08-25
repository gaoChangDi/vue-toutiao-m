// 用户相关请求模块
import request from '@/utils/request'
// import store from '@/store'


// 用户认证（登录注册）
export const login = data => {
    return request({
        method: 'POST',
        url: 'app/v1_0/authorizations',
        data
    })
}

// 发送验证码 注意：每手机号每分钟1次
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `app/v1_0/sms/codes/${mobile}`,
    })
}

// 获取用户自己信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: 'app/v1_0/user',
        params: {},
        // 发送请求头数据
        // headers: {
        //     //     // 注意：该接口需要授权才能访问
        //     //     //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}

// 获取用户频道列表
export const getUserList = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/channels',
    })
}

// 关注用户
export const addFollow = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/user/followings',
        data: {
            target
        }
    })
}

// 取关用户
export const delFollow = targetId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/user/followings/${targetId}`,
    })
}

// 获取用户个人资料
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/profile',
    })
}

// 编辑用户个人资料（包含实名认证）
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/profile',
        data
    })
}

// 更新用户照片资料
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/photo',
        data
    })
}