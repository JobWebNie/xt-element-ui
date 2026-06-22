/**
 * XtMap 全局配置管理
 * 支持通过 Vue.use 配置或运行时动态设置地图提供商、密钥、URL、主题等
 */

// 支持的地图提供商
export const MAP_PROVIDERS = ['amap', 'tianditu', 'baidu']

// 支持的地图类型（统一枚举，各适配器会转成对应引擎的类型）
export const MAP_TYPES = ['standard', 'satellite', 'hybrid', 'traffic']

// 支持的主题
export const MAP_THEMES = ['light', 'dark']

// 默认配置 - 以高德地图为基准
const defaultConfig = {
  provider: 'amap',
  apiKey: '',
  apiUrl: null,
  mapType: 'standard',
  theme: 'light',
  center: [116.397428, 39.90923],
  zoom: 11,
  plugins: [],
  securityJsCode: null,
  // 天地图专用：图层类型（vec:矢量, img:影像, ter:地形）
  tiandituLayerType: 'vec',
  // 百度地图专用：坐标系（bd09ll:百度经纬度, bd09mc:百度墨卡托）
  baiduCoordType: 'bd09ll'
}

// 当前配置
let currentConfig = { ...defaultConfig }

// 配置变更监听器
const configChangeListeners = []

const emitConfigChange = (key, value) => {
  configChangeListeners.forEach(listener => {
    try {
      listener(key, value)
    } catch (e) {
      console.warn('[XtMap] 配置变更监听异常:', e)
    }
  })
}

// 获取完整配置
export const getMapConfig = () => ({ ...currentConfig })

// 设置完整配置
export const setMapConfig = (config) => {
  if (typeof config !== 'object' || config === null) {
    console.warn('[XtMap] setMapConfig 必须传入对象参数')
    return
  }

  if (config.provider !== undefined) setMapProvider(config.provider)
  if (config.apiKey !== undefined) setMapApiKey(config.apiKey)
  if (config.apiUrl !== undefined) setMapApiUrl(config.apiUrl)
  if (config.mapType !== undefined) setMapType(config.mapType)
  if (config.theme !== undefined) setMapTheme(config.theme)
  if (config.center !== undefined) setMapCenter(config.center)
  if (config.zoom !== undefined) setMapZoom(config.zoom)
  if (config.plugins !== undefined) setMapPlugins(config.plugins)
  if (config.securityJsCode !== undefined) setSecurityJsCode(config.securityJsCode)
}

export const setMapProvider = (provider) => {
  if (!MAP_PROVIDERS.includes(provider)) {
    console.warn(`[XtMap] 无效的地图提供商: ${provider}，可选: ${MAP_PROVIDERS.join(', ')}`)
    return
  }
  currentConfig.provider = provider
  emitConfigChange('provider', provider)
}

export const setMapApiKey = (key) => {
  currentConfig.apiKey = key
  emitConfigChange('apiKey', key)
}

export const setMapApiUrl = (url) => {
  currentConfig.apiUrl = url
  emitConfigChange('apiUrl', url)
}

export const setMapType = (type) => {
  if (!MAP_TYPES.includes(type)) {
    console.warn(`[XtMap] 无效的地图类型: ${type}，可选: ${MAP_TYPES.join(', ')}`)
    return
  }
  currentConfig.mapType = type
  emitConfigChange('mapType', type)
}

export const setMapTheme = (theme) => {
  if (!MAP_THEMES.includes(theme)) {
    console.warn(`[XtMap] 无效的主题: ${theme}，可选: ${MAP_THEMES.join(', ')}`)
    return
  }
  currentConfig.theme = theme
  emitConfigChange('theme', theme)
}

export const setMapCenter = (center) => {
  if (!Array.isArray(center) || center.length !== 2) {
    console.warn('[XtMap] center 必须是 [lng, lat] 数组')
    return
  }
  currentConfig.center = center
  emitConfigChange('center', center)
}

export const setMapZoom = (zoom) => {
  const z = Number(zoom)
  if (isNaN(z)) {
    console.warn('[XtMap] zoom 必须是数字')
    return
  }
  currentConfig.zoom = z
  emitConfigChange('zoom', z)
}

export const setMapPlugins = (plugins) => {
  if (!Array.isArray(plugins)) {
    console.warn('[XtMap] plugins 必须是数组')
    return
  }
  currentConfig.plugins = plugins
  emitConfigChange('plugins', plugins)
}

export const setSecurityJsCode = (code) => {
  currentConfig.securityJsCode = code
  // 高德地图安全密钥：设置 window._AMapSecurityConfig
  if (typeof window !== 'undefined' && code) {
    window._AMapSecurityConfig = {
      securityJsCode: code,
      ...(window._AMapSecurityConfig || {})
    }
  }
  emitConfigChange('securityJsCode', code)
}

// 获取当前配置的快捷方法
export const getMapProvider = () => currentConfig.provider
export const getMapApiKey = () => currentConfig.apiKey
export const getMapApiUrl = () => currentConfig.apiUrl
export const getMapType = () => currentConfig.mapType
export const getMapTheme = () => currentConfig.theme
export const getMapCenter = () => currentConfig.center
export const getMapZoom = () => currentConfig.zoom
export const getMapPlugins = () => currentConfig.plugins

// 监听配置变更
export const onMapConfigChange = (listener) => {
  if (typeof listener === 'function') {
    configChangeListeners.push(listener)
    return () => {
      const index = configChangeListeners.indexOf(listener)
      if (index > -1) configChangeListeners.splice(index, 1)
    }
  }
}

// 重置为默认配置
export const resetMapConfig = () => {
  setMapConfig(defaultConfig)
}

export default {
  MAP_PROVIDERS,
  MAP_TYPES,
  MAP_THEMES,
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
  onMapConfigChange,
  resetMapConfig
}
