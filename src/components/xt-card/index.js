import './style/index.scss'
import XtCard from './index.vue'

XtCard.install = function (Vue) {
  Vue.component(XtCard.name, XtCard)
}

export default XtCard