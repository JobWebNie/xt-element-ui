## ExButton 按钮

基于 ElementUI 按钮封装，支持防抖和字体大小配置。

## 基础用法

::: demo 按钮基础示例
```vue
<template>
  <div>
    <ex-button>默认按钮</ex-button>
    <ex-button type="primary">主要按钮</ex-button>
    <ex-button type="success">成功按钮</ex-button>
  </div>
</template>
```
:::

## 字体大小

支持三种尺寸：`small`、`medium`、`large`

::: demo 按钮字体大小示例
```vue
<template>
  <div>
    <ex-button size="mini">迷你按钮</ex-button>
    <ex-button size="small">小按钮</ex-button>
    <ex-button size="medium">中按钮</ex-button>
    <ex-button size="large">大按钮</ex-button>
  </div>
</template>
```
:::

## 继承 ConfigProvider 配置

当 ExButton 被包裹在 XtConfigProvider 中时，会自动继承字体大小配置：

::: demo 按钮继承字体大小示例
```vue
<template>
  <xt-config-provider size="large">
    <ex-button>自动继承大字体</ex-button>
  </xt-config-provider>
</template>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| type | 按钮类型 | string | primary/success/warning/danger | — |
| size | 按钮尺寸 | string | small/medium/large | — |
| throttle | 点击节流时间 (ms) | number | — | 0 |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击按钮时触发 | — |
