### 全局配置（推荐）

使用 `XtMapProvider` 统一配置项目中所有地图，无需在每个 `<XtMap>` 上重复写密钥：

::: demo 全局配置（推荐）
```vue
<template>
  <XtMapProvider
    provider="amap"
    api-key="你的高德密钥"
    security-js-code="你的安全密钥"
    theme="light"
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
