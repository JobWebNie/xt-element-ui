import './style/index.scss'
import XtButton from './index.vue'

XtButton.install = function (Vue) {
  Vue.component(XtButton.name, XtButton)
}

export default XtButton
export { XtButton }