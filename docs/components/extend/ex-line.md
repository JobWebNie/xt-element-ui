## ExLine - 折线图组件

基于 ECharts 封装的折线图组件。

## 基本用法

::: demo 折线图基础示例
```vue
<template>
  <ExChart type="line" :chartData="chartData" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { name: '1月', value: 50 },
        { name: '2月', value: 65 },
        { name: '3月', value: 78 },
        { name: '4月', value: 82 },
        { name: '5月', value: 95 },
        { name: '6月', value: 88 }
      ]
    }
  }
}
</script>
```
:::

## 面积区域

::: demo 显示面积区域
```vue
<template>
  <ExChart type="line" :chartData="chartData" :isArea="true" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { name: '1月', value: 2450 },
        { name: '2月', value: 2800 },
        { name: '3月', value: 3200 },
        { name: '4月', value: 2950 },
        { name: '5月', value: 3500 },
        { name: '6月', value: 3800 },
        { name: '7月', value: 4200 },
        { name: '8月', value: 4500 }
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
| `isDark` | Boolean | false | 是否暗色模式 |
| `isArea` | Boolean | false | 是否显示面积区域 |
| `energyType` | String | '' | Y轴单位 |
| `intervalvalue` | Number | 0 | 自定义间隔值 |