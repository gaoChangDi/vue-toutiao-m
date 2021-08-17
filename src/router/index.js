// 《 路由模块 》
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'login',
    component: () =>
        import ('@/views/login') //导入login组件懒加载
}, {
    path: '/',
    // name: 'layout',
    component: () =>
        import ('@/views/layout'), //导入login组件懒加载
    children: [{
            path: '',
            name: 'home',
            component: () =>
                import ('@/views/home')
        },
        {
            path: '/qa',
            name: 'qa',
            component: () =>
                import ('@/views/qa')
        },
        {
            path: '/video',
            name: 'video',
            component: () =>
                import ('@/views/video')
        }, {
            path: '/my',
            name: 'my',
            component: () =>
                import ('@/views/my')
        }
    ]
}]

const router = new VueRouter({
    routes
})

export default router