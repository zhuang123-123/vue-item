import Vue from 'vuex'
import Router from 'vue-router'
import routes from './routers'
import iView from 'view-design'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
    routes,
    mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'
const turnTo = (to, access, next) => {
    if (canTurnTo(to.name, access, routes)) next()  // 有权限，可访问
    else iView.Message.error('暂无权限访问')
    // else next({ replace: true, name: 'error_401' })  // 无权限，重定向到401页面 
}

router.beforeEach((to, from, next) => {
    // iView.LoadingBar.start()
    const token = getToken()
    if (!token && to.name === homeName) {
        // 未登录且要跳转的页面是首页
        next({
            name: LOGIN_PAGE_NAME
        })// 跳转
    } else if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面是登录页
        next()
    } else if (to.name === LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面是登录页
        next() // 跳转
    } else {
        next()
    }
})