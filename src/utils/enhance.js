/* 函数工具库
 * 作者：平原
 * 创建：2017-6-15 */

const arrToObjByKey = (key, arr) => {
  if (!key) {
    throw new Error('arrToObjByKey in enhance.js is lack of key')
  }
  if (typeof key !== 'string') {
    throw new Error('arrToObjByKey in enhance.js, key should be string')
  }
  let result = {}
  for (let item of arr) {
    if (item && item[key]) {
      result[item[key]] = item
    }
  }
  return result
}

// 阻止滚动冒泡
const stopScrollBubble = el => {
  let scrollHeight = el.scrollHeight
  let clientHeight = el.clientHeight
  el.addEventListener('mousewheel', e => {
    let scrollTop = el.scrollTop
    let scrollOffset = scrollHeight - clientHeight - scrollTop
    // console.log(scrollOffset)
    if ((e.wheelDelta < 0 && scrollOffset === 0) || (e.wheelDelta > 0 && scrollTop === 0)) {
      e.preventDefault()
    } else {
      e.returnValue = true
    }
  })
}

const strCount = (str) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2
    } else {
      len++
    }
  }
  return len
}

const objKeySort = (obj) => {
  let newkey = Object.keys(obj).sort()
  let newObj = {}
  for (let i in newkey) {
    newObj[newkey[i]] = obj[newkey[i]]
  }
  return newObj
}

const getUrlQuery = (key) => {
  let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  let res = window.location.search.substr(1).match(reg)
  if (res !== null) {
    return unescape(res[2])
  }
  return null
}

/* eslint-disable */
const imgFilter = (value) => {
  if (!value) {
    return value
  }
  let res = value.match(/^(?:[^\/]*)\/\/(.+)/)
  res = res ? ('//' + res[1]) : ''

  if (res.indexOf('wx.img.tinfinite.com') !== -1) { // for https
    res = res.replace('wx.img', 'wx-img')
  }
  return res
}
/* eslint-disable */

const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      if (key === 'i' || key === 's') {
        value = '0' + value
      }
    }
    return value || 0
  })
  return timeStr
}

const formatTime = (time, option) => {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化时间
const getQueryObject = (url) => {
  url = url === null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}


// 自动调整输入框高度
const adjustTextareaHeight = (el, height, offset) => {
  if (!el) return
  // 防止篇幅过长时改变height导致滚动条瞎跳
  // 预先记录一下页面的滚动值
  let pageYOffset = window.pageYOffset
  el.style.height = height + 'px'
  el.style.height = (el.scrollHeight - offset) + 'px'
  // 恢复页面的滚动值
  window.scroll(0, pageYOffset)
}

export {
  arrToObjByKey,
  stopScrollBubble,
  strCount,
  objKeySort,
  deepClone,
  getUrlQuery,
  imgFilter,
  parseTime,
  formatTime,
  getQueryObject,
  adjustTextareaHeight
}
