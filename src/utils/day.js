import Vue from 'vue'
//ES6引入方式导入dayjs
import dayjs from 'dayjs'

//ES6引入方式加载中文语言包
import 'dayjs/locale/zh-cn'
// dayjs 默认语言是英文，我们这里配置为中文(全局使用)
dayjs.locale('zh-cn')

//按需导入相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)
    // console.log(dayjs().to(dayjs('1990')));

Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))
})