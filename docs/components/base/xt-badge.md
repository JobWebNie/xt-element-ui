## XtBadge 徽标组件

徽标组件，用于标记数字或状态。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtBadge :value="12">
    <XtButton size="small">评论</XtButton>
  </XtBadge>
</template>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `value` | String / Number | - | - | 显示的数值 |
| `max` | Number | - | - | 最大值，超过会显示 {max}+ |
| `isDot` | Boolean | `false` | - | 是否显示小圆点 |
| `hidden` | Boolean | `false` | - | 是否隐藏徽标 |
| `type` | String | - | `primary`、`success`、`warning`、`danger` | 徽标类型 |
| `offset` | Array | `[0, 0]` | - | 设置徽标的偏移量，数组的两项分别对应水平和垂直偏移 |

## 示例

### 不同类型

::: demo 不同类型
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtBadge :value="12" type="primary">
      <XtButton size="small">评论</XtButton>
    </XtBadge>
    <XtBadge :value="3" type="success">
      <XtButton size="small">回复</XtButton>
    </XtBadge>
    <XtBadge :value="5" type="warning">
      <XtButton size="small">通知</XtButton>
    </XtBadge>
    <XtBadge value="99+" type="danger">
      <XtButton size="small">消息</XtButton>
    </XtBadge>
  </div>
</template>
```
:::

### 小圆点模式

::: demo 小圆点模式
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtBadge is-dot>
      <XtButton size="small">消息</XtButton>
    </XtBadge>
    <XtBadge is-dot type="success">
      <XtButton size="small">在线</XtButton>
    </XtBadge>
    <XtBadge is-dot type="danger">
      <XtButton size="small">错误</XtButton>
    </XtBadge>
  </div>
</template>
```
:::

### 最大值

::: demo 最大值
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtBadge :value="100" :max="99">
      <XtButton size="small">消息</XtButton>
    </XtBadge>
    <XtBadge :value="200" :max="99">
      <XtButton size="small">通知</XtButton>
    </XtBadge>
    <XtBadge :value="999" :max="99">
      <XtButton size="small">评论</XtButton>
    </XtBadge>
  </div>
</template>
```
:::

### 隐藏徽标

::: demo 隐藏徽标
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtBadge :value="12">
      <XtButton size="small">显示徽标</XtButton>
    </XtBadge>
    <XtBadge :value="12" hidden>
      <XtButton size="small">隐藏徽标</XtButton>
    </XtBadge>
  </div>
</template>
```
:::

### 自定义偏移

::: demo 自定义偏移
```vue
<template>
  <XtBadge :value="12" :offset="[10, 10]">
    <XtButton size="small">自定义偏移</XtButton>
  </XtBadge>
</template>
```
:::

### 独立使用

::: demo 独立使用
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtBadge :value="12" />
    <XtBadge value="99+" type="danger" />
    <XtBadge is-dot type="success" />
  </div>
</template>
```
:::

## 注意事项

- `max` 属性仅对数字类型的 `value` 有效
- 当 `value` 为 0 时，徽标默认显示，可以通过 `hidden` 属性控制显示/隐藏