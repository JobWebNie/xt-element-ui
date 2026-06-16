## ExIcon 图标

统一图标组件，支持 ElementUI 字体图标（el-icon）、SVG Sprite 图标、内联 SVG，以及可扩展的自定义字体图标。

## 基础用法：ElementUI 字体图标

`name` 以 `el-icon-` 开头时，自动识别为 ElementUI 字体图标：

::: demo ElementUI 字体图标示例
```vue
<template>
  <div style="font-size: 24px">
    <ex-icon name="el-icon-edit" style="margin-right: 16px" />
    <ex-icon name="el-icon-delete" style="margin-right: 16px" />
    <ex-icon name="el-icon-search" style="margin-right: 16px" />
    <ex-icon name="el-icon-share" style="margin-right: 16px" />
    <ex-icon name="el-icon-setting" />
  </div>
</template>
```
:::

## SVG Sprite 图标

`name` 以 `#` 或 `svg:` 开头时，自动识别为 SVG Sprite（通过 `<use>` 引用）。使用前请确保项目已通过 `svg-sprite-loader` 等方式注册了对应的 SVG 图标：

::: demo SVG Sprite 图标示例
```vue
<template>
  <div style="font-size: 24px; color: #1890ff">
    <ex-icon name="#icon-user" style="margin-right: 16px" />
    <ex-icon name="svg:icon-home" style="margin-right: 16px" />
    <ex-icon name="#icon-star" />
  </div>
</template>
```
:::

## 内联 SVG 图标

`name` 传入完整的 `<svg>` 字符串时，将作为内联 SVG 渲染：

::: demo 内联 SVG 示例
```vue
<template>
  <ex-icon
    :size="32"
    color="#f56c6c"
    :name="'<svg viewBox=&quot;0 0 1024 1024&quot;><path d=&quot;M512 938.666667L85.333333 512l170.666667-170.666667 256 256 256-256L938.666667 512 512 938.666667z&quot; fill=&quot;currentColor&quot;></path></svg>'"
  />
</template>
```
:::

## 自定义字体图标（本地扩展）

除 `el-icon-` 前缀外，其它自定义前缀会自动作为自定义字体图标渲染（需在项目中自行准备 @font-face 字体文件及对应 class）。例如使用 `my-icon-star`：

```scss
// 项目中准备好字体文件及 class
@font-face {
  font-family: 'my-icon';
  src: url('./fonts/my-icon.ttf') format('truetype');
}
.my-icon {
  font-family: 'my-icon' !important;
}
.my-icon-star::before {
  content: '\e001';
}
```

::: demo 自定义字体图标示例
```vue
<template>
  <div style="font-size: 24px">
    <ex-icon name="my-icon-star" style="margin-right: 16px" />
    <ex-icon name="my-icon-heart" />
  </div>
</template>

<script>
export default {
  created() {
    // 注册自定义前缀，避免自动添加 ex-icon 前缀
    ExIcon.registerPrefix('my-icon-')
  }
}
</script>
```
:::

未注册自定义前缀时，组件会自动为其添加 `ex-icon` 作为基础 class，方便与项目本地的 @font-face 配合：

```scss
.ex-icon {
  font-family: 'ex-iconfont' !important;
  font-size: 16px;
  font-style: normal;
}
.ex-icon-star::before { content: '\e001'; }
```

## 尺寸与颜色

通过 `size` 和 `color` 属性控制图标大小与颜色：

::: demo 图标尺寸颜色示例
```vue
<template>
  <div>
    <ex-icon name="el-icon-star-on" :size="16" color="#909399" style="margin-right: 16px" />
    <ex-icon name="el-icon-star-on" :size="24" color="#e6a23c" style="margin-right: 16px" />
    <ex-icon name="el-icon-star-on" :size="32" color="#f56c6c" style="margin-right: 16px" />
    <ex-icon name="el-icon-star-on" :size="48" color="#67c23a" style="margin-right: 16px" />
    <ex-icon name="el-icon-star-on" size="2em" color="#409eff" />
  </div>
</template>
```
:::

## 旋转动画

设置 `spin` 让图标持续旋转（常用于加载状态）：

::: demo 图标旋转示例
```vue
<template>
  <div style="font-size: 24px">
    <ex-icon name="el-icon-loading" spin style="margin-right: 16px" />
    <ex-icon name="el-icon-refresh" spin />
  </div>
</template>
```
:::

## 点击事件

支持 `@click` 事件：

::: demo 图标点击示例
```vue
<template>
  <div style="font-size: 24px">
    <ex-icon
      name="el-icon-favorite"
      color="#f56c6c"
      @click="handleClick"
      style="cursor: pointer"
    />
    <span style="margin-left: 8px; font-size: 14px">点击次数：{{ count }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    handleClick() {
      this.count++
    }
  }
}
</script>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| name | 图标名称（支持 el-icon-xxx 自定义前缀） | string | — | '' |
| size | 图标尺寸（数字单位 px，也可传入如 '2em' 的字符串） | string / number | — | '' |
| color | 图标颜色（CSS color 值） | string | — | '' |
| spin | 是否持续旋转 | boolean | — | false |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击图标时触发 | event |

## 静态方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| ExIcon.registerPrefix(prefix) | 注册自定义字体图标前缀，注册后该前缀的图标不会自动添加 `ex-icon` 基础 class | prefix: string |
