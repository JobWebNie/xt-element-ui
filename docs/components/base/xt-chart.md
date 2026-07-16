基于 ECharts 封装的图表容器组件，通过 `type` 属性切换不同图表类型（柱状图、折线图、饼图、组合图）。

## 基本用法

::: demo 基本用法
```vue
<template>
  <div class="demo-container"><XtChart type="bar" :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 65, label: "张三" },
        { value: 78, label: "李四" },
        { value: 95, label: "王五" }
      ]
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `type` | String | `bar` | `bar`、`line`、`pie`、`multi` | 图表类型 |
| `theme` | String | - | `dark`、`default` | 主题，自动检测父元素 `data-theme` |
| `size` | String | `medium` | `small`、`medium`、`large` | 图表尺寸 |

## 示例

### 柱状图

::: demo 柱状图
```vue
<template>
  <div class="demo-container"><XtChart type="bar" :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 65, label: "张三" },
        { value: 78, label: "李四" },
        { value: 95, label: "王五" },
        { value: 82, label: "赵六" },
        { value: 70, label: "钱七" }
      ]
    }
  }
}
</script>
```
:::

### 折线图

::: demo 折线图
```vue
<template>
  <div class="demo-container"><XtChart type="line" :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 65, label: "1月" },
        { value: 78, label: "2月" },
        { value: 95, label: "3月" },
        { value: 82, label: "4月" },
        { value: 70, label: "5月" }
      ]
    }
  }
}
</script>
```
:::

### 饼图

::: demo 饼图
```vue
<template>
  <div class="demo-container"><XtChart type="pie" :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 30, label: "北京" },
        { value: 25, label: "上海" },
        { value: 20, label: "广州" },
        { value: 25, label: "深圳" }
      ]
    }
  }
}
</script>
```
:::

### 组合图

::: demo 组合图
```vue
<template>
  <div class="demo-container"><XtChart type="multi" :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        {
          label: "销售额",
          unit: "万元",
          data: [
            { label: "1月", value: 100 },
            { label: "2月", value: 120 },
            { label: "3月", value: 90 }
          ]
        },
        {
          label: "订单数",
          unit: "单",
          data: [
            { label: "1月", value: 50 },
            { label: "2月", value: 60 },
            { label: "3月", value: 45 }
          ]
        }
      ]
    }
  }
}
</script>
```
:::

## 注意事项

- `XtChart` 是一个容器组件，会根据 `type` 属性渲染对应的子组件（XtBar/XtLine/XtPie/XtMulti）
- 所有子组件的 props 都可以通过 `XtChart` 透传
- 主题会自动检测父元素的 `data-theme` 属性，无需手动传递