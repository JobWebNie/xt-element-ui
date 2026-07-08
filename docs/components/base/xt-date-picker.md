## XtDatePicker 日期选择器组件

日期选择器组件用于选择日期范围或单个日期，支持多种日期类型（年月日、年月、年、季度等），并提供时间维度选择功能，满足统计分析场景。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtDatePicker v-model="dateRange" />
</template>

<script>
export default {
  data() {
    return {
      dateRange: []
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `value` / `v-model` | Array / Date | - | - | 日期范围 `[startDate, endDate]` 或单个日期 |
| `dateType` | String | `date` | `date`、`datetime`、`month`、`year`、`quarter`、`week` | 日期类型 |
| `separator` | String | `至` | - | 分隔符文本 |
| `disabled` | Boolean | `false` | - | 是否禁用 |
| `width` | String | `100%` | - | 组件宽度 |
| `rangeMode` | Boolean | `true` | - | 是否为范围选择模式，false 时为单选 |
| `showDimension` | Boolean | `false` | - | 是否显示时间维度选择器 |
| `dimension` | String | `day` | `day`、`month`、`year`、`custom` | 当前时间维度 |

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `change` | 日期值改变时触发 | `[startDate, endDate]` 或 `date` |
| `dimension-change` | 时间维度或值变化时触发 | `{ dimension, value }` |
| `focus` | 输入框获得焦点时触发 | - |
| `blur` | 输入框失去焦点时触发 | - |

## 示例

### 不同日期类型

::: demo 不同日期类型
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <XtDatePicker v-model="dateRange" dateType="date" />
    <XtDatePicker v-model="monthRange" dateType="month" />
    <XtDatePicker v-model="yearRange" dateType="year" />
    <XtDatePicker v-model="quarterRange" dateType="quarter" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateRange: [],
      monthRange: [],
      yearRange: [],
      quarterRange: []
    }
  }
}
</script>
```
:::

### 单选模式

::: demo 单选模式
```vue
<template>
  <XtDatePicker v-model="singleDate" :range-mode="false" />
</template>

<script>
export default {
  data() {
    return {
      singleDate: null
    }
  }
}
</script>
```
:::

### 时间维度选择（统计分析）

::: demo 时间维度选择
```vue
<template>
  <XtDatePicker 
    v-model="dateRange" 
    :show-dimension="true" 
    :dimension="currentDimension"
    @update:dimension="currentDimension = $event"
    @dimension-change="handleDimensionChange"
  />
</template>

<script>
export default {
  data() {
    return {
      dateRange: [],
      currentDimension: 'day'
    }
  },
  methods: {
    handleDimensionChange({ dimension, value }) {
      console.log('维度:', dimension, '值:', value)
    }
  }
}
</script>
```
:::

### 自定义分隔符

::: demo 自定义分隔符
```vue
<template>
  <XtDatePicker v-model="dateRange" separator="~" />
</template>

<script>
export default {
  data() {
    return {
      dateRange: []
    }
  }
}
</script>
```
:::

### 禁用状态

::: demo 禁用状态
```vue
<template>
  <XtDatePicker v-model="dateRange" disabled />
</template>

<script>
export default {
  data() {
    return {
      dateRange: []
    }
  }
}
</script>
```
:::

## 时间维度说明

当启用 `showDimension` 后，选择不同维度会有以下效果：

| 维度 | 日期类型 | 选择模式 | 范围限制 |
|------|----------|----------|----------|
| `day` | date | 范围选择 | 无限制 |
| `month` | month | 范围选择 | 结束日期必须与开始日期同月份 |
| `year` | year | 范围选择 | 结束日期必须与开始日期同年份 |
| `custom` | 保持原值 | 单选 | 用户自定义 |

选择"月"维度后，结束日期会限制在开始日期所在月份内，方便统计分析时快速选择同一月内的日期范围。