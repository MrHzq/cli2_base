import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import mutations from './mutations.js'

if (!window.Vuex) Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // token信息
        token: 'token1'
    },
    mutations: mutations,
    plugins: [createPersistedState({ storage: window.sessionStorage })]
})
