import ExButton from './index.vue'

ExButton.install = function (Vue) {
  Vue.component(ExButton.name, ExButton)
}

export default ExButton
export { ExButton }
