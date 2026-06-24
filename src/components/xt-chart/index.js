import XtChart from './index.vue'

XtChart.install = function (Vue) {
  Vue.component(XtChart.name, XtChart)
}

export default XtChart
export { XtChart }