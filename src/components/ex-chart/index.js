import ExChart from './index.vue'

ExChart.install = function (Vue) {
  Vue.component(ExChart.name, ExChart)
}

export default ExChart
export { ExChart }
