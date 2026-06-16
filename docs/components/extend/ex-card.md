## ExCard 卡片

基于 ElementUI 卡片封装，支持多种阴影模式和字体大小配置。

## 基础用法

::: demo 基础用法
```vue
<template>
  <ex-card title="卡片标题">
    <p>这是卡片内容</p>
  </ex-card>
</template>
```
:::

## 阴影模式

支持三种阴影模式：`always`、`hover`、`never`

::: demo 阴影模式
```vue
<template>
  <div>
    <ex-card shadow="always">始终显示阴影</ex-card>
    <ex-card shadow="hover">悬停时显示阴影</ex-card>
    <ex-card shadow="never">不显示阴影</ex-card>
  </div>
</template>
```
:::

## 字体大小

支持三种尺寸：`small`、`medium`、`large`

::: demo 字体大小
```vue
<template>
  <div>
    <ex-card size="small" title="小卡片">
      <p>小尺寸卡片内容</p>
    </ex-card>
    <ex-card size="medium" title="中卡片">
      <p>中等尺寸卡片内容</p>
    </ex-card>
    <ex-card size="large" title="大卡片">
      <p>大尺寸卡片内容</p>
    </ex-card>
  </div>
</template>
```
:::

## 继承 ConfigProvider 配置

当 ExCard 被包裹在 XtConfigProvider 中时，会自动继承字体大小配置。

::: demo 继承配置
```vue
<template>
  <xt-config-provider size="large">
    <ex-card title="卡片标题">
      <p>自动继承大字体配置</p>
    </ex-card>
  </xt-config-provider>
</template>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| title | 卡片标题 | string | — | — |
| shadow | 阴影显示模式 | string | always/hover/never | always |
| bordered | 是否显示边框 | boolean | — | true |
| size | 卡片尺寸 | string | small/medium/large | — |
| body-class | 卡片 body 的类名 | string | — | — |

## Slots

| 名称 | 说明 |
|------|------|
| — | 卡片内容 |
| header | 卡片头部内容（优先级高于 title 属性） |
