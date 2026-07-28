import './style/index.scss'
import XtScroll from './index.vue'

XtScroll.install = function (Vue) {
  Vue.component(XtScroll.name, XtScroll)
}

export default XtScroll
export { XtScroll }