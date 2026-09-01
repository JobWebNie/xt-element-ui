/**
 * 主题 CSS 变量常量
 * 供 utils/config.js 和 theme/iframe-injector.js 共同使用
 * 定义 Element UI 组件主题相关的 CSS 变量映射
 */
import { generatePrimaryColorVars, generateXtPrimaryColorVars } from './color'

/**
 * 亮色主题 Element UI CSS 变量（关键子集：主色/背景/文字/边框/填充/遮罩）
 */
export const LIGHT_THEME_VARS = {
  '--el-color-primary': '#1890ff',
  '--el-color-success': '#67c23a',
  '--el-color-warning': '#e6a23c',
  '--el-color-danger': '#f56c6c',
  '--el-color-error': '#f56c6c',
  '--el-color-info': '#909399',
  '--el-bg-color': '#ffffff',
  '--el-bg-color-page': '#f2f3f5',
  '--el-bg-color-overlay': '#ffffff',
  '--el-text-color-primary': '#303133',
  '--el-text-color-regular': '#606266',
  '--el-text-color-secondary': '#909399',
  '--el-text-color-placeholder': '#a8abb2',
  '--el-text-color-disabled': '#c0c4cc',
  '--el-border-color': '#dcdfe6',
  '--el-border-color-light': '#e4e7ed',
  '--el-border-color-lighter': '#ebeef5',
  '--el-fill-color': '#f0f2f5',
  '--el-fill-color-light': '#f5f7fa',
  '--el-fill-color-lighter': '#fafafa',
  '--el-mask-color': 'rgba(255, 255, 255, .9)',
  '--el-mask-color-extra-light': 'rgba(255, 255, 255, .3)'
}

/**
 * 暗色主题 Element UI CSS 变量（对应 LIGHT_THEME_VARS 的暗色版本）
 */
export const DARK_THEME_VARS = {
  '--el-color-primary': '#409eff',
  '--el-color-success': '#67c23a',
  '--el-color-warning': '#e6a23c',
  '--el-color-danger': '#f56c6c',
  '--el-color-error': '#f56c6c',
  '--el-color-info': '#909399',
  '--el-bg-color': '#141414',
  '--el-bg-color-page': '#0a0a0a',
  '--el-bg-color-overlay': '#1d1e1f',
  '--el-text-color-primary': '#E5EAF3',
  '--el-text-color-regular': '#CFD3DC',
  '--el-text-color-secondary': '#A3A6AD',
  '--el-text-color-placeholder': '#8D9095',
  '--el-text-color-disabled': '#6C6E72',
  '--el-border-color': '#4C4D4F',
  '--el-border-color-light': '#414243',
  '--el-border-color-lighter': '#363637',
  '--el-fill-color': '#303030',
  '--el-fill-color-light': '#262727',
  '--el-fill-color-lighter': '#1D1D1D',
  '--el-mask-color': 'rgba(0, 0, 0, .8)',
  '--el-mask-color-extra-light': 'rgba(0, 0, 0, .3)'
}

/**
 * 品牌色映射
 * 用于微前端架构中根据品牌标识切换主题主色
 */
export const BRAND_COLORS = {
  water: { light: '#0077be', dark: '#0099cc' },
  electricity: { light: '#2ecc71', dark: '#27ae60' },
  gas: { light: '#f39c12', dark: '#e67e22' }
}

/**
 * 主题存储 key
 */
export const THEME_STORAGE_KEY = 'xt-element-ui-theme-config'

/**
 * 主题变化事件名
 */
export const THEME_CHANGE_EVENT = 'xt-theme-change'

/**
 * 将主题相关 CSS 变量应用到任意 DOM 元素
 * 统一 utils/config.js（主文档）和 iframe-injector.js（iframe）的变量设置逻辑
 *
 * @param {HTMLElement} element - 目标元素（通常是 document.documentElement）
 * @param {Object} config
 * @param {string} config.theme - 'white' | 'dark'
 * @param {string} [config.primaryColor] - 主色调 hex
 * @param {string} [config.brand] - 品牌标识 '' | 'water' | 'electricity' | 'gas'
 */
export function applyThemeVars(element, config) {
  if (!element) return

  const { theme = 'white', primaryColor, brand = '' } = config
  const style = element.style

  // 1. 设置 data-theme / data-brand 属性
  element.setAttribute('data-theme', theme)
  if (brand) {
    element.setAttribute('data-brand', brand)
  } else {
    element.removeAttribute('data-brand')
  }

  // 2. 应用主题变量（亮色/暗色）
  const themeVars = theme === 'dark' ? DARK_THEME_VARS : LIGHT_THEME_VARS
  for (const key in themeVars) {
    style.setProperty(key, themeVars[key])
  }

  // 3. 应用主色调变量
  let color = primaryColor
  if (brand && BRAND_COLORS[brand]) {
    color = BRAND_COLORS[brand][theme === 'dark' ? 'dark' : 'light'] || primaryColor
  }
  if (color) {
    const primaryVars = generatePrimaryColorVars(color)
    for (const key in primaryVars) {
      style.setProperty(key, primaryVars[key])
    }
  }

  // 4. 同步设置 xt 组件主色变量（--xt-*）
  if (color) {
    const xtVars = generateXtPrimaryColorVars(color)
    for (const key in xtVars) {
      style.setProperty(key, xtVars[key])
    }
  }
}

export default {
  LIGHT_THEME_VARS,
  DARK_THEME_VARS,
  BRAND_COLORS,
  THEME_STORAGE_KEY,
  THEME_CHANGE_EVENT,
  applyThemeVars
}