// 《 数据共享 》

import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'
Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
    state: {
        // user: null
        // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
        user: getItem(TOKEN_KEY)
    },
    mutations: {
        setUser(state, data) {
            console.log(state)
            console.log(data)
            state.user = data
                // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
            setItem(TOKEN_KEY, state.user)
        }
    },
    actions: {},
    modules: {}
})