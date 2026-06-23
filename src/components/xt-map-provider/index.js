import XtMapProvider from '../xt-map/provider.vue'

XtMapProvider.install = function (Vue) {
  Vue.component(XtMapProvider.name, XtMapProvider)
}

export default XtMapProvider
export { XtMapProvider }
