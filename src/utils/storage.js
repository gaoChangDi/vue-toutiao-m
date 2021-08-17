//《 封装本地存储操作模块：让token持久化 》

//存储token
export const setItem = (key, value) => {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        window.localStorage.setItem(key, value)
    }
    //获取token
export const getItem = key => {
    const data = window.localStorage.getItem(key)
    try {
        // console.log(JSON.parse(data));
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}

//删除token

export const removeItem = key => {
    window.localStorage.removeItem(key)
}