## XtPage 页面组件

页面布局组件，提供 header、main、footer、aside 区域的布局，支持高度自适应。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtPage>
    <template #header>页面标题</template>
    <template #default="{ tableHeight }">
      <XtTable :height="tableHeight" :table-data="tableData" :columns="columns" />
    </template>
    <template #footer>页面底部</template>
  </XtPage>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      columns: []
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showHeader` | Boolean | `true` | 是否显示头部 |
| `showFooter` | Boolean | `true` | 是否显示底部 |
| `showAside` | Boolean | `true` | 是否显示侧边栏 |
| `asideWidth` | String | - | 侧边栏宽度 |
| `diffHeight` | Number | `60` | 差值高度 |
| `minHeight` | Number | `200` | 最小高度 |

## 插槽说明

| 插槽名 | 说明 |
|--------|------|
| `default` | 主内容区域，接收 `tableHeight` 参数 |
| `header` | 头部区域 |
| `footer` | 底部区域 |
| `aside` | 侧边栏区域 |
| `dialog` | 弹窗区域 |

## 示例

### 带侧边栏

::: demo 带侧边栏
```vue
<template>
  <XtPage aside-width="200px">
    <template #header>页面标题</template>
    <template #aside>侧边栏内容</template>
    <template #default>主内容</template>
  </XtPage>
</template>
```
:::

### 仅主内容

::: demo 仅主内容
```vue
<template>
  <XtPage :show-header="false" :show-footer="false">
    <template #default>仅主内容区域</template>
  </XtPage>
</template>
```
:::

## 注意事项

- 默认插槽会传入 `tableHeight` 参数，用于表格高度自适应
- 组件会监听窗口大小变化，自动调整表格高度