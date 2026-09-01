// 导入主题样式（定义 CSS 变量）
import './styles/css-variables.scss'

// 导入组件样式（统一入口）
import './components/index.scss'

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
import XtTabPane from './components/xt-tab-pane'
import XtTabs from './components/xt-tabs'
import XtBadge from './components/xt-badge'
import XtDatePicker from './components/xt-date-picker'
import XtChart from './components/xt-chart'  // XtChart 组件（基于 ECharts 封装）
import XtIcon from './components/xt-icon'    // XtIcon 组件（支持 el-icon / svg / 自定义字体）
import XtTable from './components/xt-table'  // XtTable 组件（基于 ElementUI Table 封装）
import XtList from './components/xt-list'  // XtList 组件（卡片列表）
import XtScroll from './components/xt-scroll'  // XtScroll 组件（虚拟滚动容器）
import XtBar from './components/xt-chart/XtBar.vue'
import XtLine from './components/xt-chart/XtLine.vue'
import XtPie from './components/xt-chart/XtPie.vue'
import XtMulti from './components/xt-chart/XtMulti.vue'
import XtPage from './components/xt-page'
import XtSelectTree from './components/xt-select-tree'
import XtUpload from './components/xt-upload'
import XtTransferTree from './components/xt-transfer-tree'  // XtTransferTree 组件（树形穿梭框）
import XtFormSchema from './components/xt-form-schema'  // XtFormSchema 组件（表单配置化搜索）
import XtFlow from './components/xt-flow'  // XtFlow 组件（审批流程轨迹）
import XtMobileDatePicker from './components/xt-mobile-date-picker'  // XtMobileDatePicker 组件（移动端日期时间选择器）
import XtMobilePicker from './components/xt-mobile-picker'  // XtMobilePicker 组件（移动端选项选择器）
import Theme from './components/theme'  // Theme 模块（iframe 主题注入工具）

// 可安装组件集合（key 与组件 name 一致），统一驱动 install 与默认导出，避免多处置复维护
const Components = {
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
  XtTabPane,
  XtTabs,
  XtBadge,
  XtDatePicker,
  XtChart,
  XtIcon,
  XtTable,
  XtList,
  XtScroll,
  XtBar,
  XtLine,
  XtPie,
  XtMulti,
  XtPage,
  XtSelectTree,
  XtUpload,
  XtTransferTree,
  XtFormSchema,
  XtFlow,
  XtMobileDatePicker,
  XtMobilePicker
}

const install = function (Vue, options = {}) {
  if (install.installed) return
  install.installed = true

  Object.values(Components).forEach(component => {
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

// 默认导出（安装入口 + 全部组件 + 主题模块）
export default {
  install,
  ...Components,
  Theme
}

// 命名导出（配置函数 + 工具 + 全部组件 + 主题模块）
export {
  utils,
  // 配置管理函数
  getConfig,
  setConfig,
  getTheme,
  getSize,
  getPrimaryColor,
  resetConfig,
  onConfigChange,
  setTheme,
  setSize,
  setPrimaryColor,
  // 组件
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
  XtTabPane,
  XtTabs,
  XtBadge,
  XtDatePicker,
  XtChart,
  XtIcon,
  XtTable,
  XtList,
  XtScroll,
  XtBar,
  XtLine,
  XtPie,
  XtMulti,
  XtPage,
  XtSelectTree,
  XtUpload,
  XtTransferTree,
  XtFormSchema,
  XtFlow,
  XtMobileDatePicker,
  XtMobilePicker,
  // 主题模块
  Theme
}