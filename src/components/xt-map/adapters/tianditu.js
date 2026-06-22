/**
 * 天地图适配器 (Tianditu)
 * 天地图使用 WMTS 切片服务，不支持原生主题切换，
 * dark/light 通过图层样式参数模拟（部分图层可调整色调）
 */

import { MapAdapterBase } from './base'
import { hasGlobal } from '../loaders/script-loader'

// 天地图地图类型映射
const TIANDITU_MAP_TYPES = {
  standard: 'vec',           // 矢量地图
  satellite: 'img',          // 影像地图
  hybrid: 'img',             // 混合（影像 + 注记）
  traffic: 'vec'             // 天地图不支持原生路况，降级为矢量
}

// 天地图主题色模拟：通过调整图层透明度/色调CSS滤镜
const TIANDITU_THEME_FILTER = {
  light: 'none',
  dark: 'invert(1) hue-rotate(180deg) saturate(1.2) brightness(0.95)'
}

export class TiandituAdapter extends MapAdapterBase {
  constructor(container, options = {}) {
    super(container, options)
    this._mapTypeMap = { ...TIANDITU_MAP_TYPES }
    this._layerType = options.tiandituLayerType || 'vec'
    this._currentLayer = null
    this._annotationLayer = null
  }

  getScriptUrl() {
    if (this.apiUrl) return this.apiUrl
    if (!this.apiKey) {
      console.warn('[XtMap] 天地图需要配置 apiKey (tk)')
      return ''
    }
    return `https://api.tianditu.gov.cn/api?v=4.0&tk=${encodeURIComponent(this.apiKey)}`
  }

  isSdkLoaded() {
    return hasGlobal('T') && typeof window.T === 'object' && window.T.Map
  }

  async createMap() {
    const T = window.T
    if (!T || !T.Map) throw new Error('[XtMap] 天地图 SDK 未加载')

    const mapOptions = {
      center: new T.LngLat(this.center[0], this.center[1]),
      zoom: this.zoom
    }

    this.mapInstance = new T.Map(this.container, mapOptions)

    // 应用地图类型
    this._applyMapType(this.mapType)

    // 应用主题
    this._applyTheme(this.theme)

    // 等待地图就绪
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    // 绑定事件
    for (const [eventName, handler] of this.eventHandlers.entries()) {
      this._bindEvent(eventName, handler)
    }
  }

  _applyMapType(type) {
    if (!this.mapInstance) return
    const T = window.T
    if (!T) return

    try {
      // 天地图通过 switchTo 方法切换图层
      const layerType = this._mapTypeMap[type] || 'vec'

      if (type === 'standard') {
        // 矢量地图
        this.mapInstance.setMapType(window.TMAP_NORMAL_MAP || 1)
      } else if (type === 'satellite') {
        // 影像地图
        this.mapInstance.setMapType(window.TMAP_SATELLITE_MAP || 2)
      } else if (type === 'hybrid') {
        // 混合（影像+注记）
        this.mapInstance.setMapType(window.TMAP_HYBRID_MAP || 3)
      } else {
        // 路况等特殊类型，天地图无原生支持
        this.mapInstance.setMapType(window.TMAP_NORMAL_MAP || 1)
      }
    } catch (e) {
      console.warn('[XtMap] 天地图切换地图类型失败:', e)
    }
  }

  _applyTheme(theme) {
    if (!this.container) return
    // 天地图不支持原生 dark 主题，通过 CSS 滤镜模拟
    const filter = TIANDITU_THEME_FILTER[theme] || 'none'
    const imgElements = this.container.querySelectorAll('img')
    imgElements.forEach((img) => {
      img.style.filter = filter
      img.style.webkitFilter = filter
    })
    // 同时设置容器级 CSS 变量，方便样式覆盖
    this.container.setAttribute('data-map-theme', theme)
    // 监听后续新增的 tile 图片（通过 MutationObserver）
    this._setupThemeObserver(theme)
  }

  _setupThemeObserver(theme) {
    if (this._themeObserver) {
      this._themeObserver.disconnect()
    }
    if (theme !== 'dark') return
    const filter = TIANDITU_THEME_FILTER[theme]
    this._themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.tagName === 'IMG') {
              node.style.filter = filter
              node.style.webkitFilter = filter
            } else if (node.querySelectorAll) {
              const imgs = node.querySelectorAll('img')
              imgs.forEach((img) => {
                img.style.filter = filter
                img.style.webkitFilter = filter
              })
            }
          }
        })
      })
    })
    try {
      this._themeObserver.observe(this.container, {
        childList: true,
        subtree: true
      })
    } catch (e) {
      // 忽略
    }
  }

  _applyCenter(center) {
    if (!this.mapInstance || !window.T) return
    try {
      this.mapInstance.centerAndZoom(new window.T.LngLat(center[0], center[1]), this.zoom)
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
      if (c && c.getLng !== undefined) {
        return [c.getLng(), c.getLat()]
      }
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
        zoomchange: 'zoomend'
      }
      const nativeEvent = eventMap[eventName] || eventName
      this.mapInstance.addEventListener(nativeEvent, (e) => {
        const normalized = {
          originalEvent: e,
          lnglat: e && e.lnglat ? [e.lnglat.getLng(), e.lnglat.getLat()] : null
        }
        handler(normalized)
      })
    } catch (err) {
      console.warn('[XtMap] 天地图事件绑定失败:', eventName, err)
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
    if (this.mapInstance && this.mapInstance.checkResize) {
      try {
        this.mapInstance.checkResize()
      } catch (e) {
        // 忽略
      }
    }
  }

  destroy() {
    if (this._themeObserver) {
      this._themeObserver.disconnect()
      this._themeObserver = null
    }
    if (this.mapInstance && typeof this.mapInstance.clearOverLays === 'function') {
      try {
        this.mapInstance.clearOverLays()
      } catch (e) {
        // 忽略
      }
    }
    super.destroy()
  }
}

export default TiandituAdapter
