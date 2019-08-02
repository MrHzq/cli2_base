import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import createPersistedState from 'vuex-persistedstate'

if (!window.Vuex) Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // token信息
        token: 'token1'
    },
    mutations,
    plugins: [createPersistedState({ storage: window.sessionStorage })]
})
