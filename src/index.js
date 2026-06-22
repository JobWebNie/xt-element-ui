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
import { XtMapProvider } from './components/xt-map'
import XtGridBox from './components/xt-grid-box'
import XtGridItem from './components/xt-grid-item'
import ExDatePicker from './components/ex-date-picker'
import ExButton from './components/ex-button'
import ExChart from './components/ex-chart'  // ExChart 组件（基于 ECharts 封装）
import ExCard from './components/ex-card'
import ExIcon from './components/ex-icon'    // ExIcon 组件（支持 el-icon / svg / 自定义字体）
import ExTable from './components/ex-table'  // ExTable 组件（基于 ElementUI Table 封装）

// 导入 Element UI 组件注册配置
import { registerElementExComponents } from './config/element-registry'

// 存储组件列表
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
  ExDatePicker,
  ExButton,
  ExChart,
  ExCard,
  ExIcon,
  ExTable
]

// 定义 install 方法，Vue.use() 会自动调用
const install = function (Vue, options = {}) {
  if (install.installed) return
  install.installed = true

  // 全局注册所有组件
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  
  // 将工具方法挂载到 Vue.prototype
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

  // 在安装时直接应用配置选项
  if (options) {
    // 处理主题配置
    if (options.theme !== undefined) {
      setTheme(options.theme)
    }
    // 处理字体大小配置
    if (options.size !== undefined) {
      setSize(options.size)
    }
    // 处理主色调配置
    if (options.primaryColor !== undefined) {
      setPrimaryColor(options.primaryColor)
    }
    // 处理完整配置对象
    if (options.config !== undefined) {
      setConfig(options.config)
    }
  }

if (process.env.NODE_ENV === 'development') {
  // 导入内部 element-ui 依赖（作为内部依赖，不与外部冲突）
  const ElementUI = require('element-ui')
  
  // 注册 ElementUI 的基础组件（用于 ExTable 等封装组件内部使用）
  // 不调用 Vue.use(ElementUI)，避免全局污染
  // ex-table 等组件内部会直接使用 element-ui 的组件
  
  // 在开发环境下注册 ElementUI 组件为 Ex 开头（方便文档和示例使用）
    registerElementExComponents(Vue, ElementUI)
  }

  // 调用统一的注册函数
}

// 支持全局 script 标签引入
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 导出
export default {
  install,
  // 导出组件列表
  components,
  // 按需导出组件
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
  ExDatePicker,
  ExButton,
  ExCard,
  ExIcon,
  ExTable
}

// ExChart 组件按需导出（使用时需自行安装 echarts 依赖）
export { default as ExChart } from './components/ex-chart'

// ExTable 虚拟滚动演示数据工具
export { createVirtualScrollData, virtualScrollColumns } from './components/ex-table/virtualScrollData'

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