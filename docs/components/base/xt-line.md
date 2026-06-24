## XtLine 折线图组件

基于 ECharts 封装的折线图组件，支持面积图、平滑曲线等功能。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtLine :chart-data="chartData" />
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
| `isArea` | Boolean | `false` | 是否显示面积图 |
| `unit` | String | `""` | 数据单位 |
| `intervalvalue` | Number | `0` | X 轴标签间隔，0 表示全部显示 |
| `simpleMode` | Boolean | `false` | 是否启用极简模式（隐藏图例、坐标轴等） |

## 示例

### 面积图

::: demo 面积图
```vue
<template>
  <XtLine :chart-data="chartData" :is-area="true" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 53, label: "1月" },
        { value: 60, label: "2月" },
        { value: 78, label: "3月" },
        { value: 82, label: "4月" },
        { value: 95, label: "5月" }
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
  <XtLine :chart-data="chartData" simple-mode />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 53, label: "A" },
        { value: 60, label: "B" },
        { value: 78, label: "C" }
      ]
    }
  }
}
</script>
```
:::

### 自定义字段映射

::: demo 自定义字段映射
```vue
<template>
  <XtLine :chart-data="chartData" :field-keys="{ label: 'month', value: 'amount' }" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { month: "1月", amount: 53 },
        { month: "2月", amount: 60 },
        { month: "3月", amount: 78 }
      ]
    }
  }
}
</script>
```
:::

### 暗色主题

::: demo 暗色主题
```vue
<template>
  <XtLine :chart-data="chartData" theme="dark" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 53, label: "张三" },
        { value: 60, label: "李四" },
        { value: 78, label: "王五" }
      ]
    }
  }
}
</script>
```
:::

## 注意事项

- 折线图默认使用平滑曲线
- 数据值大于等于 10000 时会自动转换为"万"单位显示