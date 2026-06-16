## ExPie - 饼图组件

基于 ECharts 封装的饼图组件。

## 基本用法

::: demo 饼图基础示例
```vue
<template>
  <ExChart type="pie" :chartData="chartData" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { name: '苹果', value: 35 },
        { name: '香蕉', value: 25 },
        { name: '橙子', value: 20 },
        { name: '葡萄', value: 15 },
        { name: '其他', value: 5 }
      ]
    }
  }
}
</script>
```
:::

## 玫瑰图

::: demo 玫瑰图示例
```vue
<template>
  <ExChart type="pie" :chartData="chartData" roseType="area" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { name: '手机端', value: 4520 },
        { name: 'PC端', value: 3280 },
        { name: '平板端', value: 1250 },
        { name: '小程序', value: 2150 },
        { name: 'H5页面', value: 1800 }
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
| `chartData` | Array | [] | 图表数据 |
| `theme` | String | '' | 主题名称 |
| `size` | String | 'medium' | 尺寸 |
| `colors` | Array | [] | 自定义颜色数组 |
| `unit` | String | '' | 数值单位 |
| `showLegend` | Boolean | true | 是否显示图例 |
| `showLabel` | Boolean | true | 是否显示标签 |
| `chartMode` | String | 'dark' | 图表模式 |
| `roseType` | String | '' | 玫瑰图类型 |
| `totalLabel` | String | '总数' | 总数标签文本 |