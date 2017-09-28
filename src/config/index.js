/* 配置表
 * 作者：张军祥
 * 创建：2017 */

import Cookie from '../utils/cookie'

// 全局常量
const win = window
const loc = win.location
const host = loc.host
const port = loc.port
const APP_ENV = host.split('.')[0].split('-')[1] ? host.split('.')[0].split('-')[1] : 'pro'
const ENV = APP_ENV === 'pro' ? '' : '-' + APP_ENV

// 初始变量
let APP_ID = ''
let APP_HOST = ''
let DEVICE_ID_KEY = ''
let APP_IS_LOCAL = false
let PREFIX_OLD = '//api-saas.tinfinite.com'
let PREFIX = '//course-api.tinfinite.com'
let PREFIX_BBS = '//bbs-api.tinfinite.com'
let PREFIX_EXERCISE = '//exercise-api.tinfinite.com'
let LIVE_PREFIX = '//liveshow-api.tinfinite.com'
let SOCKET_PREFIX = '//liveshow-socket.tinfinite.com'
let USER_PREFIX = '//u.tinfinite.com'
let APP_TOKEN_KEY = '_app_token'

// for host
APP_HOST = host

// top level hostname
let topHostMatch = loc.hostname.match(/\.([^.]+\.com)$/) || loc.hostname.match(/([^.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]

// for host
APP_HOST = TOP_LEVEL_HOST

// for appId & appLogo
if (!TOP_LEVEL_HOST) {
  throw new Error('url is wrong!')
} else {
  APP_ID = '56c6c309243cb728205a3dff'
  DEVICE_ID_KEY = '_device_id_' + APP_ID
}

// for env
if (port) {
  APP_IS_LOCAL = true
}

// 判断有没有 env 有的话就是客户端 使用约定的token
let env = Cookie.getCookie('_app_env_' + APP_ID)
let suffix = APP_ENV === 'pro' ? '' : '-' + APP_ENV
let SUFFIX = APP_ENV === 'pro' ? '' : APP_ENV
let SUFFIX_HTTP = APP_ENV === 'pro' ? '' : '-' + APP_ENV
if (env) {
  APP_TOKEN_KEY = '_app_token_' + APP_ID
  PREFIX = '//course-api' + suffix + '.tinfinite.com'
} else {
  // 没有env就是在web端  使用老版配置
  let SUFFIX = APP_ENV === 'pro' ? '' : APP_ENV

  if (SUFFIX) {
    APP_TOKEN_KEY = SUFFIX === 'pro' ? '_app_token' : '_app_token_' + SUFFIX
    PREFIX_OLD = '//api-saas' + SUFFIX_HTTP + '.tinfinite.com'
    PREFIX = '//course-api' + SUFFIX_HTTP + '.tinfinite.com'
    PREFIX_BBS = '//bbs-api' + SUFFIX_HTTP + '.tinfinite.com'
    PREFIX_EXERCISE = '//exercise-api' + SUFFIX_HTTP + '.tinfinite.com'
    LIVE_PREFIX = '//liveshow-api' + SUFFIX_HTTP + '.tinfinite.com'
    SOCKET_PREFIX = '//liveshow-socket' + SUFFIX_HTTP + '.tinfinite.com'
    USER_PREFIX = '//u' + SUFFIX_HTTP + '.tinfinite.com'
  }
}

const USER_ID_KEY = APP_ENV === 'pro' ? '_user_id' : '_user_id' + '_' + SUFFIX
const USER_INFO_KEY = APP_ENV === 'pro' ? 'user_info' : 'user_info' + '_' + SUFFIX
const DEFAULT_AVATAR = '//o3pvuu23u.qnssl.com/img/default_avatar.png'

// localStorage
let SOTRAGE_PREFIX = 'xsdx'

// 直播回放AES加密key
let AES_KEY = 'playBack'

export {
  APP_HOST,
  APP_IS_LOCAL,
  APP_ID,
  TOP_LEVEL_HOST,
  APP_ENV,
  ENV,
  DEVICE_ID_KEY,
  APP_TOKEN_KEY,
  PREFIX_OLD,
  PREFIX,
  PREFIX_BBS,
  PREFIX_EXERCISE,
  LIVE_PREFIX,
  SOCKET_PREFIX,
  USER_ID_KEY,
  USER_INFO_KEY,
  DEFAULT_AVATAR,
  SOTRAGE_PREFIX,
  USER_PREFIX,
  AES_KEY
}
