<template>
  <div class="xt-map-wrapper">
    <div ref="mapContainer" class="xt-map-container" :data-theme="mergedTheme"></div>
    <div v-if="loading" class="xt-map-loading">
      <span>地图加载中...</span>
    </div>
    <div v-if="errorMessage" class="xt-map-error">
      <span>{{ errorMessage }}</span>
    </div>
    <slot name="overlay"></slot>
  </div>
</template>

<script>
import { getAdapterClass } from './adapters/index'
import { clearScriptCache } from './loaders/script-loader'
import {
  getMapConfig,
  getMapProvider,
  getMapApiKey,
  getMapApiUrl,
  getMapType,
  getMapTheme,
  getMapCenter,
  getMapZoom,
  setSecurityJsCode,
  MAP_PROVIDERS,
  MAP_TYPES,
  MAP_THEMES,
  onMapConfigChange
} from './config/xt-map-config'

export default {
  name: 'XtMap',

  props: {
    provider: {
      type: String,
      default: '',
      validator: (val) => val === '' || MAP_PROVIDERS.includes(val)
    },
    apiKey: {
      type: String,
      default: ''
    },
    apiUrl: {
      type: String,
      default: ''
    },
    mapType: {
      type: String,
      default: '',
      validator: (val) => val === '' || MAP_TYPES.includes(val)
    },
    theme: {
      type: String,
      default: '',
      validator: (val) => val === '' || MAP_THEMES.includes(val)
    },
    center: {
      type: Array,
      default: () => null
    },
    zoom: {
      type: Number,
      default: null
    },
    plugins: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    securityJsCode: {
      type: String,
      default: ''
    },
    tiandituLayerType: {
      type: String,
      default: 'vec'
    },
    baiduCoordType: {
      type: String,
      default: 'bd09ll'
    }
  },

  data() {
    return {
      loading: true,
      errorMessage: '',
      adapter: null,
      _unsubscribeConfig: null
    }
  },

  computed: {
    mergedProvider() {
      return this.provider || getMapProvider() || 'amap'
    },
    mergedApiKey() {
      return this.apiKey || getMapApiKey() || ''
    },
    mergedApiUrl() {
      return this.apiUrl || getMapApiUrl() || ''
    },
    mergedMapType() {
      return this.mapType || getMapType() || 'standard'
    },
    mergedTheme() {
      return this.theme || getMapTheme() || 'light'
    },
    mergedCenter() {
      return this.center || getMapCenter() || [116.397428, 39.90923]
    },
    mergedZoom() {
      return this.zoom !== null ? this.zoom : getMapZoom()
    },
    mergedSecurityJsCode() {
      return this.securityJsCode || (getMapConfig().securityJsCode) || ''
    },
    mergedPlugins() {
      return this.plugins.length > 0 ? this.plugins : getMapConfig().plugins || []
    }
  },

  watch: {
    mergedProvider: {
      handler() {
        this.$nextTick(() => this.rebuildMap())
      }
    },
    mergedApiKey: {
      handler() {
        this.$nextTick(() => this.rebuildMap())
      }
    },
    mergedMapType: {
      handler(newVal) {
        if (this.adapter) this.adapter.setMapType(newVal)
      }
    },
    mergedTheme: {
      handler(newVal) {
        if (this.adapter) this.adapter.setTheme(newVal)
        if (this.$refs.mapContainer) {
          this.$refs.mapContainer.setAttribute('data-theme', newVal)
        }
      }
    },
    mergedCenter: {
      handler(newVal) {
        if (this.adapter) this.adapter.setCenter(newVal)
      }
    },
    mergedZoom: {
      handler(newVal) {
        if (this.adapter) this.adapter.setZoom(newVal)
      }
    },
    width: {
      handler() {
        this.$nextTick(() => {
          if (this.adapter) this.adapter.resize()
        })
      }
    },
    height: {
      handler() {
        this.$nextTick(() => {
          if (this.adapter) this.adapter.resize()
        })
      }
    },
    securityJsCode: {
      handler(newVal) {
        if (newVal) {
          setSecurityJsCode(newVal)
          // 高德 2.0：SDK 已加载后再设置 securityJsCode 无效，需要重建地图
          if (this.mergedProvider === 'amap' && this.adapter && this.adapter.ready) {
            this.$nextTick(() => this.rebuildMap())
          }
        }
      }
    }
  },

  mounted() {
    // 监听全局配置变更
    this._unsubscribeConfig = onMapConfigChange((key, value) => {
      if (!this.provider && (key === 'provider')) this.$nextTick(() => this.rebuildMap())
      if (!this.apiKey && (key === 'apiKey')) this.$nextTick(() => this.rebuildMap())
      if (!this.apiUrl && (key === 'apiUrl')) this.$nextTick(() => this.rebuildMap())
      if (!this.theme && key === 'theme' && this.adapter) this.adapter.setTheme(value)
      if (!this.mapType && key === 'mapType' && this.adapter) this.adapter.setMapType(value)
      if (!this.center && key === 'center' && this.adapter) this.adapter.setCenter(value)
      if (this.zoom === null && key === 'zoom' && this.adapter) this.adapter.setZoom(value)
    })

    // 设置高德安全密钥
    if (this.securityJsCode) setSecurityJsCode(this.securityJsCode)

    this.$nextTick(() => this.initMap())

    // 监听窗口尺寸变化
    this._onWindowResize = () => {
      if (this.adapter) this.adapter.resize()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._onWindowResize)
    }
  },

  beforeDestroy() {
    this.destroyMap()
    if (this._unsubscribeConfig) this._unsubscribeConfig()
    if (this._onWindowResize && typeof window !== 'undefined') {
      window.removeEventListener('resize', this._onWindowResize)
    }
  },

  methods: {
    async initMap() {
      const container = this.$refs.mapContainer
      if (!container) return

      // 设置容器尺寸
      container.style.width = this.width
      container.style.height = this.height

      // 设置安全密钥（高德需要）
      if (this.securityJsCode) setSecurityJsCode(this.securityJsCode)

      this.loading = true
      this.errorMessage = ''

      const AdapterClass = getAdapterClass(this.mergedProvider)

      this.adapter = new AdapterClass(container, {
        apiKey: this.mergedApiKey,
        apiUrl: this.mergedApiUrl,
        mapType: this.mergedMapType,
        theme: this.mergedTheme,
        center: this.mergedCenter,
        zoom: this.mergedZoom,
        plugins: this.mergedPlugins,
        securityJsCode: this.mergedSecurityJsCode,
        tiandituLayerType: this.tiandituLayerType,
        baiduCoordType: this.baiduCoordType
      })

      try {
        await this.adapter.init()
        this.loading = false

        // 绑定事件
        this._bindAdapterEvents()

        // 向父组件发出 ready 事件
        this.$emit('ready', {
          provider: this.mergedProvider,
          map: this.adapter.getNativeMap(),
          adapter: this.adapter
        })
      } catch (err) {
        this.loading = false
        this.errorMessage = err.message || '地图初始化失败'
        this.$emit('error', err)
      }
    },

    rebuildMap() {
      this.destroyMap()
      // 清理脚本缓存，确保新配置能生效（例如切换密钥后重新加载）
      if (typeof clearScriptCache === 'function') {
        clearScriptCache()
      }
      this.$nextTick(() => this.initMap())
    },

    destroyMap() {
      if (this.adapter) {
        this.adapter.destroy()
        this.adapter = null
      }
    },

    _bindAdapterEvents() {
      if (!this.adapter) return

      const events = ['click', 'moveend', 'zoomend', 'zoomchange', 'mapmove']
      events.forEach((evt) => {
        this.adapter.on(evt, (data) => {
          this.$emit(evt, data)
        })
      })
    },

    // 对外暴露的统一 API
    setCenter(center) {
      if (this.adapter) this.adapter.setCenter(center)
    },

    setZoom(zoom) {
      if (this.adapter) this.adapter.setZoom(zoom)
    },

    setMapType(type) {
      if (this.adapter) this.adapter.setMapType(type)
    },

    setTheme(theme) {
      if (this.adapter) this.adapter.setTheme(theme)
    },

    getCenter() {
      return this.adapter ? this.adapter.getCenter() : this.mergedCenter
    },

    getZoom() {
      return this.adapter ? this.adapter.getZoom() : this.mergedZoom
    },

    getNativeMap() {
      return this.adapter ? this.adapter.getNativeMap() : null
    },

    resize() {
      if (this.adapter) this.adapter.resize()
    },

    on(eventName, handler) {
      if (this.adapter) this.adapter.on(eventName, handler)
    },

    off(eventName) {
      if (this.adapter) this.adapter.off(eventName)
    },

    rebuild() {
      this.rebuildMap()
    }
  }
}
</script>
