基于 ECharts 封装的饼图组件，支持环形图、玫瑰图、自定义颜色等功能。

## 基本用法

::: demo 基本用法
```vue
<template>
  <div class="demo-container"><XtPie :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 53, label: "张三" },
        { value: 10, label: "李四" },
        { value: 60, label: "宋五" }
      ]
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `chartData` | Array | - | 图表数据，格式为 `[{ label, value }]` |
| `fieldKeys` | Object | `{ label: "label", value: "value", data: "data" }` | 字段映射配置 |
| `theme` | String | - | 主题，`dark` 或 `default` |
| `size` | String | `medium` | 尺寸，`small` / `medium` / `large` |
| `colors` | Array | `[]` | 自定义颜色数组 |
| `unit` | String | `""` | 数据单位 |
| `showLegend` | Boolean | `true` | 是否显示图例 |
| `simpleMode` | Boolean | `false` | 是否启用极简模式 |
| `roseType` | String | `""` | 玫瑰图类型，`""` / `radius` / `area` |
| `showLabel` | Boolean | `true` | 是否显示标签 |
| `totalLabel` | String | `"总数"` | 中心总数标签文本 |

## 示例

### 玫瑰图

::: demo 玫瑰图
```vue
<template>
  <div class="demo-container"><XtPie :chart-data="chartData" rose-type="radius" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 53, label: "北京" },
        { value: 60, label: "上海" },
        { value: 78, label: "广州" },
        { value: 82, label: "深圳" },
        { value: 95, label: "杭州" }
      ]
    }
  }
}
</script>
```
:::

### 隐藏图例

::: demo 隐藏图例
```vue
<template>
  <div class="demo-container"><XtPie :chart-data="chartData" :show-legend="false" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 30, label: "A" },
        { value: 25, label: "B" },
        { value: 20, label: "C" },
        { value: 25, label: "D" }
      ]
    }
  }
}
</script>
```
:::

### 自定义颜色

::: demo 自定义颜色
```vue
<template>
  <div class="demo-container"><XtPie :chart-data="chartData" :colors="['#1890ff', '#52c41a', '#faad14', '#f5222d']" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 30, label: "红色" },
        { value: 25, label: "蓝色" },
        { value: 20, label: "绿色" },
        { value: 25, label: "黄色" }
      ]
    }
  }
}
</script>
```
:::

### 极简模式

::: demo 极简模式
```vue
<template>
  <div class="demo-container"><XtPie :chart-data="chartData" simple-mode /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 30, label: "A" },
        { value: 25, label: "B" },
        { value: 20, label: "C" },
        { value: 25, label: "D" }
      ]
    }
  }
}
</script>
```
:::


## 注意事项

- 饼图中心会自动显示总数
- 最小扇区角度为 5 度，小于此角度的扇区会合并显示