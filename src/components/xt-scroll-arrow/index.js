import './style/index.scss'
import XtScrollArrow from './index.vue'

XtScrollArrow.install = function (Vue) {
  Vue.component(XtScrollArrow.name, XtScrollArrow)
}

export default XtScrollArrow
export { XtScrollArrow }