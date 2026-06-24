## XtDatePicker 日期选择器组件

日期选择器组件用于选择日期范围，支持多种日期类型（年月日、年月、年、季度等）。

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
| `value` / `v-model` | Array | - | - | 日期范围，格式为 `[startDate, endDate]` |
| `dateType` | String | `date` | `date`、`datetime`、`month`、`year`、`quarter`、`week` | 日期类型 |
| `separator` | String | `至` | - | 分隔符文本 |
| `disabled` | Boolean | `false` | - | 是否禁用 |
| `width` | Number | `280` | - | 组件宽度（px） |

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

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `change` | 日期值改变时触发 | `[startDate, endDate]` |
| `focus` | 输入框获得焦点时触发 | - |
| `blur` | 输入框失去焦点时触发 | - |