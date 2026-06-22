import ExUpload from './index.vue'

ExUpload.install = function (Vue) {
  Vue.component(ExUpload.name, ExUpload)
}

export default ExUpload
export { ExUpload }
