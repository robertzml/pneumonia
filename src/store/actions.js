import * as axios from '../plugins/axios'

export default {
  /** 登录 */
  login({ commit }, payload) {
    //const res = await axios._postqs({ url: '/user/login', params: payload })
    commit('login', {
      login: true,
      userName: payload.userName
    })
  },

  /** 注销 */
  logout({ commit }) {
    commit('logout')
  },

  /** 初始化字典 */
  initDict({ commit }) {
    axios._get({ url: '/utility/getEntityStatus' }).then(res => {
      commit('entityStatus', res.data)
    })
  },

  initDepartment({ commit }) {
    axios._get({ url: '/dep' }).then(res => {
      commit('setDepartment', res.data)
    })
  }
}
