// 用户相关请求模块
import request from '@/utils/request'

// 全部频道列表
export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/channels',
    })
}

// 批量修改用户频道列表（部分覆盖）
export const addUserChannel = channel => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/channels',
        data: {
            channels: [channel]
        }
    })
}

// 删除指定用户频道
export const deleteUserChannel = channelId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/user/channels/${channelId}`,
    })
}