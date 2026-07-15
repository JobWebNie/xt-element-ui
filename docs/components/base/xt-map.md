基于「高德 / 天地图 / 百度」三大地图服务商二次开发，对外暴露统一的 API，解决不同地图 SDK 的使用差异。支持暗黑主题、密钥/URL 灵活配置、地图类型动态切换。

### 核心特性

- **统一 API**：无论使用高德、天地图还是百度，props、事件、方法完全一致
- **暗黑主题**：`theme="dark"` 一键切换，高德原生支持，其他引擎 CSS 滤镜模拟
- **灵活配置**：通过 `XtMapProvider` 全局注入，或组件 props 单独覆盖
- **地图类型**：`standard`（标准矢量） / `satellite`（卫星） / `hybrid`（混合） / `traffic`（实时路况）
- **动态切换**：provider、apiKey、地图类型、主题等均可运行时动态切换

### 安装

```vue
npm install xt-element-ui
```

### 快速开始

```vue
<template>
  <div style="width: 100%; height: 500px;">
    <XtMap
      provider="amap"
      api-key="你的高德密钥"
      :center="[116.397428, 39.90923]"
      :zoom="11"
      theme="light"
      map-type="standard"
      @ready="onMapReady"
      @click="onMapClick"
    />
  </div>
</template>

<script>
export default {
  methods: {
    onMapReady({ map, provider }) {
      console.log('地图已就绪，服务商:', provider)
      // map 为各地图引擎的原生实例
    },
    onMapClick({ lnglat }) {
      console.log('点击坐标:', lnglat)  // [lng, lat]
    }
  }
}
</script>
```

### 全局配置（推荐）

使用 `XtMapProvider` 统一配置项目中所有地图，无需在每个 `<XtMap>` 上重复写密钥：

::: demo 基本用法
```vue
<template>
  <XtMapProvider
    provider="amap"
    api-key="AMAP_KEY"
    security-js-code="AMAP_SECURITY_CODE"
    theme="dark"
  >
    <div style="width: 100%; height: 500px;">
      <XtMap :center="[116.397428, 39.90923]" :zoom="11" />
    </div>
    <div style="width: 100%; height: 300px; margin-top: 12px;">
      <XtMap :center="[121.473701, 31.230416]" :zoom="12" map-type="satellite" />
    </div>
  </XtMapProvider>
</template>
```
:::

或通过 `Vue.prototype.$xt` 方式配置（入口文件）：

```js
import XtElementUI from 'xt-element-ui'

Vue.use(XtElementUI, {
  theme: 'light'
})

// 单独设置地图配置
import { setMapConfig, setMapProvider, setMapApiKey, setMapTheme } from 'xt-element-ui/src/components/xt-map/config/xt-map-config'

setMapProvider('amap')
setMapApiKey('你的高德密钥')
setMapTheme('dark')
```

### 切换三大地图服务商

#### 高德地图（推荐）

::: demo
```vue
<XtMap
  provider="amap"
  api-key="4a32fafb17f9e5236c4bb5f2e538d43b"
  security-js-code="50f302bf821cda57f798308236e7f8e2"
  :center="[116.397428, 39.90923]"
  :zoom="11"
/>
```
:::

#### 天地图
::: demo 天地图
```vue
<XtMap
  provider="tianditu"
  api-key="TIANDITU_TK"
  :center="[116.397428, 39.90923]"
  :zoom="11"
/>
```
:::

#### 百度地图
::: demo 百度地图
```vue
<XtMap
  provider="baidu"
  api-key="BAIDU_AK"
  :center="[116.397428, 39.90923]"
  :zoom="11"
/>
```
:::

### 暗黑主题
::: demo 暗黑主题
```vue
<template>
  <div style="width: 100%; height: 500px;">
    <XtMap
      provider="amap"
      api-key="AMAP_KEY"
      theme="dark"
      :center="[116.397428, 39.90923]"
      :zoom="11"
    />
  </div>
</template>
```
:::

高德地图原生支持 dark 主题样式；天地图、百度地图通过 CSS 滤镜实现近似效果。

### 地图类型切换
::: demo 地图类型切换
```vue
<template>
  <div>
    <div style="margin-bottom: 12px;">
      <el-button @click="mapType = 'standard'">标准</el-button>
      <el-button @click="mapType = 'satellite'">卫星</el-button>
      <el-button @click="mapType = 'hybrid'">混合</el-button>
      <el-button @click="mapType = 'traffic'">路况</el-button>
    </div>
    <div style="width: 100%; height: 500px;">
      <XtMap
        ref="mapRef"
        provider="amap"
        api-key="AMAP_KEY"
        :map-type="mapType"
        :center="[116.397428, 39.90923]"
        :zoom="11"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mapType: 'standard'
    }
  }
}
</script>
```
:::

### 通过 ref 调用实例方法
::: demo 通过 ref 调用实例方法
```vue
<template>
  <div>
    <el-button @click="zoomIn">放大</el-button>
    <el-button @click="zoomOut">缩小</el-button>
    <el-button @click="goToBeijing">定位北京</el-button>
    <el-button @click="toggleTheme">切换主题</el-button>
    <el-button @click="rebuild">重建地图</el-button>
    <div style="width: 100%; height: 500px; margin-top: 12px;">
      <XtMap
        ref="mapRef"
        provider="amap"
        api-key="AMAP_KEY"
        :center="[116.397428, 39.90923]"
        :zoom="11"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { isDark: false }
  },
  methods: {
    zoomIn() {
      const zoom = this.$refs.mapRef.getZoom()
      this.$refs.mapRef.setZoom(zoom + 1)
    },
    zoomOut() {
      const zoom = this.$refs.mapRef.getZoom()
      this.$refs.mapRef.setZoom(zoom - 1)
    },
    goToBeijing() {
      this.$refs.mapRef.setCenter([116.397428, 39.90923])
      this.$refs.mapRef.setZoom(12)
    },
    toggleTheme() {
      this.isDark = !this.isDark
      this.$refs.mapRef.setTheme(this.isDark ? 'dark' : 'light')
    },
    rebuild() {
      this.$refs.mapRef.rebuild()  // 在切换 provider / apiKey 后需要调用
    }
  }
}
</script>
```
:::

### 自定义 API URL

如需使用自建代理或反向代理（例如解决密钥暴露问题），可通过 `api-url` 覆盖：

::: demo 自定义 API URL
```vue
<XtMap
  provider="amap"
  api-url="/api/map/amap?v=2.0&key=YOUR_KEY"
  :center="[116.397428, 39.90923]"
  :zoom="11"
/>
```
:::

---

## 属性说明

### XtMap

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `provider` | String | `'amap'` | 地图服务商：`amap` / `tianditu` / `baidu` |
| `api-key` | String | `''` | 地图 API 密钥 |
| `api-url` | String | `''` | 自定义 SDK 脚本 URL（为空使用官方默认 URL） |
| `map-type` | String | `'standard'` | 地图类型：`standard` / `satellite` / `hybrid` / `traffic` |
| `theme` | String | `'light'` | 主题：`light` / `dark` |
| `center` | Array | `[116.397428, 39.90923]` | 中心坐标 `[经度, 纬度]` |
| `zoom` | Number | `11` | 缩放级别 |
| `width` | String | `'100%'` | 容器宽度 |
| `height` | String | `'400px'` | 容器高度 |
| `plugins` | Array | `[]` | 插件列表 |
| `security-js-code` | String | `''` | 高德地图安全密钥（2.0 必需） |
| `tianditu-layer-type` | String | `'vec'` | 天地图图层类型 |
| `baidu-coord-type` | String | `'bd09ll'` | 百度坐标系类型 |

### XtMapProvider

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `provider` | String | `'amap'` | 地图服务商 |
| `api-key` | String | `''` | 地图 API 密钥 |
| `api-url` | String | `''` | 自定义 SDK URL |
| `map-type` | String | `'standard'` | 地图类型 |
| `theme` | String | `'light'` | 主题 |
| `center` | Array | `null` | 中心坐标 |
| `zoom` | Number | `null` | 缩放级别 |
| `security-js-code` | String | `''` | 高德安全密钥 |

---

## 事件

| 事件 | 说明 | 参数 |
|------|------|------|
| `ready` | 地图加载完成 | `{ provider, map, adapter }` |
| `error` | 加载失败 | Error |
| `click` | 点击地图 | `{ originalEvent, lnglat }` |
| `moveend` | 地图移动结束 | `{ originalEvent }` |
| `zoomend` | 缩放结束 | `{ originalEvent }` |

---

## 实例方法（通过 ref 调用）

| 方法 | 说明 |
|------|------|
| `setCenter([lng, lat])` | 设置中心坐标 |
| `getCenter()` | 获取当前中心坐标 |
| `setZoom(zoom)` | 设置缩放级别 |
| `getZoom()` | 获取当前缩放级别 |
| `setMapType(type)` | 切换地图类型 |
| `setTheme(theme)` | 切换主题 |
| `getNativeMap()` | 获取地图引擎原生实例（不推荐跨 provider 使用） |
| `resize()` | 重新计算容器尺寸 |
| `rebuild()` | 销毁并重建地图（切换 provider / apiKey 后需要调用） |
| `on(eventName, handler)` | 绑定事件 |
| `off(eventName)` | 解绑事件 |

---

## 统一坐标说明

XtMap 对外统一使用 `WGS84` 坐标系表示为 `[经度, 纬度]`（如 `[116.397428, 39.90923]`）。

- **高德地图**：内部使用 GCJ-02，传入 WGS84 坐标正常工作（视觉差异极小）
- **百度地图**：内部使用 BD-09，传入经纬度坐标由引擎内部处理
- **天地图**：原生支持经纬度坐标

如果需要精确的坐标转换，建议在外部完成转换后再传入 `center`。

---

## 注意事项

1. **密钥获取**：高德（lbs.amap.com）、天地图（tianditu.gov.cn）、百度（lbsyun.baidu.com）
2. **高德 2.0 需要安全密钥**：除 `api-key` 外，还需配置 `security-js-code`
3. **百度地图 callback 机制**：SDK 通过 callback 参数触发 ready，组件内部已处理
4. **暗黑主题差异**：高德原生支持 dark 样式，天地图/百度通过 CSS 滤镜实现，视觉效果与高德略有差异
5. **provider / apiKey 运行时变更**：变更后地图会自动重建，无需手动调用 `rebuild()`
6. **尺寸响应**：容器尺寸变化后可调用 `resize()` 方法重新计算，或由组件监听 window resize 自动处理
