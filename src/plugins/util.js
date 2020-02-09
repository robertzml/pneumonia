// 辅助工具类
import moment from 'moment'
import dict from './dict'
import XLSX from 'xlsx'

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

  /**
   * 通用的打开下载对话框方法，没有测试过具体兼容性
   * @param url 下载地址，也可以是一个blob对象，必选
   * @param saveName 保存文件名，可选
   */
  openDownloadDialog: function(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url) // 创建blob地址
    }
    var aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event
    if (window.MouseEvent) event = new MouseEvent('click')
    else {
      event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    }
    aLink.dispatchEvent(event)
  },

  // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
  sheet2blob: function(sheet, sheetName) {
    sheetName = sheetName || 'sheet1'
    var workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    }
    workbook.Sheets[sheetName] = sheet
    // 生成excel的配置项
    var wopts = {
      bookType: 'xlsx', // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: 'binary'
    }
    var wbout = XLSX.write(workbook, wopts)
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    // 字符串转ArrayBuffer
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    }
    return blob
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
