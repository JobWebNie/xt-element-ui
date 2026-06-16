## XtCardItem 卡片项组件

卡片项组件用于在卡片内展示一行数据，支持标签、数值和单位的展示。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtCardItem label="销售额" value="12345" unit="元"></XtCardItem>
</template>
```
:::

## 属性说明
| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `iconType` | String | border | `border`、`icon` | 图标类型 |
| `type` | String | primary | `primary`、`success`、`warning`、`danger` | 颜色类型 |
| `label` | String | - | - | 标签文本 |
| `value` | String / Number | - | - | 数值内容 |
| `unit` | String | - | - | 数值单位 |
| `icon` | String | - | - | Element Plus 图标名称 |
| `iconAt` | String | right | `left`、`right`、`top`、`bottom` | 图标位置 |
| `color` | String | - | - | 自定义颜色 |

## 插槽说明

| 插槽名 | 说明 |
|--------|------|
| `label` | 自定义标签区域 |
| `value` | 自定义数值区域 |
| `unit` | 自定义单位区域 |
| `icon` | 自定义图标区域 |

## 示例

### 边框型卡片项（默认）

::: demo 边框型卡片项
```vue
<template>
  <XtCardItem label="销售额" value="12345" unit="元" type="primary"></XtCardItem>
</template>
```
:::

### 不同类型的边框卡片项

::: demo 不同类型的边框卡片项
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtCardItem label="成功" value="OK" type="success"></XtCardItem>
    <XtCardItem label="警告" value="Warning" type="warning"></XtCardItem>
    <XtCardItem label="危险" value="Error" type="danger"></XtCardItem>
  </div>
</template>
```
:::

### 自定义颜色
::: demo 自定义颜色
```vue
<template>
  <XtCardItem label="自定义颜色" value="100%" color="#722ed1"></XtCardItem>
</template>
```
:::

### 自定义插槽
::: demo 自定义插槽
```vue
<template>
  <XtCardItem>
    <template #label>
      <span style="color: #1890ff; font-weight: bold;">自定义标签</span>
    </template>
    <template #value>
      <span style="font-size: 18px;">9999</span>
    </template>
    <template #unit>
      <span style="color: #999;">自定义单位</span>
    </template>
  </XtCardItem>
</template>
```
:::

### 在卡片中使用

::: demo 在卡片中使用
```vue
<template>
  <XtCard title="统计数据">
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <XtCardItem label="总销售额" value="123456" unit="元"></XtCardItem>
      <XtCardItem label="订单数量" value="520" unit="单" type="success"></XtCardItem>
      <XtCardItem label="转化率" value="23.5" unit="%" type="warning"></XtCardItem>
    </div>
  </XtCard>
</template>
```
:::
