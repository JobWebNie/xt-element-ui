import XtMap from './index.vue'
import XtMapProvider from './provider.vue'
import './style/index.scss'

// 为组件添加 install 方法，支持 Vue.use() 单独引入
XtMap.install = function (Vue) {
  Vue.component(XtMap.name, XtMap)
}

XtMapProvider.install = function (Vue) {
  Vue.component(XtMapProvider.name, XtMapProvider)
}

// 导出单个组件，支持按需引入
export { XtMap, XtMapProvider }

// 导出默认对象，支持全量引入
export default {
  install(Vue) {
    Vue.component(XtMap.name, XtMap)
    Vue.component(XtMapProvider.name, XtMapProvider)
  },
  // 确保导出的组件对象包含 name 属性
  XtMap,
  XtMapProvider
}

// 为了兼容旧版本，同时导出组件的 name 属性
export const XtMapName = XtMap.name
export const XtMapProviderName = XtMapProvider.name