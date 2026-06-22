/**
 * 高德地图适配器 (AMap)
 * 以高德为基准，所有 xt-map 枚举直接映射
 */

import { MapAdapterBase } from './base'
import { hasGlobal } from '../loaders/script-loader'

const A_MAP_MAP_TYPES = {
  standard: 'amap',           // 标准/矢量
  satellite: 'satellite',     // 卫星
  hybrid: 'satellite',        // 混合（卫星+路网，用卫星+路网图层组合实现）
  traffic: 'traffic'          // 实时路况（叠加在 standard 上）
}

// 高德地图样式 ID（主题映射）
const A_MAP_STYLES = {
  light: 'amap://styles/normal',
  dark: 'amap://styles/dark'
}

export class AMapAdapter extends MapAdapterBase {
  constructor(container, options = {}) {
    super(container, options)
    this._mapTypeMap = { ...A_MAP_MAP_TYPES }
    this._trafficLayer = null       // 路况图层引用
    this._satelliteLayer = null     // 卫星图层
    this._roadnetLayer = null       // 路网图层（用于 hybrid）
    this._currentLayers = []        // 当前叠加图层
  }

  getScriptUrl() {
    if (this.apiUrl) return this.apiUrl
    if (!this.apiKey) {
      console.warn('[XtMap] 高德地图需要配置 apiKey')
      return ''
    }
    // 高德 2.0 Web API
    return `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(this.apiKey)}&plugin=AMap.Scale,AMap.ToolBar`
  }

  /**
   * 脚本加载前设置高德 2.0 安全密钥
   */
  beforeLoadScript() {
    const securityJsCode = this.options.securityJsCode || (typeof window !== 'undefined' && window._AMapSecurityConfig && window._AMapSecurityConfig.securityJsCode) || ''
    if (securityJsCode && typeof window !== 'undefined') {
      window._AMapSecurityConfig = {
        securityJsCode: securityJsCode
      }
    }
  }

  isSdkLoaded() {
    return hasGlobal('AMap') && typeof window.AMap === 'function'
  }

  async createMap() {
    const AMap = window.AMap
    if (!AMap) throw new Error('[XtMap] 高德地图 SDK 未加载')

    const mapOptions = {
      center: this.center,
      zoom: this.zoom,
      mapStyle: A_MAP_STYLES[this.theme] || A_MAP_STYLES.light,
      viewMode: '2D',
      resizeEnable: true
    }

    this.mapInstance = new AMap.Map(this.container, mapOptions)

    // 应用地图类型
    this._applyMapType(this.mapType)

    // 绑定事件（延迟到地图就绪后）
    await new Promise((resolve) => {
      this.mapInstance.on('complete', () => resolve())
      // 兜底：1秒后强制 resolve
      setTimeout(resolve, 1500)
    })

    // 重新绑定已注册事件
    for (const [eventName, handler] of this.eventHandlers.entries()) {
      this._bindEvent(eventName, handler)
    }
  }

  _applyMapType(type) {
    if (!this.mapInstance) return
    const AMap = window.AMap
    if (!AMap) return

    // 清除所有叠加图层
    this._clearLayers()

    try {
      // 设置底图样式
      this.mapInstance.setMapStyle(A_MAP_STYLES[this.theme] || A_MAP_STYLES.light)

      if (type === 'satellite') {
        this._satelliteLayer = new AMap.TileLayer.Satellite()
        this.mapInstance.add(this._satelliteLayer)
        this._currentLayers.push(this._satelliteLayer)
      } else if (type === 'hybrid') {
        // 卫星 + 路网
        this._satelliteLayer = new AMap.TileLayer.Satellite()
        this._roadnetLayer = new AMap.TileLayer.RoadNet()
        this.mapInstance.add([this._satelliteLayer, this._roadnetLayer])
        this._currentLayers.push(this._satelliteLayer, this._roadnetLayer)
      } else if (type === 'traffic') {
        // 路况图层叠加在 standard 上
        this._trafficLayer = new AMap.TileLayer.Traffic({
          autoRefresh: true,
          interval: 180
        })
        this.mapInstance.add(this._trafficLayer)
        this._currentLayers.push(this._trafficLayer)
      }
    } catch (e) {
      console.warn('[XtMap] 设置地图类型失败:', e)
    }
  }

  _clearLayers() {
    if (!this.mapInstance) return
    try {
      if (this._currentLayers.length > 0) {
        this.mapInstance.remove(this._currentLayers)
      }
    } catch (e) {
      // 忽略
    }
    this._currentLayers = []
    this._trafficLayer = null
    this._satelliteLayer = null
    this._roadnetLayer = null
  }

  _applyTheme(theme) {
    if (!this.mapInstance) return
    try {
      this.mapInstance.setMapStyle(A_MAP_STYLES[theme] || A_MAP_STYLES.light)
      // 主题变更可能影响图层显示，重新应用地图类型
      this._applyMapType(this.mapType)
    } catch (e) {
      console.warn('[XtMap] 设置主题失败:', e)
    }
  }

  _applyCenter(center) {
    if (!this.mapInstance) return
    try {
      this.mapInstance.setCenter(center)
    } catch (e) {
      // 忽略
    }
  }

  _applyZoom(zoom) {
    if (!this.mapInstance) return
    try {
      this.mapInstance.setZoom(zoom)
    } catch (e) {
      // 忽略
    }
  }

  getCenter() {
    if (this.mapInstance && this.mapInstance.getCenter) {
      const c = this.mapInstance.getCenter()
      return [c.lng, c.lat]
    }
    return this.center
  }

  getZoom() {
    if (this.mapInstance && this.mapInstance.getZoom) {
      return this.mapInstance.getZoom()
    }
    return this.zoom
  }

  _bindEvent(eventName, handler) {
    if (!this.mapInstance) return
    try {
      // 统一事件名映射
      const eventMap = {
        click: 'click',
        moveend: 'moveend',
        zoomend: 'zoomend',
        zoomchange: 'zoomchange',
        mapmove: 'mapmove',
        complete: 'complete',
        resize: 'resize'
      }
      const nativeEvent = eventMap[eventName] || eventName
      this.mapInstance.on(nativeEvent, (e) => {
        // 统一事件参数格式
        const normalized = {
          originalEvent: e,
          lnglat: e && e.lnglat ? [e.lnglat.lng, e.lnglat.lat] : null
        }
        handler(normalized)
      })
    } catch (err) {
      console.warn('[XtMap] 事件绑定失败:', eventName, err)
    }
  }

  _unbindEvent(eventName, handler) {
    if (!this.mapInstance) return
    try {
      this.mapInstance.off(eventName, handler)
    } catch (e) {
      // 忽略
    }
  }

  _applyResize() {
    if (this.mapInstance && this.mapInstance.resize) {
      try {
        this.mapInstance.resize()
      } catch (e) {
        // 忽略
      }
    }
  }

  destroy() {
    this._clearLayers()
    super.destroy()
  }
}

export default AMapAdapter
