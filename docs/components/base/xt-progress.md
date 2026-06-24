## XtProgress 进度条组件

进度条组件，用于展示任务完成进度。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtProgress :percentage="60" />
</template>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `percentage` | Number | `0` | 0-100 | 进度百分比 |
| `type` | String | `line` | `line`、`circle`、`dashboard` | 进度条类型 |
| `strokeWidth` | Number | `6` | - | 进度条宽度 |
| `color` | String / Array | `#1890ff` | - | 进度条颜色 |
| `status` | String | - | `success`、`exception`、`normal` | 状态 |
| `width` | Number | `126` | - | 环形进度条宽度 |
| `textInside` | Boolean | `false` | - | 是否将进度百分比显示在进度条内 |
| `showText` | Boolean | `true` | - | 是否显示进度百分比 |
| `format` | Function | - | - | 自定义进度条文字内容 |

## 示例

### 不同类型的进度条

::: demo 不同类型的进度条
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <XtProgress :percentage="60" />
    <XtProgress type="circle" :percentage="60" />
    <XtProgress type="dashboard" :percentage="60" />
  </div>
</template>
```
:::

### 不同状态

::: demo 不同状态
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <XtProgress :percentage="100" status="success" />
    <XtProgress :percentage="60" status="normal" />
    <XtProgress :percentage="60" status="exception" />
  </div>
</template>
```
:::

### 自定义颜色

::: demo 自定义颜色
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <XtProgress :percentage="60" color="#52c41a" />
    <XtProgress :percentage="60" color="#faad14" />
    <XtProgress :percentage="60" color="#f5222d" />
  </div>
</template>
```
:::

### 文字在进度条内

::: demo 文字在进度条内
```vue
<template>
  <XtProgress :percentage="60" :text-inside="true" :stroke-width="20" />
</template>
```
:::

### 自定义宽度

::: demo 自定义宽度
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <XtProgress :percentage="60" :stroke-width="3" />
    <XtProgress :percentage="60" :stroke-width="6" />
    <XtProgress :percentage="60" :stroke-width="12" />
  </div>
</template>
```
:::

### 自定义文字格式

::: demo 自定义文字格式
```vue
<template>
  <XtProgress :percentage="60" :format="(percent) => `${percent}% 完成`" />
</template>
```
:::

### 环形进度条

::: demo 环形进度条
```vue
<template>
  <div style="display: flex; gap: 32px;">
    <XtProgress type="circle" :percentage="60" />
    <XtProgress type="circle" :percentage="60" :width="80" />
    <XtProgress type="circle" :percentage="60" :width="150" />
  </div>
</template>
```
:::

### 仪表盘

::: demo 仪表盘
```vue
<template>
  <XtProgress type="dashboard" :percentage="60" />
</template>
```
:::

## 注意事项

- `percentage` 属性值应在 0-100 之间
- 环形进度条默认宽度为 126px，可以通过 `width` 属性调整