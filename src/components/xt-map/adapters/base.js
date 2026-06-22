/**
 * 地图适配器基类
 * 定义统一的 API 接口，各地图引擎（高德/天地图/百度）通过继承/实现该接口完成适配
 *
 * 统一坐标系统：WGS84 (lng, lat) 作为输入输出标准，各适配器内部处理转换
 * 统一地图类型：standard | satellite | hybrid | traffic
 * 统一主题：light | dark
 */

import { loadScript, hasGlobal } from '../loaders/script-loader'

// 地图类型 -> 内部常量（各适配器可覆盖转换）
const DEFAULT_MAP_TYPE_MAP = {
  standard: 'standard',
  satellite: 'satellite',
  hybrid: 'hybrid',
  traffic: 'traffic'
}

export class MapAdapterBase {
  constructor(container, options = {}) {
    this.container = container
    this.options = options
    this.mapInstance = null
    this.mapType = options.mapType || 'standard'
    this.theme = options.theme || 'light'
    this.center = options.center || [116.397428, 39.90923]
    this.zoom = options.zoom || 11
    this.apiKey = options.apiKey || ''
    this.apiUrl = options.apiUrl || null
    this.plugins = options.plugins || []
    this.eventHandlers = new Map()
    this.ready = false
    this._mapTypeMap = { ...DEFAULT_MAP_TYPE_MAP }
  }

  /**
   * 获取 SDK 脚本 URL（各适配器必须实现）
   * @returns {string}
   */
  getScriptUrl() {
    throw new Error('[XtMap] 子类必须实现 getScriptUrl()')
  }

  /**
   * 检查 SDK 是否已加载
   */
  isSdkLoaded() {
    throw new Error('[XtMap] 子类必须实现 isSdkLoaded()')
  }

  /**
   * 在脚本加载前执行（可选覆盖）
   * 用于设置 securityJsCode、注册全局 callback 等前置准备
   */
  beforeLoadScript() {
    // 可选实现 - 各适配器可覆盖
  }

  /**
   * 创建地图实例（各适配器必须实现）
   */
  async createMap() {
    throw new Error('[XtMap] 子类必须实现 createMap()')
  }

  /**
   * 加载 SDK 并初始化地图
   */
  async init() {
    if (!this.container) {
      throw new Error('[XtMap] 缺少容器元素')
    }

    if (!this.isSdkLoaded()) {
      // 1. 脚本加载前执行钩子（设置安全密钥等）
      this.beforeLoadScript()

      // 2. 获取脚本 URL
      const url = this.getScriptUrl()
      if (!url) {
        throw new Error('[XtMap] 缺少 API URL，请配置 apiKey 或 apiUrl')
      }

      // 3. 动态加载脚本
      await loadScript(url)

      // 4. 等待 SDK 初始化全局对象（部分 SDK 需要等待 callback 或脚本内部初始化完成）
      await this._waitForSdkReady()
    }

    // 5. 创建地图实例
    await this.createMap()
    this.ready = true
    return this.mapInstance
  }

  /**
   * 等待 SDK 准备好（部分地图 SDK 需要等待 callback 执行）
   */
  async _waitForSdkReady() {
    return new Promise((resolve) => {
      let attempts = 0
      const maxAttempts = 100
      const check = () => {
        if (this.isSdkLoaded() || attempts >= maxAttempts) {
          resolve()
        } else {
          attempts++
          setTimeout(check, 100)
        }
      }
      check()
    })
  }

  /**
   * 统一地图类型转换：xt-map 枚举 -> 引擎内部值
   */
  getNativeMapType(xtType) {
    return this._mapTypeMap[xtType] || this._mapTypeMap.standard
  }

  /**
   * 设置地图类型
   */
  setMapType(type) {
    this.mapType = type
    if (this.ready && this.mapInstance) {
      this._applyMapType(type)
    }
  }

  /**
   * 应用地图类型到引擎（各适配器实现）
   */
  _applyMapType(type) {
    // 可选实现
  }

  /**
   * 设置主题
   */
  setTheme(theme) {
    this.theme = theme
    if (this.ready && this.mapInstance) {
      this._applyTheme(theme)
    }
  }

  /**
   * 应用主题到引擎（各适配器实现）
   */
  _applyTheme(theme) {
    // 可选实现
  }

  /**
   * 设置中心坐标 [lng, lat]
   */
  setCenter(center) {
    this.center = center
    if (this.ready && this.mapInstance) {
      this._applyCenter(center)
    }
  }

  _applyCenter(center) {
    // 各适配器实现
  }

  /**
   * 设置缩放级别
   */
  setZoom(zoom) {
    this.zoom = zoom
    if (this.ready && this.mapInstance) {
      this._applyZoom(zoom)
    }
  }

  _applyZoom(zoom) {
    // 各适配器实现
  }

  /**
   * 获取当前中心坐标
   */
  getCenter() {
    return this.center
  }

  /**
   * 获取当前缩放级别
   */
  getZoom() {
    return this.zoom
  }

  /**
   * 获取原始地图实例（用于高级自定义操作）
   */
  getNativeMap() {
    return this.mapInstance
  }

  /**
   * 绑定事件（统一事件名：click, moveend, zoomend, ready 等）
   */
  on(eventName, handler) {
    if (typeof handler !== 'function') return
    this.eventHandlers.set(eventName, handler)
    if (this.ready && this.mapInstance) {
      this._bindEvent(eventName, handler)
    }
  }

  _bindEvent(eventName, handler) {
    // 各适配器实现具体事件绑定
  }

  /**
   * 解绑事件
   */
  off(eventName) {
    const handler = this.eventHandlers.get(eventName)
    if (handler && this.ready && this.mapInstance) {
      this._unbindEvent(eventName, handler)
    }
    this.eventHandlers.delete(eventName)
  }

  _unbindEvent(eventName, handler) {
    // 各适配器实现
  }

  /**
   * 调整地图大小（容器尺寸变化后调用）
   */
  resize() {
    if (this.ready && this.mapInstance) {
      this._applyResize()
    }
  }

  _applyResize() {
    // 各适配器实现
  }

  /**
   * 销毁地图
   */
  destroy() {
    this.eventHandlers.clear()
    if (this.mapInstance && typeof this.mapInstance.destroy === 'function') {
      try {
        this.mapInstance.destroy()
      } catch (e) {
        // 忽略销毁错误
      }
    }
    this.mapInstance = null
    this.ready = false
  }
}

export default MapAdapterBase
