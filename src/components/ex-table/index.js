import ExTable from './index.vue'

ExTable.install = function (Vue) {
  Vue.component(ExTable.name, ExTable)
}

export default ExTable
export { ExTable }
