import XtList from './index.vue'

XtList.install = function (Vue) {
  Vue.component(XtList.name, XtList)
}

export default XtList
export { XtList }