import XtMap from './index.vue'
import XtMapProvider from './provider.vue'
import './style/index.scss'

XtMap.install = function (Vue) {
  Vue.component(XtMap.name, XtMap)
}

XtMapProvider.install = function (Vue) {
  Vue.component(XtMapProvider.name, XtMapProvider)
}

export { XtMap, XtMapProvider }

export default {
  install(Vue) {
    Vue.component(XtMap.name, XtMap)
    Vue.component(XtMapProvider.name, XtMapProvider)
  },
  XtMap,
  XtMapProvider
}
