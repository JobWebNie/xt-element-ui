基于 ECharts 封装的组合图组件，支持多系列数据展示，自动根据单位分组使用不同 Y 轴。

## 数据结构

`chartData` 采用扁平数组，每条数据点包含 `label`（X 轴类目）、`series`（系列名称）、`value`（数值）三个字段。组件会自动按 `series` 分组并对齐到类目维度。

系列的样式配置通过 `seriesMap` 属性传入，支持设置每个系列的图表类型、单位、样式等。

## 基本用法

::: demo 基本用法
```vue
<template>
  <div class="demo-container"><XtMulti :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: "01月", series: "入户数", value: 980 },
        { label: "01月", series: "隐患数", value: 200 },
        { label: "02月", series: "入户数", value: 806 },
        { label: "02月", series: "隐患数", value: 120 },
        { label: "03月", series: "入户数", value: 930 },
        { label: "03月", series: "隐患数", value: 110 }
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
| `chartData` | Array | 内置演示数据 | 扁平数组，格式为 `[{ label, series, value }]` |
| `seriesMap` | Object | `{}` | 系列配置，key 为系列名称，value 为配置对象 |
| `fieldKeys` | Object | `{ label: "label", series: "series", value: "value" }` | 字段映射配置 |
| `theme` | String | - | 主题，`dark` 或 `default` |
| `size` | String | `medium` | 尺寸，`small` / `medium` / `large` |
| `colors` | Array | `[]` | 自定义颜色数组 |
| `simpleMode` | Boolean | `false` | 是否启用极简模式 |
| `highlightKey` | String | - | 高亮系列的名称 |
| `width` | String | `100%` | 容器宽度 |
| `height` | String | `100%` | 容器高度 |
| `ratio` | Number | - | 宽高比（优先级高于 height） |

## seriesMap 配置项

每个系列可配置以下属性：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | String | `bar` | 图表类型：`bar` / `line` |
| `unit` | String | `""` | 单位，相同 unit 的系列共用同一条 Y 轴 |
| `areaStyle` | Boolean | `false` | 是否显示区域填充（line 类型有效） |
| `smooth` | Boolean | `false` | 是否平滑曲线（line 类型有效） |

## 示例

### 多单位组合图

::: demo 不同单位的系列自动分配到不同 Y 轴
```vue
<template>
  <div class="demo-container">
    <XtMulti :chart-data="chartData" :series-map="seriesMap" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: "1月", series: "销售额", value: 100 },
        { label: "1月", series: "订单数", value: 50 },
        { label: "1月", series: "转化率", value: 50 },
        { label: "2月", series: "销售额", value: 120 },
        { label: "2月", series: "订单数", value: 60 },
        { label: "2月", series: "转化率", value: 55 },
        { label: "3月", series: "销售额", value: 90 },
        { label: "3月", series: "订单数", value: 45 },
        { label: "3月", series: "转化率", value: 48 }
      ],
      seriesMap: {
        "销售额": { type: "bar", unit: "万元" },
        "订单数": { type: "bar", unit: "单" },
        "转化率": { type: "line", unit: "%" }
      }
    }
  }
}
</script>
```
:::

### 折线与柱状图组合

::: demo 同一图表中混合柱状图和折线图
```vue
<template>
  <div class="demo-container">
    <XtMulti :chart-data="chartData" :series-map="seriesMap" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: "1月", series: "销售额", value: 100 },
        { label: "1月", series: "增长率", value: 10 },
        { label: "2月", series: "销售额", value: 120 },
        { label: "2月", series: "增长率", value: 20 },
        { label: "3月", series: "销售额", value: 90 },
        { label: "3月", series: "增长率", value: -25 }
      ],
      seriesMap: {
        "销售额": { type: "bar", unit: "万元" },
        "增长率": { type: "line", unit: "%", areaStyle: true, smooth: true }
      }
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
  <div class="demo-container">
    <XtMulti :chart-data="chartData" :colors="['#1890ff', '#52c41a', '#faad14']" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: "1月", series: "A系列", value: 100 },
        { label: "1月", series: "B系列", value: 80 },
        { label: "1月", series: "C系列", value: 60 },
        { label: "2月", series: "A系列", value: 120 },
        { label: "2月", series: "B系列", value: 90 },
        { label: "2月", series: "C系列", value: 70 }
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
  <div class="demo-container"><XtMulti :chart-data="chartData" simple-mode /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: "1", series: "A", value: 100 },
        { label: "1", series: "B", value: 80 },
        { label: "2", series: "A", value: 120 },
        { label: "2", series: "B", value: 90 }
      ]
    }
  }
}
</script>
```
:::

### 字段映射

::: demo 通过 `fieldKeys` 自定义字段名
```vue
<template>
  <div class="demo-container">
    <XtMulti
      :chart-data="chartData"
      :field-keys="{ label: 'month', series: 'name', value: 'amount' }"
      :series-map="seriesMap"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { month: "1月", name: "收入", amount: 100 },
        { month: "1月", name: "支出", amount: 80 },
        { month: "2月", name: "收入", amount: 120 },
        { month: "2月", name: "支出", amount: 90 }
      ],
      seriesMap: {
        "收入": { type: "bar", unit: "万元" },
        "支出": { type: "line", unit: "万元", smooth: true }
      }
    }
  }
}
</script>
```
:::

## 注意事项

- `chartData` 为扁平数组，每条记录包含 `label`（X 轴类目）、`series`（系列名）、`value`（数值）
- 组件会自动将同一 `series` 的数据按 `label` 对齐到类目维度，缺失值自动补 `null`
- `seriesMap` 中配置了相同 `unit` 的系列会共用同一条 Y 轴
- 未配置 `seriesMap` 的系列默认使用 `bar` 类型，无单位
- 默认支持内部缩放（dataZoom）
