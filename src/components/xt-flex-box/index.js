import './style/index.scss'
import XtFlexBox from './index.vue'

XtFlexBox.install = function (Vue) {
  Vue.component(XtFlexBox.name, XtFlexBox)
}

export default XtFlexBox
export { XtFlexBox }
