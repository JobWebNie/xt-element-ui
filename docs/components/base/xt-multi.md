基于 ECharts 封装的组合图组件，支持多系列数据展示，自动根据单位分组使用不同 Y 轴。

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
        {
          label: "入户数",
          unit: "户",
          data: [
            { label: "01月", value: 980 },
            { label: "02月", value: 806 },
            { label: "03月", value: 930 }
          ]
        },
        {
          label: "隐患数",
          unit: "个",
          data: [
            { label: "01月", value: 200 },
            { label: "02月", value: 120 },
            { label: "03月", value: 110 }
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
| `chartData` | Array | - | 图表数据，格式详见下方示例 |
| `fieldKeys` | Object | `{ label: "label", value: "value", data: "data" }` | 字段映射配置 |
| `theme` | String | - | 主题，`dark` 或 `default` |
| `size` | String | `medium` | 尺寸，`small` / `medium` / `large` |
| `colors` | Array | `[]` | 自定义颜色数组 |
| `simpleMode` | Boolean | `false` | 是否启用极简模式 |
| `highlightKey` | String | - | 高亮系列的 label |
| `config` | Object | - | 配置对象 |

## config 配置说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `interval` | Number | `0` | X 轴标签间隔 |
| `rotate` | Number | `0` | X 轴标签旋转角度 |
| `gridbottom` | Number | `40` | 底部网格间距 |
| `isShowthreshold` | Boolean | `false` | 是否显示阈值线 |

## 示例

### 多单位组合图

::: demo 多单位组合图
```vue
<template>
  <div class="demo-container"><XtMulti :chart-data="chartData" /></div>
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
        },
        {
          label: "转化率",
          unit: "%",
          data: [
            { label: "1月", value: 50 },
            { label: "2月", value: 55 },
            { label: "3月", value: 48 }
          ]
        }
      ]
    }
  }
}
</script>
```
:::

### 折线与柱状图组合

::: demo 折线与柱状图组合
```vue
<template>
  <div class="demo-container"><XtMulti :chart-data="chartData" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        {
          label: "销售额",
          unit: "万元",
          type: "bar",
          data: [
            { label: "1月", value: 100 },
            { label: "2月", value: 120 },
            { label: "3月", value: 90 }
          ]
        },
        {
          label: "增长率",
          unit: "%",
          type: "line",
          data: [
            { label: "1月", value: 10 },
            { label: "2月", value: 20 },
            { label: "3月", value: -25 }
          ]
        }
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
  <div class="demo-container"><XtMulti :chart-data="chartData" :colors="['#1890ff', '#52c41a', '#faad14']" /></div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        {
          label: "A系列",
          unit: "个",
          data: [
            { label: "1月", value: 100 },
            { label: "2月", value: 120 }
          ]
        },
        {
          label: "B系列",
          unit: "个",
          data: [
            { label: "1月", value: 80 },
            { label: "2月", value: 90 }
          ]
        },
        {
          label: "C系列",
          unit: "个",
          data: [
            { label: "1月", value: 60 },
            { label: "2月", value: 70 }
          ]
        }
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
        {
          label: "A",
          data: [
            { label: "1", value: 100 },
            { label: "2", value: 120 }
          ]
        },
        {
          label: "B",
          data: [
            { label: "1", value: 80 },
            { label: "2", value: 90 }
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

- 相同 unit 的 series 会共用同一条 Y 轴
- 默认支持内部缩放（dataZoom）
- 每个 series 可以通过 `type` 属性指定图表类型（`bar` 或 `line`），默认为 `bar`