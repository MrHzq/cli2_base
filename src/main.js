import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import AxiosPlugin from 'axios-plugin'
import VueToolPlugin from 'vue-tool-plugin'
import './components/global'

Vue.use(VueToolPlugin, { router })

const isTest = process.env.PATH_ENV === 'test'
console.log('isTest：' + isTest)

Vue.use(AxiosPlugin, require.context('@/apiurl', true, /\.js$/), {
    baseURL: '/api',
    // 请求拦截之前
    beforeRequest(config) {
        console.log(config)
        return config
    },
    // 接口响应成功事件
    respSuccess(res) {
        console.log(res)
    },
    // 接口响应失败事件
    respError(e) {
        console.log(e)
    }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})
