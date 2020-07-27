import Vue from 'vue'
import Vuex from 'vuex'
import Vuexceshi from './module/Vuexceshi.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: '111',
    names: 'vuex'
  },
  mutations: {
    sendt (state, data) {
      state.name = data.name
    }
  },
  actions: {
    sendToMutation({commit}, data) {
      commit('sendt', data)
    }
  },
  modules: {
    Vuexceshi
  }
})
