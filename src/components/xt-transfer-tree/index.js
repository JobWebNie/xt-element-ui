import XtTransferTree from './index.vue'

XtTransferTree.install = function (Vue) {
  Vue.component(XtTransferTree.name, XtTransferTree)
}

export default XtTransferTree
export { XtTransferTree }