import Vue from 'vue'
// 导入 Element UI 并注册
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import XtElementUI from 'xt-element-ui'
// import 'xt-element-ui/lib/index.css'


import XtElementUI from '../src/index.js' // 本地组件入口

// 注册 Element UI
Vue.use(Element)

// Vue.use() 时传入配置选项（Chart 组件会自动注册）
Vue.use(XtElementUI)

import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')