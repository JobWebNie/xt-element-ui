import XtTabs from './index.vue'
import XtTabPane from './TabPane.vue'

XtTabs.install = function(Vue) {
  Vue.component(XtTabs.name, XtTabs)
  Vue.component(XtTabPane.name, XtTabPane)
}

export default XtTabs
export { XtTabPane }
