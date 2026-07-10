import EchartsUtil from '../components/xt-chart/utils'

const defaultConfig = {
    theme: 'white',
    size: 'medium',
    primaryColor: '#1890ff'
}

let currentConfig = { ...defaultConfig }

const configChangeListeners = []

const emitConfigChange = function(key, value) {
  configChangeListeners.forEach(listener => {
    listener(key, value)
  })
}

export const getConfig = function() {
  return { ...currentConfig }
}

export const setConfig = function(config) {
  if (typeof config !== 'object' || config === null) {
    console.warn('[XtElementUI] setConfig 必须传入对象参数')
    return
  }

  if (config.theme !== undefined) {
    setTheme(config.theme)
  }
  if (config.size !== undefined) {
    setSize(config.size)
  }
  if (config.primaryColor !== undefined) {
    setPrimaryColor(config.primaryColor)
  }
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export const setTheme = function(theme) {
    const validThemes = ['white', 'dark']
    if (!validThemes.includes(theme)) {
      console.warn(`[XtElementUI] 无效的主题值: ${theme}，可选值: ${validThemes.join(', ')}`)
      return
    }
    
    currentConfig.theme = theme
    
    if (isBrowser()) {
      const root = document.documentElement
      
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark')
      } else {
        root.setAttribute('data-theme', theme)
      }
      
      EchartsUtil.changeAllTheme(currentConfig.theme, currentConfig.size)
    }
    
    emitConfigChange('theme', theme)
}

export const setSize = function(size) {
    const validSizes = ['small', 'medium', 'large']
    if (!validSizes.includes(size)) {
      console.warn(`[XtElementUI] 无效的大小值: ${size}，可选值: ${validSizes.join(', ')}`)
      return
    }
    
    currentConfig.size = size
    
    if (isBrowser()) {
      document.documentElement.setAttribute('data-size', size)
      EchartsUtil.changeAllTheme(currentConfig.theme, currentConfig.size)
    }

    emitConfigChange('size', size)
}

// 将十六进制颜色转换为 RGB 对象
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

// 将 RGB 对象转换为十六进制颜色
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

// 计算浅色系列（混合白色）
function lightenColor(hex, percent) {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    
    const amount = Math.round(2.55 * percent)
    const r = Math.min(255, rgb.r + amount)
    const g = Math.min(255, rgb.g + amount)
    const b = Math.min(255, rgb.b + amount)
    
    return rgbToHex(r, g, b)
}

export const setPrimaryColor = function(color) {
    const colorRegex = /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/
    if (!colorRegex.test(color)) {
      console.warn(`[XtElementUI] 无效的颜色值: ${color}，请使用十六进制颜色格式，如 #1890ff`)
      return
    }

    let validColor = color
    if (color.length === 4) {
      validColor = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
    } else if (color.length === 9) {
      validColor = color.substring(0, 7)
    }

    currentConfig.primaryColor = validColor
    
    if (isBrowser()) {
      document.documentElement.style.setProperty('--xt-color-primary', validColor)
      
      document.documentElement.style.setProperty('--xt-color-primary-light-3', lightenColor(validColor, 30))
      document.documentElement.style.setProperty('--xt-color-primary-light-5', lightenColor(validColor, 50))
      document.documentElement.style.setProperty('--xt-color-primary-light-7', lightenColor(validColor, 70))
      document.documentElement.style.setProperty('--xt-color-primary-light-8', lightenColor(validColor, 80))
      document.documentElement.style.setProperty('--xt-color-primary-light-9', lightenColor(validColor, 90))
    }
    
    emitConfigChange('primaryColor', validColor)
}

// 获取当前主题
export const getTheme = function() {
    return currentConfig.theme
}

// 获取当前字体大小
export const getSize = function() {
    return currentConfig.size
}

// 获取当前主色调
export const getPrimaryColor = function() {
    return currentConfig.primaryColor
}

// 重置为默认配置
export const resetConfig = function() {
    setConfig(defaultConfig)
}

// 监听配置变更
export const onConfigChange = function(listener) {
    if (typeof listener === 'function') {
      configChangeListeners.push(listener)
      return function() {
        const index = configChangeListeners.indexOf(listener)
        if (index > -1) {
          configChangeListeners.splice(index, 1)
        }
      }
    } else {
      console.warn('[XtElementUI] onConfigChange 必须传入函数')
    }
}

// ==================== 数字格式化 ====================

export const formatNumber = function(value, options) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }

  const opts = Object.assign({
    decimals: 2,
    thousand: true,
    prefix: '',
    suffix: '',
    showSign: false
  }, options || {})

  let result = num.toFixed(opts.decimals)

  if (opts.thousand) {
    const parts = result.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    result = parts.join('.')
  }

  if (opts.showSign && num > 0) {
    result = '+' + result
  }

  return opts.prefix + result + opts.suffix
}

export const formatThousand = function(value, decimals) {
  return formatNumber(value, {
    decimals: decimals != null ? decimals : 2,
    thousand: true
  })
}

export const formatPercent = function(value, decimals) {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }
  return formatNumber(num * 100, {
    decimals: decimals != null ? decimals : 2,
    thousand: true,
    suffix: '%'
  })
}

// ==================== 日期格式化 ====================

function padZero(num, len) {
  len = len || 2
  return String(num).padStart(len, '0')
}

export const formatDate = function(date, format) {
  if (!date) {
    return ''
  }

  let d
  if (date instanceof Date) {
    d = date
  } else if (typeof date === 'number') {
    d = new Date(date.toString().length === 10 ? date * 1000 : date)
  } else if (typeof date === 'string') {
    date = date.trim()
    if (/^\d+$/.test(date)) {
      d = new Date(date.length === 10 ? parseInt(date) * 1000 : parseInt(date))
    } else {
      d = new Date(date.replace(/-/g, '/'))
    }
  } else {
    return ''
  }

  if (isNaN(d.getTime())) {
    return ''
  }

  const fmt = format || 'yyyy-MM-dd'
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()
  const week = d.getDay()

  const weekMap = ['日', '一', '二', '三', '四', '五', '六']

  return fmt
    .replace('yyyy', year)
    .replace('MM', padZero(month))
    .replace('M', month)
    .replace('dd', padZero(day))
    .replace('d', day)
    .replace('HH', padZero(hour))
    .replace('H', hour)
    .replace('hh', padZero(hour % 12 || 12))
    .replace('h', hour % 12 || 12)
    .replace('mm', padZero(minute))
    .replace('m', minute)
    .replace('ss', padZero(second))
    .replace('s', second)
    .replace('w', weekMap[week])
    .replace('W', '星期' + weekMap[week])
}

export const formatDateTime = function(date, format) {
  return formatDate(date, format || 'yyyy-MM-dd HH:mm:ss')
}

export const formatTime = function(date, format) {
  return formatDate(date, format || 'HH:mm:ss')
}

export const formatRelativeTime = function(date) {
  if (!date) {
    return ''
  }

  let d
  if (date instanceof Date) {
    d = date
  } else if (typeof date === 'number') {
    d = new Date(date.toString().length === 10 ? date * 1000 : date)
  } else if (typeof date === 'string') {
    date = date.trim()
    if (/^\d+$/.test(date)) {
      d = new Date(date.length === 10 ? parseInt(date) * 1000 : parseInt(date))
    } else {
      d = new Date(date.replace(/-/g, '/'))
    }
  } else {
    return ''
  }

  if (isNaN(d.getTime())) {
    return ''
  }

  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前'
  } else if (diff < week) {
    return Math.floor(diff / day) + '天前'
  } else if (diff < month) {
    return Math.floor(diff / week) + '周前'
  } else if (diff < year) {
    return Math.floor(diff / month) + '个月前'
  } else {
    return Math.floor(diff / year) + '年前'
  }
}

// ==================== 金额格式化 ====================

export const formatMoney = function(value, options) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }

  const opts = Object.assign({
    currency: 'CNY',
    decimals: 2,
    prefix: '',
    suffix: '',
    showSign: false
  }, options || {})

  const currencySymbols = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$'
  }

  let symbol = currencySymbols[opts.currency] || ''
  let formatted = num.toFixed(opts.decimals)

  const parts = formatted.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  formatted = parts.join('.')

  if (opts.showSign && num > 0) {
    formatted = '+' + formatted
  }

  if (opts.prefix) {
    formatted = opts.prefix + formatted
  }

  if (opts.suffix) {
    formatted = formatted + opts.suffix
  }

  return symbol + formatted
}

export const formatCNY = function(value, decimals) {
  return formatMoney(value, {
    currency: 'CNY',
    decimals: decimals != null ? decimals : 2
  })
}

export const formatUSD = function(value, decimals) {
  return formatMoney(value, {
    currency: 'USD',
    decimals: decimals != null ? decimals : 2
  })
}

// ==================== 文件大小格式化 ====================

export const formatFileSize = function(bytes) {
  if (bytes === null || bytes === undefined || bytes === '') {
    return ''
  }

  const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes
  if (isNaN(num)) {
    return String(bytes)
  }

  if (num === 0) {
    return '0 B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(num) / Math.log(k))

  return parseFloat((num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default {
    setTheme,
    setSize,
    setPrimaryColor,
    getConfig,
    setConfig,
    getTheme,
    getSize,
    getPrimaryColor,
    resetConfig,
    onConfigChange,
    formatNumber,
    formatThousand,
    formatPercent,
    formatDate,
    formatDateTime,
    formatTime,
    formatRelativeTime,
    formatMoney,
    formatCNY,
    formatUSD,
    formatFileSize
}
