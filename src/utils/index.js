import EchartsUtil from '../components/ex-chart/utils'

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
    onConfigChange
}
