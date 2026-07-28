/* ============================================================
 * XT-Element-UI iframe 主题注入工具
 * 
 * 使用场景：微前端架构中，主系统统一管理主题，子系统通过 iframe 嵌入。
 * 子系统为标准 Element UI 项目，无需任何改造。
 * 
 * 设计：
 *   - 主题状态的唯一事实源是 utils/index.js（setTheme / setPrimaryColor）
 *   - 本模块仅负责 iframe DOM 操作（注入、MutationObserver、持久化、广播）
 *   - 通过订阅 utils.onConfigChange 实现主文档和 iframe 的同步
 *   - setTheme / setPrimaryColor 委托给 utils，保持外部 API 不变
 * 
 * 工作流程：
 *   1. 主系统调用 utils.setTheme('dark') → utils 同步更新 --xt-* + --el-* 变量
 *   2. utils emitConfigChange → 所有 IframeThemeInjector 实例收到通知
 *   3. 实例将新主题应用到其管理的所有 iframe
 *   4. 持久化、广播事件、回调
 * ============================================================ */

import { setTheme as _setTheme, setPrimaryColor as _setPrimaryColor, getConfig as _getConfig, onConfigChange as _onConfigChange } from '../../utils/index'
import { applyThemeVars, BRAND_COLORS, THEME_STORAGE_KEY, THEME_CHANGE_EVENT } from '../../utils/theme-vars'

/**
 * IframeThemeInjector 类
 * 负责向 iframe 注入主题 CSS 并管理 iframe 侧主题状态
 * 
 * 注意：主文档的 --el-* / --xt-* CSS 变量由 utils/index.js 管理，
 * 本类仅负责 iframe 内的同步，避免重复设置主文档变量。
 */
class IframeThemeInjector {
  /**
   * @param {Object} options
   * @param {string} options.baseCSS - 基础 CSS 内容（注入到 iframe 的 <head>）
   * @param {string} [options.theme='white'] - 初始主题 'white' | 'dark'
   * @param {string} [options.primaryColor='#1890ff'] - 初始主色调
   * @param {string} [options.brand=''] - 品牌标识 '' | 'water' | 'electricity' | 'gas'
   * @param {boolean} [options.persist=false] - 是否持久化主题配置到 localStorage
   * @param {Function} [options.onThemeChange] - 主题变化回调
   */
  constructor(options = {}) {
    if (!options.baseCSS) {
      console.warn('[IframeThemeInjector] baseCSS 未提供，主题样式将无法注入到 iframe')
    }

    this.baseCSS = options.baseCSS || ''
    this.theme = options.theme || 'white'
    this.brand = options.brand || ''
    this.persist = options.persist || false
    this.onThemeChange = options.onThemeChange || null

    // 主色调：如果有 brand，优先使用 brand 对应的颜色
    this.primaryColor = options.primaryColor || this._getBrandColor()
    this._userPrimaryColor = options.primaryColor || '#1890ff'

    // 管理的 iframe 列表
    // Map<HTMLIFrameElement, { styleEl: HTMLStyleElement, injected: boolean }>
    this.iframes = new Map()

    // MutationObserver 用于自动检测新增 iframe
    this._observer = null
    this._observerTarget = null

    // 注入计数器（用于去重定时器）
    this._injectPending = new Set()

    // 订阅 utils 配置变更，实现主文档和 iframe 的主题同步
    this._unsubscribe = _onConfigChange((key, value) => {
      this._onUtilsConfigChange(key, value)
    })
  }

  // ==================== 公共方法 ====================

  /**
   * 向指定 iframe 注入主题 CSS
   * @param {HTMLIFrameElement} iframe - iframe 元素
   * @returns {boolean} 是否注入成功
   */
  inject(iframe) {
    if (!iframe) {
      console.warn('[IframeThemeInjector] inject: iframe 参数为空')
      return false
    }

    // 如果已注入，跳过
    if (this.iframes.has(iframe)) {
      return true
    }

    return this._doInject(iframe)
  }

  /**
   * 批量注入：注入所有匹配选择器的 iframe
   * @param {string} [selector='iframe'] - CSS 选择器
   * @returns {number} 成功注入的数量
   */
  injectAll(selector = 'iframe') {
    const iframes = document.querySelectorAll(selector)
    let count = 0
    iframes.forEach(iframe => {
      if (this.inject(iframe)) count++
    })
    return count
  }

  /**
   * 切换主题
   * 委托给 utils 处理主文档 CSS 变量，本类负责 iframe 同步
   * @param {string} theme - 'white' | 'dark'
   * @param {Object} [options]
   * @param {string} [options.primaryColor] - 主色调
   * @param {string} [options.brand] - 品牌色
   */
  setTheme(theme, options = {}) {
    if (theme !== 'white' && theme !== 'dark') {
      console.warn('[IframeThemeInjector] setTheme: 无效的主题值，使用 "white"', theme)
      theme = 'white'
    }

    const prevTheme = this.theme
    this.theme = theme

    if (options.primaryColor) {
      this.primaryColor = options.primaryColor
      this._userPrimaryColor = options.primaryColor
    } else if (options.brand || this.brand) {
      this.brand = options.brand || this.brand
      this.primaryColor = this._getBrandColor()
    }

    if (options.brand !== undefined) {
      this.brand = options.brand
    }

    // 委托给 utils 处理主文档的 CSS 变量设置
    _setTheme(theme)
    if (this.primaryColor) {
      _setPrimaryColor(this.primaryColor)
    }

    // 同步所有 iframe
    this.iframes.forEach((_, iframeEl) => {
      try {
        if (iframeEl.contentDocument) {
          this._applyThemeToDocument(iframeEl.contentDocument)
        }
      } catch (e) { /* 跨域 iframe 无法访问 */ }
    })

    // 持久化
    if (this.persist) {
      this._saveToStorage()
    }

    // 广播事件
    this._broadcastChange()

    // 回调
    if (this.onThemeChange) {
      this.onThemeChange({
        theme: this.theme,
        primaryColor: this.primaryColor,
        brand: this.brand,
        prevTheme
      })
    }
  }

  /**
   * 设置主色调
   * @param {string} color - hex 颜色值，如 '#1890ff'
   */
  setPrimaryColor(color) {
    this.primaryColor = color
    this._userPrimaryColor = color
    this.brand = '' // 清除品牌色

    // 委托给 utils 处理主文档
    _setPrimaryColor(color)

    // 同步 iframe
    this._applyPrimaryColorToAll()
  }

  /**
   * 设置品牌色
   * @param {string} brand - '' | 'water' | 'electricity' | 'gas'
   */
  setBrand(brand) {
    this.brand = brand
    this.primaryColor = this._getBrandColor()

    // 委托给 utils 处理主文档
    _setPrimaryColor(this.primaryColor)

    // 同步 iframe
    this._applyPrimaryColorToAll()
  }

  /**
   * 移除指定 iframe 的注入
   * @param {HTMLIFrameElement} iframe
   */
  remove(iframe) {
    const info = this.iframes.get(iframe)
    if (info && info.styleEl && info.styleEl.parentNode) {
      info.styleEl.parentNode.removeChild(info.styleEl)
    }
    this.iframes.delete(iframe)
    this._injectPending.delete(iframe)
  }

  /**
   * 移除所有注入
   */
  removeAll() {
    this.iframes.forEach((info, iframe) => {
      if (info.styleEl && info.styleEl.parentNode) {
        info.styleEl.parentNode.removeChild(info.styleEl)
      }
    })
    this.iframes.clear()
    this._injectPending.clear()
  }

  /**
   * 开始自动监听 DOM 变化，自动注入新添加的 iframe
   * @param {HTMLElement} [target=document.body] - 监听的容器元素
   */
  startObserving(target) {
    this.stopObserving()

    this._observerTarget = target || document.body
    this._observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          // 直接添加的 iframe
          if (node.tagName === 'IFRAME') {
            this._handleNewIframe(node)
          }
          // 包含 iframe 的子元素
          if (node.querySelectorAll) {
            node.querySelectorAll('iframe').forEach(iframe => {
              this._handleNewIframe(iframe)
            })
          }
        })
      })
    })

    this._observer.observe(this._observerTarget, {
      childList: true,
      subtree: true
    })
  }

  /**
   * 停止自动监听
   */
  stopObserving() {
    if (this._observer) {
      this._observer.disconnect()
      this._observer = null
    }
    this._observerTarget = null
  }

  /**
   * 获取当前主题配置
   * @returns {Object}
   */
  getConfig() {
    return {
      theme: this.theme,
      primaryColor: this.primaryColor,
      brand: this.brand
    }
  }

  /**
   * 获取已注入的 iframe 数量
   * @returns {number}
   */
  getIframeCount() {
    return this.iframes.size
  }

  /**
   * 销毁实例，清理所有资源
   */
  destroy() {
    this.removeAll()
    this.stopObserving()
    if (this._unsubscribe) {
      this._unsubscribe()
      this._unsubscribe = null
    }
  }

  // ==================== utils 变更响应 ====================

  /**
   * 响应 utils 配置变更，同步到所有 iframe
   * 统一使用 applyThemeVars 处理主题+主色变量
   */
  _onUtilsConfigChange(key, value) {
    if (key === 'theme') {
      this.theme = value
    } else if (key === 'primaryColor') {
      this.primaryColor = value
    } else {
      return
    }
    this._applyPrimaryColorToAll()
  }

  // ==================== 私有方法 ====================

  /**
   * 执行实际的注入操作
   */
  _doInject(iframe) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document
      if (!doc || !doc.head) {
        // iframe 尚未加载完成，等待 load 事件
        iframe.addEventListener('load', () => this._doInject(iframe), { once: true })
        return false
      }

      // 检查是否已注入过（防止重复）
      const existing = doc.head.querySelector('style[data-xt-theme-injector]')
      if (existing) {
        this.iframes.set(iframe, { styleEl: existing, injected: true })
        this._applyThemeToDocument(doc)
        return true
      }

      // 创建 style 元素并注入
      const styleEl = doc.createElement('style')
      styleEl.setAttribute('data-xt-theme-injector', '')
      styleEl.setAttribute('type', 'text/css')
      styleEl.textContent = this.baseCSS
      doc.head.appendChild(styleEl)

      // 应用主题变量
      this._applyThemeToDocument(doc)

      // 记录
      this.iframes.set(iframe, { styleEl, injected: true })

      return true
    } catch (e) {
      console.warn('[IframeThemeInjector] 无法注入主题到 iframe（可能是跨域限制）:', e.message)
      return false
    }
  }

  /**
   * 处理新检测到的 iframe
   */
  _handleNewIframe(iframe) {
    if (this.iframes.has(iframe) || this._injectPending.has(iframe)) {
      return
    }

    this._injectPending.add(iframe)

    const tryInject = () => {
      this._injectPending.delete(iframe)
      if (!this.iframes.has(iframe)) {
        this._doInject(iframe)
      }
    }

    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      tryInject()
    } else {
      iframe.addEventListener('load', tryInject, { once: true })
    }
  }

  /**
   * 将主题配置应用到指定文档（iframe 内）
   * 统一使用 applyThemeVars 处理 CSS 变量
   */
  _applyThemeToDocument(doc) {
    if (!doc || !doc.documentElement) return

    applyThemeVars(doc.documentElement, {
      theme: this.theme,
      primaryColor: this.primaryColor,
      brand: this.brand
    })
  }

  /**
   * 更新所有 iframe 文档的主色调
   * 统一使用 applyThemeVars 处理
   */
  _applyPrimaryColorToAll() {
    this.iframes.forEach((_, iframeEl) => {
      try {
        if (iframeEl.contentDocument) {
          applyThemeVars(iframeEl.contentDocument.documentElement, {
            theme: this.theme,
            primaryColor: this.primaryColor,
            brand: this.brand
          })
        }
      } catch (e) { /* 跨域 */ }
    })
  }

  /**
   * 获取品牌色对应的主色调
   */
  _getBrandColor() {
    if (!this.brand || !BRAND_COLORS[this.brand]) {
      return this._userPrimaryColor || '#1890ff'
    }
    const colors = BRAND_COLORS[this.brand]
    return this.theme === 'dark' ? colors.dark : colors.light
  }

  /**
   * 持久化到 localStorage
   */
  _saveToStorage() {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
        theme: this.theme,
        primaryColor: this._userPrimaryColor,
        brand: this.brand,
        timestamp: Date.now()
      }))
    } catch (e) {
      console.warn('[IframeThemeInjector] 保存主题配置失败:', e.message)
    }
  }

  /**
   * 从 localStorage 恢复配置
   */
  _loadFromStorage() {
    if (typeof localStorage === 'undefined') return null
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      return null
    }
  }

  /**
   * 广播主题变化事件
   */
  _broadcastChange() {
    if (typeof window === 'undefined') return
    try {
      window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, {
        detail: {
          theme: this.theme,
          primaryColor: this.primaryColor,
          brand: this.brand,
          timestamp: Date.now()
        },
        bubbles: true,
        composed: true
      }))
    } catch (e) {
      // 忽略
    }
  }
}

/**
 * 创建 IframeThemeInjector 实例并自动从 localStorage 恢复配置
 * @param {Object} options
 * @returns {IframeThemeInjector}
 */
function createInjector(options = {}) {
  const injector = new IframeThemeInjector(options)

  // 如果启用持久化，尝试从 localStorage 恢复
  if (options.persist) {
    const stored = injector._loadFromStorage()
    if (stored) {
      injector.theme = stored.theme || 'white'
      injector.brand = stored.brand || ''
      injector._userPrimaryColor = stored.primaryColor || '#1890ff'
      injector.primaryColor = stored.primaryColor || injector._getBrandColor()
    }
  }

  return injector
}

export default IframeThemeInjector
export { createInjector, IframeThemeInjector }