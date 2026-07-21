import './style/index.scss'
import XtConfigProvider from './index.vue'

XtConfigProvider.install = function (Vue) {
  Vue.component(XtConfigProvider.name, XtConfigProvider)
}

export default XtConfigProvider
export { XtConfigProvider }
