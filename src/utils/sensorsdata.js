import cookie from './cookie.js'
import { APP_ENV } from '../config/'
const port = window.location.port

export default {
  track: function () {
    if (APP_ENV === 'pro' && !port) {
      window.sa.login(cookie.getCookie('_user_id') || '未登录的状态')
      // 自动追踪
      window.sa.quick('autoTrack')
    }
  },
  saEvent: function (title, name = 'pageview') {
    if (APP_ENV === 'pro' && !port) {
      window.sa.track(name, {
        screen_title_level_1: title
      })
    }
  },
  saStayed: function (name, duration) {
    if (APP_ENV === 'pro' && !port) {
      window.sa.track(name, {
        pageStayTime: duration,
        pageUrl: window.location.href
      })
    }
  }
}
