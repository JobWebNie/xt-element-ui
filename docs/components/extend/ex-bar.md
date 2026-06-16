## ExBar - 柱状图组件

基于 ECharts 封装的柱状图组件。

## 基本用法

::: demo 柱状图基础示例
```vue
<template>
  <ExChart type="bar" :chartData="chartData" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { name: '张三', value: 65 },
        { name: '李四', value: 78 },
        { name: '王五', value: 89 },
        { name: '赵六', value: 95 },
        { name: '钱七', value: 72 }
      ]
    }
  }
}
</script>
```
:::

## 显示标记点

::: demo 显示最大值和最小值标记点
```vue
<template>
  <ExChart type="bar" :chartData="chartData" :markPoint="true" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { name: '华东区', value: 1250 },
        { name: '华南区', value: 980 },
        { name: '华北区', value: 890 },
        { name: '西南区', value: 720 },
        { name: '西北区', value: 560 }
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
| `markPoint` | Boolean | false | 是否显示标记点 |
| `showZoom` | Boolean | false | 是否显示缩放功能 |
| `reverse` | Boolean | false | 是否反转坐标轴 |
| `longLable` | Boolean | false | 是否启用长标签模式 |
| `energyType` | String | '' | Y轴单位 |