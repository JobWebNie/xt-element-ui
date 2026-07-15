图标组件支持多种图标类型：ElementUI 字体图标、SVG Sprite、内联 SVG 和自定义字体图标。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtIcon name="el-icon-search" />
</template>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | String | - | 图标名称或 SVG 内容 |
| `size` | String / Number | - | 图标大小 |
| `color` | String | - | 图标颜色 |
| `spin` | Boolean | `false` | 是否旋转 |

## 图标类型

### ElementUI 字体图标

以 `el-icon-` 开头的图标名称会自动识别为 ElementUI 图标：

::: demo ElementUI 图标
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtIcon name="el-icon-search" />
    <XtIcon name="el-icon-edit" />
    <XtIcon name="el-icon-delete" />
    <XtIcon name="el-icon-user" />
  </div>
</template>
```
:::

### SVG Sprite

使用 `#` 或 `svg:` 前缀引用 SVG Sprite：

::: demo SVG Sprite
```vue
<template>
  <XtIcon name="#icon-home" />
</template>
```
:::

### 内联 SVG

直接传入完整的 SVG 字符串：

::: demo 内联 SVG
```vue
<template>
  <XtIcon :name="svgContent" />
</template>

<script>
export default {
  data() {
    return {
      svgContent: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
    }
  }
}
</script>
```
:::

### 自定义字体图标

非上述类型的图标名称会作为自定义字体图标类名处理：

::: demo 自定义字体图标
```vue
<template>
  <XtIcon name="custom-icon-star" />
</template>
```
:::

## 示例

### 不同尺寸

::: demo 不同尺寸
```vue
<template>
  <div style="display: flex; align-items: center; gap: 16px;">
    <XtIcon name="el-icon-search" :size="16" />
    <XtIcon name="el-icon-search" :size="24" />
    <XtIcon name="el-icon-search" :size="32" />
    <XtIcon name="el-icon-search" size="40px" />
  </div>
</template>
```
:::

### 不同颜色

::: demo 不同颜色
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtIcon name="el-icon-search" color="#1890ff" />
    <XtIcon name="el-icon-search" color="#52c41a" />
    <XtIcon name="el-icon-search" color="#faad14" />
    <XtIcon name="el-icon-search" color="#f5222d" />
  </div>
</template>
```
:::

### 旋转动画

::: demo 旋转动画
```vue
<template>
  <XtIcon name="el-icon-loading" spin />
</template>
```
:::

### 配合按钮使用

::: demo 配合按钮使用
```vue
<template>
  <XtButton type="primary">
    <XtIcon name="el-icon-search" />
    搜索
  </XtButton>
</template>
```
:::

## 全局注册前缀

对于自定义字体图标，可以注册前缀以避免自动添加 `ex-icon` 类名：

```javascript
import XtIcon from 'xt-element-ui/src/components/xt-icon'

XtIcon.registerPrefix('custom-')
```

注册后，所有以 `custom-` 开头的图标名称不会自动添加 `ex-icon` 类名。