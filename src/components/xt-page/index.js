import XtPage from './index.vue'

XtPage.install = function (Vue) {
  Vue.component(XtPage.name, XtPage)
}

export default XtPage
export { XtPage }