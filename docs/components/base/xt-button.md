按钮用于触发一个操作，如提交表单、打开对话框等。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtButton type="primary">主要按钮</XtButton>
</template>
```
:::

## 属性说明
| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `type` | String | - | `primary`、`success`、`warning`、`danger` | 按钮类型 |
| `size` | String | - | `large`、`medium`、`small`、`mini` | 按钮尺寸 |
| `plain` | Boolean | false | - | 是否为朴素按钮 |
| `disabled` | Boolean | false | - | 是否禁用按钮 |
| `round` | Boolean | false | - | 是否为圆角按钮 |
| `square` | Boolean | false | - | 是否为正方形按钮 |
| `circle` | Boolean | false | - | 是否为圆形按钮 |


## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | - | 点击按钮时触发 |

## 示例

### 不同类型的按钮
::: demo 不同类型的按钮
```vue
<template>
  <div style="display: inline-flex; gap: 12px;">
    <XtButton>默认按钮</XtButton>
    <XtButton type="primary">主要按钮</XtButton>
    <XtButton type="success">成功按钮</XtButton>
    <XtButton type="warning">警告按钮</XtButton>
    <XtButton type="danger">危险按钮</XtButton>
    <XtButton type="info">信息按钮</XtButton>
  </div>
</template>
```
:::

### 不同尺寸的按钮
::: demo 不同尺寸的按钮
```vue
<template>
  <div style="display: inline-flex; gap: 12px; align-items: center;">
    <XtButton size="large">大号按钮</XtButton>
    <XtButton>默认按钮</XtButton>
    <XtButton size="small">小号按钮</XtButton>
  </div>
</template>
```
:::

### 朴素按钮

::: demo 朴素按钮
```vue
<template>
  <div style="display: inline-flex; gap: 12px;">
    <XtButton type="primary" plain>朴素主按钮</XtButton>
    <XtButton type="success" plain>朴素成功按钮</XtButton>
    <XtButton type="warning" plain>朴素警告按钮</XtButton>
    <XtButton type="danger" plain>朴素危险按钮</XtButton>
  </div>
</template>
```
:::

### 状态按钮
::: demo 状态按钮
```vue
<template>
  <div style="display: inline-flex; gap: 12px;">
    <XtButton disabled>禁用按钮</XtButton>
    <XtButton round>圆角按钮</XtButton>
    <XtButton type="primary" disabled>禁用主按钮</XtButton>
    <XtButton type="primary" round>圆角主按钮</XtButton>
    <XtButton type="success" icon="el-icon-plus" circle></XtButton>
    <XtButton type="success" icon="el-icon-plus" square></XtButton>
  </div>
</template>
```
:::

### 事件处理

::: demo 事件处理
```vue
<template>
  <div>
    <XtButton type="primary" @click="handleClick">点击触发</XtButton>
    <p style="margin-top: 12px;">点击次数: {{ clickCount }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clickCount: 0
    }
  },
  methods: {
    handleClick() {
      this.clickCount++
    }
  }
}
</script>
```
:::
