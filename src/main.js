/* 作者：平原
 * 创建：2017-5 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Store from './vuex/store'
import ElementUI from 'element-ui'
import './styles/element-theme-tinfinite/index.scss'
import lazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(lazyload)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  router,
  store: Store,
  template: '<App/>',
  components: { App }
}).$mount('#app')
