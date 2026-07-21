import './style/index.scss'
import XtText from './index.vue'

XtText.install = function (Vue) {
  Vue.component(XtText.name, XtText)
}

export default XtText
export { XtText }
