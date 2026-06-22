import XtStepPrice from './index.vue'
import XtStepPriceItem from '../xt-step-price-item/index.vue'

XtStepPrice.install = function (Vue) {
  Vue.component(XtStepPrice.name, XtStepPrice)
  Vue.component(XtStepPriceItem.name, XtStepPriceItem)
}

// 同时导出组件和 install 方法，支持多种引入方式
export default XtStepPrice
export { XtStepPrice, XtStepPriceItem }