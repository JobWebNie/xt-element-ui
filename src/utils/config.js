// ==================== 全局配置管理 ====================

import EchartsUtil from '../components/xt-chart/utils'
import { applyThemeVars } from './theme'

const defaultConfig = {
    theme: 'white',
    size: 'medium',
    primaryColor: '#1890ff'
}

let currentConfig = { ...defaultConfig }

const configChangeListeners = []

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

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

/**
 * 设置主题（亮/暗）
 * 通过 applyThemeVars 统一设置 --el-* CSS 变量，确保组件库和 Element UI 同步响应
 * 同时设置 --xt-* CSS 变量供 xt 组件使用
 */
export const setTheme = function(theme) {
    const validThemes = ['white', 'dark']
    if (!validThemes.includes(theme)) {
      console.warn(`[XtElementUI] 无效的主题值: ${theme}，可选值: ${validThemes.join(', ')}`)
      return
    }

    currentConfig.theme = theme

    if (isBrowser()) {
      const root = document.documentElement

      // 统一通过 applyThemeVars 设置 --el-* 和 --xt-* 变量
      applyThemeVars(root, {
        theme,
        primaryColor: currentConfig.primaryColor
      })

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
      const root = document.documentElement

      // 统一通过 applyThemeVars 设置 --el-* 和 --xt-* 主色变量
      applyThemeVars(root, {
        theme: currentConfig.theme,
        primaryColor: validColor
      })
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