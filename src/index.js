// 导入主题样式（定义 CSS 变量）
import './styles/css-variables.scss'

// 导入组件样式（统一入口）
import './components/index.scss'

// 导入 SCSS 变量（通过 CSS Modules :export 导出）
import variables from './styles/variables-export.scss'

import utilsModule from './utils/index'

// ES Module 默认导出需要通过 .default 访问
const utils = utilsModule.default || utilsModule

// 从 utils 导入配置管理函数（仅用于存储配置）
const { getConfig, setConfig, getTheme, getSize, getPrimaryColor, resetConfig, onConfigChange, setTheme, setSize, setPrimaryColor } = utils

// 导入组件
import XtButton from './components/xt-button'
import XtInput from './components/xt-input'
import XtFlexBox from './components/xt-flex-box'
import XtCard from './components/xt-card'
import XtCardItem from './components/xt-card-item'
import XtConfigProvider from './components/xt-config-provider'
import XtText from './components/xt-text'
import XtTime from './components/xt-time'
import XtStepPrice from './components/xt-step-price'
import XtStepPriceItem from './components/xt-step-price-item'
import XtMap from './components/xt-map'
import XtMapProvider from './components/xt-map-provider'
import XtGridBox from './components/xt-grid-box'
import XtGridItem from './components/xt-grid-item'
import XtProgress from './components/xt-progress'
import XtTabs from './components/xt-tabs'
import XtBadge from './components/xt-badge'
import XtDatePicker from './components/xt-date-picker'
import XtChart from './components/xt-chart'  // XtChart 组件（基于 ECharts 封装）
import XtIcon from './components/xt-icon'    // XtIcon 组件（支持 el-icon / svg / 自定义字体）
import XtTable from './components/xt-table'  // XtTable 组件（基于 ElementUI Table 封装）
import XtScrollArrow from './components/xt-scroll-arrow'


const components = [
  XtButton,
  XtInput,
  XtFlexBox,
  XtCard, 
  XtCardItem,
  XtConfigProvider,
  XtText,
  XtTime,
  XtStepPrice,
  XtStepPriceItem,
  XtMap,
  XtMapProvider,
  XtGridBox,
  XtGridItem,
  XtProgress,
  XtTabs,
  XtBadge,
  XtDatePicker,
  XtChart,
  XtIcon,
  XtTable,
  XtScrollArrow
]

const install = function (Vue, options = {}) {
  if (install.installed) return
  install.installed = true

  components.forEach(component => {
    Vue.component(component.name, component)
  })
  
  Vue.prototype.$xt = {
    setTheme,
    setSize,
    setPrimaryColor,
    getConfig,
    setConfig,
    getTheme,
    getSize,
    getPrimaryColor,
    resetConfig,
    onConfigChange
  }

  if (options) {
    if (options.theme !== undefined) {
      setTheme(options.theme)
    }
    if (options.size !== undefined) {
      setSize(options.size)
    }
    if (options.primaryColor !== undefined) {
      setPrimaryColor(options.primaryColor)
    }
    if (options.config !== undefined) {
      setConfig(options.config)
    }
  }

}

// 支持全局 script 标签引入
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 导出
export default {
  install,
  components,
  XtButton,
  XtInput,
  XtFlexBox,
  XtCard,
  XtCardItem,
  XtConfigProvider,
  XtText,
  XtTime,
  XtStepPrice,
  XtStepPriceItem,
  XtMap,
  XtMapProvider,
  XtGridBox,
  XtGridItem,
  XtProgress,
  XtTabs,
  XtBadge,
  XtDatePicker,
  XtIcon,
  XtTable,
  XtScrollArrow
}

// XtChart 组件按需导出（使用时需自行安装 echarts 依赖）
export { default as XtChart } from './components/xt-chart'

// XtTable 虚拟滚动演示数据工具
export { createVirtualScrollData, virtualScrollColumns } from './components/xt-table/virtualScrollData'

// 导出工具函数和变量
export {
  utils,
  variables,
  // 配置管理函数（从 utils 导入）
  getConfig,
  setConfig,
  getTheme,
  getSize,
  getPrimaryColor,
  resetConfig,
  onConfigChange,
  setTheme,
  setSize,
  setPrimaryColor
}