import './style/index.scss'
import XtCardItem from './index.vue'

XtCardItem.install = function (Vue) {
  Vue.component(XtCardItem.name, XtCardItem)
}

export default XtCardItem
export { XtCardItem }
