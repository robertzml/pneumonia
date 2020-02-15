export default {
  isLogin: state => {
    return state.user.login
  },

  userInfo: state => {
    return state.user
  },

  userName: state => {
    return state.user.userName
  },

  // 提示消息
  alertMessage: state => {
    return state.alertMessage
  },

  departmentList: state => {
    return state.departmentList
  }
}
