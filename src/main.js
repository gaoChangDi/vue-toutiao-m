// 《 入口文件 》

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less' //全局样式
import Vant from 'vant' //导入所有vant组件
import 'vant/lib/index.css' //vant样式
import 'amfe-flexible' //设置rem基准值
import './utils/day' // 加载 dayjs 初始化配置

Vue.use(Vant) //注册并使用vant

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')