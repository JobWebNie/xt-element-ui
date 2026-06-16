## ExMulti - 组合图组件

基于 ECharts 封装的组合图组件，支持多系列数据展示。

## 基本用法

::: demo 组合图基础示例
```vue
<template>
  <ExChart type="multi" :chartData="chartData" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
          {
            label: "入户数",
            unit: "户",
            data: [
              { label: "01月", value: 980 },
              { label: "02月", value: 806 },
              { label: "03月", value: 930 },
              { label: "04月", value: 804 },
              { label: "05月", value: 750 },
              { label: "06月", value: 660 },
              { label: "07月", value: 780 },
              { label: "08月", value: 630 },
              { label: "09月", value: 806 },
              { label: "10月", value: 950 },
              { label: "11月", value: 810 },
              { label: "12月", value: 703 }
            ]
          },
          {
            label: "隐患数",
            unit: "个",
            data: [
              { label: "01月", value: 200 },
              { label: "02月", value: 120 },
              { label: "03月", value: 110 },
              { label: "04月", value: 109 },
              { label: "05月", value: 108 },
              { label: "06月", value: 150 },
              { label: "07月", value: 126 },
              { label: "08月", value: 130 },
              { label: "09月", value: 108 },
              { label: "10月", value: 109 },
              { label: "11月", value: 140 },
              { label: "12月", value: 106 }
            ]
          },
          {
            label: "整改数",
            unit: "个",
            data: [
              { label: "01月", value: 25 },
              { label: "02月", value: 19 },
              { label: "03月", value: 34 },
              { label: "04月", value: 12 },
              { label: "05月", value: 16 },
              { label: "06月", value: 20 },
              { label: "07月", value: 19 },
              { label: "08月", value: 18 },
              { label: "09月", value: 14 },
              { label: "10月", value: 12 },
              { label: "11月", value: 11 },
              { label: "12月", value: 16 }
            ]
          }
        ]
    }
  }
}
</script>
```
:::

## 三系列组合

::: demo 三系列组合图示例
```vue
<template>
  <ExChart type="multi" :chartData="chartData" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        {
          label: "收入",
          data: [
            { label: "Q1", value: 1200 },
            { label: "Q2", value: 1500 },
            { label: "Q3", value: 1800 },
            { label: "Q4", value: 2200 }
          ]
        },
        {
          label: "支出",
          data: [
            { label: "Q1", value: 800 },
            { label: "Q2", value: 950 },
            { label: "Q3", value: 1100 },
            { label: "Q4", value: 1250 }
          ]
        },
        {
          label: "利润",
          data: [
            { label: "Q1", value: 400 },
            { label: "Q2", value: 550 },
            { label: "Q3", value: 700 },
            { label: "Q4", value: 950 }
          ]
        }
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
| `chartData` | Array | [] | 图表数据，支持多个系列 |
| `theme` | String | '' | 主题名称 |
| `size` | String | 'medium' | 尺寸 |

## 数据格式

```javascript
[
  {
    label: "系列名称1",
    data: [
      { label: "分类1", value: 数值 },
      { label: "分类2", value: 数值 },
      // ...
    ]
  },
  {
    label: "系列名称2",
    data: [
      { label: "分类1", value: 数值 },
      // ...
    ]
  }
]
```