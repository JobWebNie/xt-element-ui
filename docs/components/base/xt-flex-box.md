## XtFlexBox 弹性布局组件

弹性布局组件，基于 CSS Flexbox 实现，提供便捷的布局能力。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtFlexBox gap="16px">
    <div style="width: 80px; height: 40px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">子元素1</div>
    <div style="width: 80px; height: 40px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">子元素2</div>
    <div style="width: 80px; height: 40px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">子元素3</div>
  </XtFlexBox>
</template>
```
:::

## 属性说明
| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `type` | String | flex | - | 布局类型 |
| `align` | String | center | `start`、`center`、`end`、`stretch`、`baseline` | 交叉轴对齐方式 |
| `content` | String | start | `start`、`center`、`end`、`between`、`around`、`evenly` | 主轴对齐方式 |
| `direction` | String | row | `row`、`row-reverse`、`column`、`column-reverse` | 排列方向 |
| `wrap` | String | unset | `wrap`、`nowrap`、`wrap-reverse` | 是否换行 |
| `gap` | String | - | - | 子元素间距 |

## 示例

### 水平居中且两端对齐
::: demo 水平居中且两端对齐
```vue
<template>
  <XtFlexBox content="space-between" align="center">
    <span>左侧内容</span>
    <span>右侧内容</span>
  </XtFlexBox>
</template>
```
:::

### 垂直布局

::: demo 垂直布局
```vue
<template>
  <XtFlexBox direction="column" gap="12px">
    <div style="background: #1890ff; color: white; padding: 8px;">顶部</div>
    <div style="background: #52c41a; color: white; padding: 8px;">中部</div>
    <div style="background: #faad14; color: white; padding: 8px;">底部</div>
  </XtFlexBox>
</template>
```
:::

### 均匀分布

::: demo 均匀分布
```vue
<template>
  <XtFlexBox content="space-around">
    <div style="width: 60px; height: 60px; background: #e6f7ff; border-radius: 8px; display: flex; align-items: center; justify-content: center;">1</div>
    <div style="width: 60px; height: 60px; background: #e6f7ff; border-radius: 8px; display: flex; align-items: center; justify-content: center;">2</div>
    <div style="width: 60px; height: 60px; background: #e6f7ff; border-radius: 8px; display: flex; align-items: center; justify-content: center;">3</div>
    <div style="width: 60px; height: 60px; background: #e6f7ff; border-radius: 8px; display: flex; align-items: center; justify-content: center;">4</div>
  </XtFlexBox>
</template>
```
:::

### 自动换行

::: demo 自动换行
```vue
<template>
  <XtFlexBox wrap="wrap" gap="8px">
    <div v-for="i in 10" :key="i" style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">{{ i }}</div>
  </XtFlexBox>
</template>
```
:::

### 反向排列

::: demo 反向排列
```vue
<template>
  <XtFlexBox direction="row-reverse">
    <span style="padding: 8px; background: #f5f5f5;">第一</span>
    <span style="padding: 8px; background: #f5f5f5;">第二</span>
    <span style="padding: 8px; background: #f5f5f5;">第三</span>
  </XtFlexBox>
</template>
```
:::

### 嵌套使用

::: demo 嵌套使用
```vue
<template>
  <XtFlexBox direction="column" gap="16px">
    <XtFlexBox content="space-between">
      <span>头部左侧</span>
      <span>头部右侧</span>
    </XtFlexBox>
    <XtFlexBox>
      <div style="flex: 1; background: #e6f7ff; padding: 16px;">主内容区</div>
      <div style="width: 200px; background: #f6ffed; padding: 16px;">侧边栏</div>
    </XtFlexBox>
  </XtFlexBox>
</template>
```
:::
