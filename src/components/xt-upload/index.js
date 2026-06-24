import XtUpload from './index.vue'

XtUpload.install = function (Vue) {
  Vue.component(XtUpload.name, XtUpload)
}

export default XtUpload
export { XtUpload }