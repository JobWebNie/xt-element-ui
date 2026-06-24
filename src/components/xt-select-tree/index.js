import XtSelectTree from './index.vue'

XtSelectTree.install = function (Vue) {
  Vue.component(XtSelectTree.name, XtSelectTree)
}

export default XtSelectTree
export { XtSelectTree }