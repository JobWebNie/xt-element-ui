import XtTable from './index.vue'

XtTable.install = function (Vue) {
  Vue.component(XtTable.name, XtTable)
}

export default XtTable
export { XtTable }