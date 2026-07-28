/**
 * 颜色工具函数
 * 供 utils/index.js 和 theme/iframe-injector.js 共同使用
 */

/**
 * 十六进制颜色转 RGB 字符串 "r, g, b"
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '24, 144, 255'
}

/**
 * 十六进制颜色转 RGB 对象 { r, g, b }
 */
export function hexToRgbObject(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * RGB 对象转十六进制
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * 加深颜色（amount 范围 0-100，表示减少的量）
 */
export function darkenColor(hex, amount) {
  const obj = hexToRgbObject(hex)
  if (!obj) return hex
  const r = Math.max(0, obj.r - amount)
  const g = Math.max(0, obj.g - amount)
  const b = Math.max(0, obj.b - amount)
  return rgbToHex(r, g, b)
}

/**
 * 减淡/变亮颜色（percent 范围 0-100，表示增加的百分比）
 */
export function lightenColor(hex, percent) {
  const obj = hexToRgbObject(hex)
  if (!obj) return hex
  const amount = Math.round(2.55 * percent)
  const r = Math.min(255, obj.r + amount)
  const g = Math.min(255, obj.g + amount)
  const b = Math.min(255, obj.b + amount)
  return rgbToHex(r, g, b)
}

/**
 * 根据主色调生成 Element UI 主色 CSS 变量
 * 返回 { '--el-color-primary': hex, '--el-color-primary-light-3': hex, ... }
 */
export function generatePrimaryColorVars(primaryColor) {
  const prefix = '--el-color-primary'
  return {
    [prefix]: primaryColor,
    [`${prefix}-light-3`]: lightenColor(primaryColor, 30),
    [`${prefix}-light-5`]: lightenColor(primaryColor, 50),
    [`${prefix}-light-7`]: lightenColor(primaryColor, 70),
    [`${prefix}-light-8`]: lightenColor(primaryColor, 80),
    [`${prefix}-light-9`]: lightenColor(primaryColor, 90),
    [`${prefix}-dark-2`]: darkenColor(primaryColor, 20),
    [`${prefix}-rgb`]: hexToRgb(primaryColor)
  }
}

/**
 * 根据主色调生成 xt 组件主色 CSS 变量
 * 返回 { '--xt-color-primary': hex, ... }
 */
export function generateXtPrimaryColorVars(primaryColor) {
  const prefix = '--xt-color-primary'
  return {
    [prefix]: primaryColor,
    [`${prefix}-light-3`]: lightenColor(primaryColor, 30),
    [`${prefix}-light-5`]: lightenColor(primaryColor, 50),
    [`${prefix}-light-7`]: lightenColor(primaryColor, 70),
    [`${prefix}-light-8`]: lightenColor(primaryColor, 80),
    [`${prefix}-light-9`]: lightenColor(primaryColor, 90)
  }
}

export default {
  hexToRgb,
  hexToRgbObject,
  rgbToHex,
  darkenColor,
  lightenColor,
  generatePrimaryColorVars,
  generateXtPrimaryColorVars
}