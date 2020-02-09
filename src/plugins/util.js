// 辅助工具类
import moment from 'moment'
import dict from './dict'

export default {
  displayDateTime(date) {
    if (date === null || date == undefined || date === '') {
      return ''
    } else {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },

  displayDate(date) {
    if (date === null || date == undefined || date === '') {
      return ''
    } else {
      return moment(date).format('YYYY-MM-DD')
    }
  },

  // 日期选择器格式
  pickerDayFormat: val => {
    if (val != null || val != undefined) {
      let date = new Date(val)
      return date.getDate()
    } else {
      return ''
    }
  },

  // 房间类型
  roomType: type => {
    if (type == 1) {
      return '蠡湖家园'
    } else if (type == 2) {
      return '青教公寓'
    } else {
      return ''
    }
  },

  // 联系情况
  callType: type => {
    let ct = dict.callType.find(r => r.value == type)
    if (ct != undefined) {
      return ct.text
    } else {
      return ''
    }
  },

  // 人员分类
  category: type => {
    let wt = dict.category.find(r => r.value == type)
    if (wt != undefined) {
      return wt.text
    } else {
      return ''
    }
  },

  staffType: type => {
    let ct = dict.staffType.find(r => r.value == type)
    if (ct != undefined) {
      return ct.text
    } else {
      return ''
    }
  }
}
