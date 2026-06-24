## XtUpload 上传组件

上传组件，基于 ElementUI Upload 封装，支持图片预览、删除等功能。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtUpload v-model="imageSrc" action="/upload" base-url="/api" />
</template>

<script>
export default {
  data() {
    return {
      imageSrc: ''
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` / `v-model` | String | `''` | 已上传文件路径，多文件用逗号分隔 |
| `action` | String | `''` | 上传接口地址 |
| `baseUrl` | String | `''` | 文件访问基础 URL |
| `multiple` | Boolean | `false` | 是否支持多文件上传 |
| `limit` | Number | `5` | 最大上传数量 |
| `disabled` | Boolean | `false` | 是否禁用 |
| `accept` | String | `.jpg,.jpeg,.png` | 允许的文件类型 |
| `autoUpload` | Boolean | `true` | 是否自动上传 |
| `size` | String | `''` | 缩略图大小，可选 `big` |

## 示例

### 多文件上传

::: demo 多文件上传
```vue
<template>
  <XtUpload v-model="fileSrc" action="/upload" multiple />
</template>

<script>
export default {
  data() {
    return {
      fileSrc: ''
    }
  }
}
</script>
```
:::

### 禁用状态

::: demo 禁用状态
```vue
<template>
  <XtUpload v-model="imageSrc" action="/upload" disabled />
</template>

<script>
export default {
  data() {
    return {
      imageSrc: 'path/to/image.jpg'
    }
  }
}
</script>
```
:::

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `change` | 文件上传或删除时触发 | `src` |