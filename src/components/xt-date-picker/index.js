import './style/index.scss'
import XtDatePicker from './index.vue'

XtDatePicker.install = function (Vue) {
  Vue.component(XtDatePicker.name, XtDatePicker)
}

export default XtDatePicker
export { XtDatePicker }