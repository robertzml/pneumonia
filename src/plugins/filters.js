import util from './util'

const filters = Vue => {
  Vue.filter('displayDateTime', function(date) {
    return util.displayDateTime(date)
  })

  Vue.filter('displayDate', function(date) {
    return util.displayDate(date)
  })

  Vue.filter('displayBoolean1', function(val) {
    if (val == null || val == undefined) {
      return ''
    }

    return val ? '是' : '否'
  })

  Vue.filter('callType', function(val) {
    return util.callType(val)
  })

  Vue.filter('category', function(val) {
    return util.category(val)
  })

  Vue.filter('staffType', function(val) {
    return util.staffType(val)
  })

  Vue.filter('roomType', function(val) {
    return util.roomType(val)
  })

  Vue.filter('showReside', function(val) {
    return util.showReside(val)
  })
}

export default filters
