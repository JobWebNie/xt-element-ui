卡片组件用于展示信息，通常包含标题和内容区域。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtCard title="卡片标题" value="123" unit="元"></XtCard>
</template>
```
:::

## 示例

### 基础卡片

::: demo 基础卡片
```vue
<template>
  <XtCard title="今日销售额" :value="123456" unit="元"></XtCard>
</template>
```
:::

### 自定义内容

::: demo 自定义内容
```vue
<template>
  <XtCard title="用户统计">
    <div style="display: flex; justify-content: space-around;">
      <div style="text-align: center;">
        <span style="display: block; font-size: 12px; color: #999;">新增用户</span>
        <span style="font-size: 24px; font-weight: bold; color: #1890ff;">520</span>
      </div>
      <div style="text-align: center;">
        <span style="display: block; font-size: 12px; color: #999;">活跃用户</span>
        <span style="font-size: 24px; font-weight: bold; color: #52c41a;">3840</span>
      </div>
    </div>
  </XtCard>
</template>
```
:::

### 自定义标题和数值

::: demo 自定义标题和数值
```vue
<template>
  <XtCard>
    <template #title>
      <span style="color: #1890ff;">📊 数据分析</span>
    </template>
    <template #value>
      <span style="font-size: 32px; color: #52c41a;">98.5%</span>
    </template>
  </XtCard>
</template>
```
:::

### 无边距卡片

::: demo 无边距卡片
```vue
<template>
  <XtCard title="紧凑卡片" :value="100" noPadding>
    <div style="padding: 8px;">
      <p>内容区域没有额外内边距</p>
    </div>
  </XtCard>
</template>
```
:::

### 卡片组

::: demo 卡片组
```vue
<template>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
    <XtCard title="销售额" value="12345" unit="元"></XtCard>
    <XtCard title="订单数" value="520" unit="单"></XtCard>
    <XtCard title="转化率" value="23.5" unit="%"></XtCard>
  </div>
</template>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | String | - | 卡片标题 |
| `value` | String / Number | - | 卡片数值 |
| `unit` | String | - | 数值单位 |
| `noPadding` | Boolean | false | 是否取消内边距 |

## 插槽说明

| 插槽名 | 说明 |
|--------|------|
| `default` | 自定义内容区域 |
| `title` | 自定义标题区域 |
| `value` | 自定义数值区域 |
