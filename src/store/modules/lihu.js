// 蠡湖家园管理模块

export default {
  namespaced: true,
  state: {
    // 合同管理显示页面
    tab: 'LihuList',

    // 当前合同对象
    roomId: 0,

    // 刷新事件
    refreshEvent: false
  },

  actions: {
    // 显示信息页面
    showDetails(context, id) {
      context.commit('setTab', 'LihuDetails')
      context.commit('setRoomId', id)
    },

    showEdit(context, id) {
      context.commit('setTab', 'LihuEdit')
      context.commit('setRoomId', id)
    },

    // 显示列表页面
    showList({ commit }) {
      commit('setTab', 'LihuList')
    }
  },

  mutations: {
    // 设置显示页面
    setTab: (state, tab) => {
      state.tab = tab
    },

    // 设置房间ID
    setRoomId: (state, val) => {
      state.roomId = val
    },

    // 刷新操作
    refresh: state => {
      state.refreshEvent = !state.refreshEvent
    }
  }
}
