/* ============================================================
 * XT-Element-UI Theme 模块入口
 * 
 * 提供：
 *   1. 静态 CSS 样式文件（用于注入到 iframe）
 *   2. IframeThemeInjector - iframe 主题注入工具
 *   3. 便捷的工厂函数
 * ============================================================ */

import IframeThemeInjector, { createInjector } from './iframe-injector'

// 使用 raw-loader 以原始字符串形式导入 CSS 文件
// eslint-disable-next-line
const elementVarsCSS = require('!!raw-loader!./element-vars.css').default || require('!!raw-loader!./element-vars.css')
// eslint-disable-next-line
const elementOverridesCSS = require('!!raw-loader!./element-overrides.css').default || require('!!raw-loader!./element-overrides.css')

/**
 * 合并后的完整 CSS 内容
 * 可直接注入到 iframe 的 <head> 中
 */
const fullThemeCSS = elementVarsCSS + '\n' + elementOverridesCSS

/**
 * 创建一个预配置好 CSS 内容的 IframeThemeInjector 实例
 * 这是推荐的使用方式，无需手动提供 CSS 内容
 * 
 * @param {Object} options
 * @param {string} [options.theme='white'] - 初始主题 'white' | 'dark'
 * @param {string} [options.primaryColor='#1890ff'] - 初始主色调
 * @param {boolean} [options.persist=false] - 是否持久化主题配置
 * @param {Function} [options.onThemeChange] - 主题变化回调
 * @returns {IframeThemeInjector}
 * 
 * @example
 * // 基本使用
 * const injector = createThemeInjector({ theme: 'white' })
 * injector.injectAll('iframe')
 * 
 * @example
 * // 切换主题
 * injector.setTheme('dark')
 * 
 * @example
 * // 自动监听新增 iframe
 * injector.startObserving()
 */
function createThemeInjector(options = {}) {
  return createInjector({
    ...options,
    baseCSS: fullThemeCSS
  })
}

export {
  IframeThemeInjector,
  createInjector,
  createThemeInjector,
  elementVarsCSS,
  elementOverridesCSS,
  fullThemeCSS
}

export default createThemeInjector