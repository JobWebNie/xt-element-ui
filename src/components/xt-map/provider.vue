<template>
  <div :class="['xt-map-provider', { 'xt-map-provider--dark': mergedTheme === 'dark' }]" :style="wrapperStyle">
    <slot></slot>
  </div>
</template>

<script>
import {
  getMapConfig,
  setMapConfig,
  setMapProvider,
  setMapApiKey,
  setMapApiUrl,
  setMapType,
  setMapTheme,
  setMapCenter,
  setMapZoom,
  setMapPlugins,
  setSecurityJsCode,
  getMapProvider,
  getMapApiKey,
  getMapApiUrl,
  getMapType,
  getMapTheme,
  getMapCenter,
  getMapZoom,
  getMapPlugins,
  MAP_PROVIDERS,
  MAP_TYPES,
  MAP_THEMES,
  onMapConfigChange
} from './config/xt-map-config'

export default {
  name: 'XtMapProvider',

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
    securityJsCode: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      mergedTheme: this.theme || getMapTheme() || 'light'
    }
  },

  computed: {
    wrapperStyle() {
      return {}
    }
  },

  watch: {
    provider: {
      immediate: true,
      handler(newVal) {
        if (newVal) setMapProvider(newVal)
      }
    },
    apiKey: {
      immediate: true,
      handler(newVal) {
        if (newVal) setMapApiKey(newVal)
      }
    },
    apiUrl: {
      immediate: true,
      handler(newVal) {
        if (newVal) setMapApiUrl(newVal)
      }
    },
    mapType: {
      immediate: true,
      handler(newVal) {
        if (newVal) setMapType(newVal)
      }
    },
    theme: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          setMapTheme(newVal)
          this.mergedTheme = newVal
        }
      }
    },
    center: {
      immediate: true,
      handler(newVal) {
        if (newVal) setMapCenter(newVal)
      }
    },
    zoom: {
      immediate: true,
      handler(newVal) {
        if (newVal !== null && newVal !== undefined) setMapZoom(newVal)
      }
    },
    plugins: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) setMapPlugins(newVal)
      }
    },
    securityJsCode: {
      immediate: true,
      handler(newVal) {
        if (newVal) setSecurityJsCode(newVal)
      }
    }
  },

  provide() {
    return {
      xtMapConfig: {
        getProvider: () => this.provider || getMapProvider(),
        getApiKey: () => this.apiKey || getMapApiKey(),
        getApiUrl: () => this.apiUrl || getMapApiUrl(),
        getMapType: () => this.mapType || getMapType(),
        getTheme: () => this.theme || getMapTheme(),
        getCenter: () => this.center || getMapCenter(),
        getZoom: () => this.zoom !== null ? this.zoom : getMapZoom(),
        getPlugins: () => this.plugins.length > 0 ? this.plugins : getMapPlugins(),
        getConfig: () => ({
          provider: this.provider || getMapProvider(),
          apiKey: this.apiKey || getMapApiKey(),
          apiUrl: this.apiUrl || getMapApiUrl(),
          mapType: this.mapType || getMapType(),
          theme: this.theme || getMapTheme(),
          center: this.center || getMapCenter(),
          zoom: this.zoom !== null ? this.zoom : getMapZoom()
        })
      }
    }
  },

  created() {
    this._unsubscribe = onMapConfigChange((key, value) => {
      if (key === 'theme') this.mergedTheme = this.theme || value
    })
  },

  beforeDestroy() {
    if (this._unsubscribe) this._unsubscribe()
  }
}
</script>

<style scoped>
.xt-map-provider {
  width: 100%;
  height: 100%;
}

.xt-map-provider--dark {
  background-color: transparent;
}
</style>
