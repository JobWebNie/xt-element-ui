import XtFormSchema from './index.vue'

XtFormSchema.install = function (Vue) {
  Vue.component(XtFormSchema.name, XtFormSchema)
}

export default XtFormSchema
export { XtFormSchema }