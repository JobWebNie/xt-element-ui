## ExChart 图表组件

图表组件基于 ECharts 封装，支持多种图表类型和主题样式。**使用前需自行安装 ECharts 依赖**。

## 安装依赖

```bash
npm install echarts --save
```

## 基础用法

图表组件包含五个独立子组件：`ExBar`（柱状图）、`ExLine`（折线图）、`ExPie`（饼图）、`ExMulti`（多系列组合图），以及统一入口组件 `ExChart`（通过 `type` 动态切换图表类型）。所有子组件支持通过 `fieldKeys` 自定义 chartData 中的字段映射。

## 全局通用属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | String / Object | - | 主题名称：`white`、`dark` 或自定义主题对象 |
| `size` | String | medium | 字体大小：`small`、`medium`、`large` |
| `chartData` | Array | 见各组件默认示例 | 图表数据数组 |
| `fieldKeys` | Object | `{ label: 'label', value: 'value', data: 'data' }` | 自定义 chartData 中字段名的映射，详见下方「自定义字段映射」 |
| `simpleMode` | Boolean | false | 是否开启极简模式（隐藏图例、坐标轴等装饰元素） |

### 自定义字段映射 (fieldKeys)

组件默认从 chartData 中读取 `label`、`value`、`data` 字段。如果后端返回的数据字段名不同，可通过 `fieldKeys` 映射。

```js
// 例如后端返回 { date: '01月', count: 980 }
fieldKeys: { label: 'date', value: 'count' }

// ExMulti 两层嵌套数据可同时配置外层与内层字段
// 外层: { title: '入户量', points: [...] }
// 内层: { month: '01月', num: 980 }
fieldKeys: { label: 'title', value: 'num', data: 'points' }
```

---

## ExBar 柱状图

::: demo 基础柱状图
```vue
<template>
  <ExBar :chartData="chartData" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: '华东区', value: 1250 },
        { label: '华南区', value: 980 },
        { label: '华北区', value: 890 },
        { label: '西南区', value: 720 },
        { label: '西北区', value: 560 }
      ]
    }
  }
}
</script>
```
:::

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `chartData` | Array | 默认示例数据 | 图表数据数组，每项包含 `label`（标签）和 `value`（数值） |
| `fieldKeys` | Object | `{ label: 'label', value: 'value', data: 'data' }` | 自定义字段映射 |
| `markPoint` | Boolean | false | 是否显示标记点（最大值、最小值） |
| `unit` | String | '' | Y轴单位名称 |
| `showZoom` | Boolean | false | 是否显示底部缩放滑动条 |
| `reverse` | Boolean | false | 是否反转坐标轴（纵向柱 → 横向柱） |
| `longLable` | Boolean | false | 是否启用长标签换行模式 |
| `longLableSplitNum` | Number | 1 | 长标签每隔几个字符换行一次 |
| `longLablePx` | Number | 150 | 长标签模式下左侧/底部预留空间 |
| `splitNumber` | Number | 5 | Y轴分割数量 |
| `simpleMode` | Boolean | false | 是否开启极简模式 |

---

## ExLine 折线图

::: demo 基础折线图，支持面积区域显示
```vue
<template>
  <ExLine :chartData="chartData" :isArea="true" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: '1月', value: 2450 },
        { label: '2月', value: 2800 },
        { label: '3月', value: 3200 },
        { label: '4月', value: 2950 },
        { label: '5月', value: 3500 },
        { label: '6月', value: 3800 },
        { label: '7月', value: 4200 },
        { label: '8月', value: 4500 },
        { label: '9月', value: 4100 },
        { label: '10月', value: 3800 },
        { label: '11月', value: 4600 },
        { label: '12月', value: 5200 }
      ]
    }
  }
}
</script>
```
:::

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `chartData` | Array | 默认示例数据 | 图表数据数组，每项包含 `label` 和 `value` |
| `fieldKeys` | Object | `{ label: 'label', value: 'value', data: 'data' }` | 自定义字段映射 |
| `isArea` | Boolean | false | 是否显示面积区域填充 |
| `unit` | String | '' | Y轴单位名称 |
| `intervalvalue` | Number | 0 | X轴标签显示间隔（0表示全部显示） |
| `simpleMode` | Boolean | false | 是否开启极简模式 |

---

## ExPie 饼图

::: demo 基础饼图，显示总数标题
```vue
<template>
  <ExPie :chartData="chartData" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: '手机端', value: 4520 },
        { label: 'PC端', value: 3280 },
        { label: '平板端', value: 1250 },
        { label: '小程序', value: 2150 },
        { label: 'H5页面', value: 1800 }
      ]
    }
  }
}
</script>
```
:::

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `chartData` | Array | 默认示例数据 | 图表数据数组，每项包含 `label` 和 `value` |
| `fieldKeys` | Object | `{ label: 'label', value: 'value', data: 'data' }` | 自定义字段映射 |
| `colors` | Array | [] | 自定义饼图颜色数组 |
| `unit` | String | '' | 数值单位（悬停提示时使用） |
| `showLegend` | Boolean | true | 是否显示图例 |
| `roseType` | String | '' | 玫瑰图类型，`'radius'`、`'area'` 等 |
| `showLabel` | Boolean | true | 是否显示饼图扇区标签及引线 |
| `totalLabel` | String | '总数' | 饼图中心显示的汇总标题文字 |
| `simpleMode` | Boolean | false | 是否开启极简模式 |
| `highlightKey` | String | - | 高亮字段键（用于指定高亮的扇区标识） |

### 计算说明

- `总数`：饼图中心会自动显示图表中心标题，格式为 `{totalLabel}:{value 之和}`。

---

## ExMulti 多系列组合图

多系列组合图，支持多个 series 共存（柱/线任意混合），根据不同 `unit` 自动生成多条 Y 轴。

::: demo 多系列数据示例
```vue
<template>
  <ExMulti :chartData="chartData" style="height: 400px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        {
          label: '入户量',
          unit: '户',
          type: 'bar',
          data: [
            { label: '01月', value: 980 },
            { label: '02月', value: 806 },
            { label: '03月', value: 930 },
            { label: '04月', value: 804 },
            { label: '05月', value: 750 },
            { label: '06月', value: 660 }
          ]
        },
        {
          label: '隐患量',
          unit: '个',
          type: 'line',
          data: [
            { label: '01月', value: 200 },
            { label: '02月', value: 120 },
            { label: '03月', value: 110 },
            { label: '04月', value: 109 },
            { label: '05月', value: 108 },
            { label: '06月', value: 150 }
          ]
        }
      ]
    }
  }
}
</script>
```
:::

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `chartData` | Array | 默认示例数据 | 多系列数据，每项外层包含 `label`、`unit`、`type`、`data[]`，内层每项包含 `label`、`value` |
| `fieldKeys` | Object | `{ label: 'label', value: 'value', data: 'data' }` | 自定义字段映射（外层/内层均生效） |
| `isDark` | Boolean | false | 是否暗色模式（文字标线为白色） |
| `colors` | Array | [] | 自定义系列颜色数组 |
| `energyType` | String / Array | '' | 预留字段，用于扩展类型/单位 |
| `config` | Object | `{ interval: 0, rotate: 0, gridbottom: 40, isShowthreshold: false }` | 高级配置：`rotate`（X轴标签旋转角度）、`gridbottom`（底部留白） |
| `simpleMode` | Boolean | false | 是否开启极简模式 |
| `highlightKey` | String | - | 高亮字段键 |

### chartData 结构说明

```js
[
  {
    label: '系列名称',       // series 名称（映射 fieldKeys.label）
    unit: '单位',            // series 单位，用于分组生成 Y 轴（去重）
    type: 'bar',             // 'bar' 或 'line'，不填默认 bar
    data: [                  // 数据点（映射 fieldKeys.data）
      { label: '01月', value: 980 }   // 内层映射 fieldKeys.label / fieldKeys.value
    ]
  }
]
```

---

## ExChart 统一入口

`ExChart` 是一个聚合组件，通过 `type` 属性动态选择使用哪个子组件。

```vue
<ExChart type="bar" :chartData="chartData" />
<ExChart type="line" :chartData="chartData" :isArea="true" />
<ExChart type="pie" :chartData="chartData" />
<ExChart type="multi" :chartData="chartData" />
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | String | bar | 图表类型：`bar`、`line`、`pie`、`multi` |

> 其余属性直接透传给子组件，详见各子组件的属性说明。

---

## 极简模式 (simpleMode)

极简模式隐藏图例、坐标轴、网格线等装饰元素，仅保留核心数据曲线/柱形，适用于 Dashboard 密集卡片展示场景。

::: demo 极简模式示例
```vue
<template>
  <ExBar :chart-data="chartData" simple-mode style="height: 200px;" />
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: '00:00', value: 53 },
        { label: '02:00', value: 48 },
        { label: '04:00', value: 42 },
        { label: '06:00', value: 55 },
        { label: '08:00', value: 78 },
        { label: '10:00', value: 89 },
        { label: '12:00', value: 95 },
        { label: '14:00', value: 88 },
        { label: '16:00', value: 76 },
        { label: '18:00', value: 65 },
        { label: '20:00', value: 58 },
        { label: '22:00', value: 52 }
      ]
    }
  }
}
</script>
```
:::

---

## 主题示例

::: demo 不同主题样式展示
```vue
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <div style="width: 300px; height: 200px;">
      <ExBar :chartData="chartData" theme="white" style="height: 200px;" />
    </div>
    <div style="width: 300px; height: 200px;">
      <ExBar :chartData="chartData" theme="dark" style="height: 200px;" />
    </div>
    <div style="width: 300px; height: 200px;">
      <ExBar :chartData="chartData" theme="blue" style="height: 200px;" />
    </div>
    <div style="width: 300px; height: 200px;">
      <ExBar :chartData="chartData" theme="orange" style="height: 200px;" />
    </div>
    <div style="width: 300px; height: 200px;">
      <ExBar :chartData="chartData" theme="starry" style="height: 200px;" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: '产品A', value: 1250 },
        { label: '产品B', value: 980 },
        { label: '产品C', value: 820 },
        { label: '产品D', value: 750 }
      ]
    }
  }
}
</script>
```
:::

### 主题列表

| 主题名称 | 说明 |
|----------|------|
| `white` | 白色主题（默认） |
| `dark` | 暗色主题（深色背景，建议容器设深色） |
| `blue` | 蓝色主题 |
| `orange` | 橙色主题 |
| `starry` | 星空主题 |

---

## 动态数据

::: demo 动态更新图表数据
```vue
<template>
  <div>
    <ExLine :chartData="chartData" :isArea="true" style="height: 400px;" />
    <button @click="updateData" style="margin-top: 16px; padding: 8px 16px;">更新数据</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: [
        { label: '1月', value: 50 },
        { label: '2月', value: 60 },
        { label: '3月', value: 70 },
        { label: '4月', value: 80 }
      ]
    }
  },
  methods: {
    updateData() {
      this.chartData = [
        { label: '1月', value: 55 },
        { label: '2月', value: 75 },
        { label: '3月', value: 65 },
        { label: '4月', value: 90 }
      ]
    }
  }
}
</script>
```
:::

---

## 使用自定义字段映射

当后端返回数据字段与组件默认字段（`label` / `value` / `data`）不一致时，使用 `fieldKeys` 做一次映射即可，无需在前端转换数据。

::: demo 自定义字段映射示例
```vue
<template>
  <ExBar
    :chartData="chartData"
    :fieldKeys="{ label: 'areaName', value: 'sales' }"
    style="height: 400px;"
  />
</template>

<script>
export default {
  data() {
    return {
      // 后端返回的数据字段不是 label/value
      chartData: [
        { areaName: '华东区', sales: 1250 },
        { areaName: '华南区', sales: 980 },
        { areaName: '华北区', sales: 890 },
        { areaName: '西南区', sales: 720 }
      ]
    }
  }
}
</script>
```
:::

多系列组合图的双层嵌套场景：

```vue
<ExMulti
  :chartData="chartData"
  :fieldKeys="{ label: 'title', value: 'num', data: 'points' }"
/>
<!--
  chartData 结构：
  [
    { title: '入户量', unit: '户', points: [{ month: '01月', num: 980 }] }
  ]
-->
```

---

## 注意事项

1. **依赖安装**：使用前必须安装 `echarts` 依赖
2. **容器尺寸**：确保图表容器有明确的高度（如 `style="height: 400px;"`），否则图表可能无法显示
3. **数据格式**：
   - `ExBar` / `ExLine` / `ExPie`：扁平数组，每项需包含可映射为 `label` 与 `value` 的字段
   - `ExMulti`：双层嵌套数组，外层需包含 `label`、`unit`、`type`、`data[]`，内层需包含 `label` 与 `value`
4. **Y轴去重**（ExMulti）：自动按外层 `unit` 去重合并生成 Y 轴，相同 unit 的 series 会共用同一条 Y 轴
5. **fieldKeys 合并**：仅需配置与默认值不同的字段即可，未配置的字段会使用默认值 `{ label: 'label', value: 'value', data: 'data' }`
