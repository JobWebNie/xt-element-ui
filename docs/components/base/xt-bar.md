基于 ECharts 封装的柱状图组件，支持数据标记、缩放、反转、长标签等功能。

## 基本用法

::: demo 基本用法
```vue
<template>
  <div class="demo-container"><XtBar :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 65, label: "张三" },
        { value: 70, label: "唐九" },
        { value: 73, label: "钱一" },
        { value: 78, label: "孙二" },
        { value: 88, label: "刘八" },
        { value: 93, label: "王七" },
        { value: 99, label: "赵六" },
        { value: 103, label: "宋五" },
        { value: 113, label: "李四" },
        { value: 125, label: "张三" }
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
| `size` | String | `medium` | 尺寸，`small` / `medium` / `large` |
| `markPoint` | Boolean | `false` | 是否显示最大值/最小值标记 |
| `unit` | String | `""` | 数据单位 |
| `showZoom` | Boolean | `false` | 是否显示缩放条 |
| `reverse` | Boolean | `false` | 是否反转坐标轴（横向柱状图） |
| `longLable` | Boolean | `false` | 是否启用长标签换行 |
| `longLableSplitNum` | Number | `1` | 长标签换行间隔字符数 |
| `longLablePx` | Number | `150` | 长标签预留像素宽度 |
| `splitNumber` | Number | `5` | Y 轴分割段数 |
| `simpleMode` | Boolean | `false` | 是否启用极简模式（隐藏图例、坐标轴等） |

## 示例

### 横向柱状图

::: demo 横向柱状图
```vue
<template>
  <div  class="demo-container"><XtBar :chart-data="chartData" reverse /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 65, label: "张三" },
        { value: 78, label: "李四" },
        { value: 95, label: "王五" },
        { value: 82, label: "赵六" }
      ]
    }
  }
}
</script>
```
:::

### 显示数据标记

::: demo 显示数据标记
```vue
<template>
  <div  class="demo-container"><XtBar :chart-data="chartData" :mark-point="true" /></div>
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

### 极简模式

::: demo 极简模式
```vue
<template>
  <div  class="demo-container"><XtBar :chart-data="chartData"  simple-mode /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { value: 65, label: "A" },
        { value: 78, label: "B" },
        { value: 95, label: "C" }
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
  <div  class="demo-container"><XtBar :chart-data="chartData" :field-keys="{ label: 'name', value: 'score' }" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { name: "张三", score: 65 },
        { name: "李四", score: 78 },
        { name: "王五", score: 95 }
      ]
    }
  }
}
</script>
```
:::

## 注意事项

- 数据值大于等于 10000 时会自动转换为"万"单位显示
- 数据值大于等于 10000000 时会自动转换为"千万"单位显示