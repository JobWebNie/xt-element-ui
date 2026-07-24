import './style/index.scss'
import XtFlow from './index.vue'

XtFlow.install = function(Vue) {
  Vue.component(XtFlow.name, XtFlow)
}

export default XtFlow