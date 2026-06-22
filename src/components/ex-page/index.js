import ExPage from './index.vue'

ExPage.install = function (Vue) {
  Vue.component(ExPage.name, ExPage)
}

export default ExPage
export { ExPage }
