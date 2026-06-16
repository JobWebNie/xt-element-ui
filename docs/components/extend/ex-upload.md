## ExUpload 图片上传

基于 ElementUI `el-upload` 封装，支持图片上传、预览、删除，以及多图管理。

## 基础用法

设置 `action` 为上传接口路径，`base-url` 为图片基础地址，`v-model` 绑定逗号分隔的图片路径字符串：

::: demo 图片上传基础示例
```vue
<template>
  <ex-upload
    v-model="imgList"
    action="/api/upload"
    base-url="https://example.com"
  />
</template>

<script>
export default {
  data() {
    return {
      imgList: ''
    }
  }
}
</script>
```
:::

## 多图上传

设置 `multiple` 开启多图上传，通过 `limit` 限制最多上传数量：

::: demo 多图上传示例
```vue
<template>
  <ex-upload
    v-model="imgList"
    action="/api/upload"
    base-url="https://example.com"
    multiple
    :limit="5"
  />
</template>

<script>
export default {
  data() {
    return {
      imgList: ''
    }
  }
}
</script>
```
:::

## 图片大小

通过 `size` 属性设置显示尺寸：

::: demo 图片尺寸示例
```vue
<template>
  <div>
    <ex-upload v-model="img" action="/api/upload" base-url="https://example.com" />
    <div style="margin-top: 20px">
      <ex-upload v-model="img" action="/api/upload" base-url="https://example.com" size="big" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img: ''
    }
  }
}
</script>
```
:::

## 禁用状态

`disabled` 属性可禁用上传和删除功能：

::: demo 禁用上传示例
```vue
<template>
  <ex-upload
    v-model="img"
    action="/api/upload"
    base-url="https://example.com"
    disabled
  />
</template>

<script>
export default {
  data() {
    return {
      img: 'demo.jpg'
    }
  }
}
</script>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| src | 当前图片列表，以英文逗号分隔（v-model） | string | — | '' |
| action | 上传接口路径，与 base-url 拼接 | string | — | '' |
| base-url | 图片基础地址（服务端域名） | string | — | '' |
| multiple | 是否支持多选 | boolean | — | false |
| limit | 最多上传数量 | number | — | 5 |
| accept | 允许的文件类型 | string | — | .jpg,.jpeg,.png |
| auto-upload | 是否在选取文件后立即上传 | boolean | — | true |
| disabled | 是否禁用 | boolean | — | false |
| size | 图片展示尺寸 | string | big | — |
| data | 上传时附带的额外参数 | object | — | {} |
| all-file-list | 用于图库预览的图片列表 | array | — | — |
| before-emit-data | 对上传结果进行处理的回调函数，返回 `false` 代表上传失败 | function(res, file, type) | — | (内部函数) |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 图片列表变化时触发 | 以英文逗号分隔的图片路径字符串 |
