/**
 * 百度地图适配器 (BMap / Baidu)
 * 百度地图 JS API 3.0 支持自定义样式
 */

import { MapAdapterBase } from './base'
import { hasGlobal } from '../loaders/script-loader'

// 百度地图类型映射
const BAIDU_MAP_TYPES = {
  standard: 'BMAP_NORMAL_MAP',
  satellite: 'BMAP_SATELLITE_MAP',
  hybrid: 'BMAP_HYBRID_MAP',
  traffic: 'BMAP_NORMAL_MAP'    // 路况通过图层叠加
}

// 百度地图自定义样式 ID（主题）
// light: 官方 normal 样式
// dark: 午夜蓝 dark 样式
const BAIDU_STYLES = {
  light: { style: 'normal' },
  dark: { style: 'dark' }
}

export class BaiduAdapter extends MapAdapterBase {
  constructor(container, options = {}) {
    super(container, options)
    this._mapTypeMap = { ...BAIDU_MAP_TYPES }
    this._coordType = options.baiduCoordType || 'bd09ll'
    this._trafficLayer = null
    this._callbackName = null
  }

  getScriptUrl() {
    if (this.apiUrl) return this.apiUrl
    if (!this.apiKey) {
      console.warn('[XtMap] 百度地图需要配置 apiKey (ak)')
      return ''
    }
    // 注意：_callbackName 在 beforeLoadScript 中已注册
    return `https://api.map.baidu.com/api?v=3.0&ak=${encodeURIComponent(this.apiKey)}&callback=${this._callbackName}`
  }

  /**
   * 脚本加载前注册百度 SDK 回调函数
   */
  beforeLoadScript() {
    // 生成唯一 callback 名称，支持多实例
    this._callbackName = `__xt_map_baidu_${Date.now()}_${Math.floor(Math.random() * 100000)}`
    // 注册全局 callback（百度地图 SDK 加载完成后调用）
    if (typeof window !== 'undefined') {
      window[this._callbackName] = () => {
        // 空实现，仅用于触发 Promise resolve
      }
    }
  }

  isSdkLoaded() {
    return hasGlobal('BMap') && typeof window.BMap === 'function'
  }

  async createMap() {
    const BMap = window.BMap
    if (!BMap) throw new Error('[XtMap] 百度地图 SDK 未加载')

    const mapOptions = {
      enableMapClick: false
    }

    this.mapInstance = new BMap.Map(this.container, mapOptions)
    this.mapInstance.centerAndZoom(new BMap.Point(this.center[0], this.center[1]), this.zoom)
    this.mapInstance.enableScrollWheelZoom(true)

    // 应用地图类型
    this._applyMapType(this.mapType)

    // 应用主题
    this._applyTheme(this.theme)

    // 等待地图就绪
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (const [eventName, handler] of this.eventHandlers.entries()) {
      this._bindEvent(eventName, handler)
    }
  }

  _applyMapType(type) {
    if (!this.mapInstance || !window.BMap) return

    try {
      // 清除路况图层
      if (this._trafficLayer) {
        try {
          this.mapInstance.removeTileLayer(this._trafficLayer)
        } catch (e) {}
        this._trafficLayer = null
      }

      if (type === 'satellite') {
        this.mapInstance.setMapType(window.BMAP_SATELLITE_MAP || 1)
      } else if (type === 'hybrid') {
        this.mapInstance.setMapType(window.BMAP_HYBRID_MAP || 2)
      } else if (type === 'traffic') {
        this.mapInstance.setMapType(window.BMAP_NORMAL_MAP || 0)
        // 叠加路况图层
        try {
          const BMap = window.BMap
          this._trafficLayer = new BMap.TrafficLayer()
          this.mapInstance.addTileLayer(this._trafficLayer)
        } catch (e) {
          console.warn('[XtMap] 百度地图加载路况图层失败:', e)
        }
      } else {
        this.mapInstance.setMapType(window.BMAP_NORMAL_MAP || 0)
      }
    } catch (e) {
      console.warn('[XtMap] 百度地图切换地图类型失败:', e)
    }
  }

  _applyTheme(theme) {
    if (!this.mapInstance || !window.BMap) return
    try {
      // 百度 3.0 通过 setMapStyle 设置主题样式
      const styleConfig = BAIDU_STYLES[theme] || BAIDU_STYLES.light
      if (this.mapInstance.setMapStyleV2) {
        // 新版 API
        this.mapInstance.setMapStyleV2({ styleId: styleConfig.style === 'dark' ? 'midnight' : '' })
      } else if (this.mapInstance.setMapStyle) {
        // 旧版 API
        const styleJson = theme === 'dark' ? this._getDarkStyleJson() : null
        if (styleJson) {
          this.mapInstance.setMapStyle({ styleJson: styleJson })
        }
      }
    } catch (e) {
      console.warn('[XtMap] 百度地图设置主题失败:', e)
    }
  }

  /**
   * 简易百度地图 dark 样式 JSON 配置
   */
  _getDarkStyleJson() {
    return [
      { featureType: 'land', elementType: 'geometry', stylers: { color: '#1a1a1a' } },
      { featureType: 'water', elementType: 'geometry', stylers: { color: '#0a1a2a' } },
      { featureType: 'green', elementType: 'geometry', stylers: { color: '#0a2a1a' } },
      { featureType: 'building', elementType: 'geometry', stylers: { color: '#2a2a2a' } },
      { featureType: 'highway', elementType: 'geometry', stylers: { color: '#3a3a3a' } },
      { featureType: 'highway', elementType: 'geometry.stroke', stylers: { color: '#4a4a4a' } },
      { featureType: 'arterial', elementType: 'geometry', stylers: { color: '#333333' } },
      { featureType: 'arterial', elementType: 'geometry.stroke', stylers: { color: '#3d3d3d' } },
      { featureType: 'local', elementType: 'geometry', stylers: { color: '#2a2a2a' } },
      { featureType: 'railway', elementType: 'geometry', stylers: { color: '#3a3a3a' } },
      { featureType: 'subway', elementType: 'geometry', stylers: { color: '#3a3a3a' } },
      { featureType: 'boundary', elementType: 'geometry', stylers: { color: '#666666' } },
      { featureType: 'district', elementType: 'labels.text.fill', stylers: { color: '#888888' } },
      { featureType: 'poi', elementType: 'labels', stylers: { visibility: 'off' } }
    ]
  }

  _applyCenter(center) {
    if (!this.mapInstance || !window.BMap) return
    try {
      this.mapInstance.centerAndZoom(new window.BMap.Point(center[0], center[1]), this.zoom)
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
      if (c) return [c.lng, c.lat]
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
      const eventMap = {
        click: 'click',
        moveend: 'moveend',
        zoomend: 'zoomend',
        zoomchange: 'zoomend',
        mapmove: 'movestart'
      }
      const nativeEvent = eventMap[eventName] || eventName
      this.mapInstance.addEventListener(nativeEvent, (e) => {
        const normalized = {
          originalEvent: e,
          lnglat: e && e.point ? [e.point.lng, e.point.lat] : null
        }
        handler(normalized)
      })
    } catch (err) {
      console.warn('[XtMap] 百度地图事件绑定失败:', eventName, err)
    }
  }

  _unbindEvent(eventName, handler) {
    if (!this.mapInstance) return
    try {
      this.mapInstance.removeEventListener(eventName, handler)
    } catch (e) {
      // 忽略
    }
  }

  _applyResize() {
    if (this.mapInstance && this.mapInstance.enableResize) {
      try {
        // 百度地图默认启用 resize，无需手动调用
        if (typeof this.mapInstance.checkResize === 'function') {
          this.mapInstance.checkResize()
        }
      } catch (e) {
        // 忽略
      }
    }
  }

  destroy() {
    if (this._callbackName && typeof window !== 'undefined') {
      try {
        delete window[this._callbackName]
      } catch (e) {
        // 忽略
      }
    }
    super.destroy()
  }
}

export default BaiduAdapter
