import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import lihu from './modules/lihu'
import young from './modules/young'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    lihu,
    young
  }
})
