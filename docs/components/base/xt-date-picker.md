## XtDatePicker 日期选择器组件

日期选择器组件用于选择日期范围或单个日期，支持多种日期类型（年月日、年月、年、季度等），并提供时间维度选择功能，满足统计分析场景。

## 基本用法

::: demo 基本用法（日期范围）
```vue
<template>
  <XtDatePicker v-model="dateRange" />
</template>

<script>
export default {
  data() {
    return {
      dateRange: ""
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `value` / `v-model` | Array / String | - | - | 日期范围 `[start, end]` 或单个日期字符串 |
| `dateType` | String | `date` | `date`、`datetime`、`month`、`year`、`quarter`、`week` | 日期类型 |
| `separator` | String | `至` | - | 范围选择时的分隔符文本 |
| `disabled` | Boolean | `false` | - | 是否禁用 |
| `width` | String | `100%` | - | 组件宽度，如 `'500px'` |
| `rangeMode` | Boolean | `true` | - | 是否为范围选择模式，false 时为单选 |
| `showDimension` | Boolean | `false` | - | 是否显示时间维度选择器（日/月/年/自定义） |
| `dimension` | String | `date` | `date`、`month`、`year`、`daterange` | 当前时间维度 |
| `immediate` | Boolean | `true` | - | 切换维度后是否立即触发事件 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `change` | `value` | 日期值改变时触发 |
| `dimension-change` | `{ dimension, value }` | 时间维度或值变化时触发 |
| `focus` | - | 输入框获得焦点时触发 |
| `blur` | - | 输入框失去焦点时触发 |

## 示例

### 日期范围选择

::: demo 日期范围选择
```vue
<template>
  <XtDatePicker v-model="dateRange" rangeMode="true" />
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

### 月份范围选择

::: demo 月份范围选择
```vue
<template>
  <XtDatePicker v-model="monthRange" dateType="month" />
</template>

<script>
export default {
  data() {
    return {
      monthRange: ""
    }
  }
}
</script>
```
:::

### 年份范围选择

::: demo 年份范围选择
```vue
<template>
  <XtDatePicker v-model="yearRange" dateType="year" />
</template>

<script>
export default {
  data() {
    return {
      yearRange: ""
    }
  }
}
</script>
```
:::

### 季度选择

::: demo 季度选择
```vue
<template>
  <XtDatePicker v-model="quarterRange" dateType="quarter" />
</template>

<script>
export default {
  data() {
    return {
      quarterRange: ""
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
    @dimension-change="handleDimensionChange"
  />
</template>

<script>
export default {
  data() {
    return {
      dateRange: "",
      currentDimension: 'date'
    }
  },
  methods: {
    handleDimensionChange({ dimension, value }) {
      this.currentDimension = dimension
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
      dateRange: ""
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
      dateRange: ""
    }
  }
}
</script>
```
:::

### 自定义宽度

::: demo 自定义宽度
```vue
<template>
  <XtDatePicker v-model="dateRange" width="600" />
</template>

<script>
export default {
  data() {
    return {
      dateRange: ""
    }
  }
}
</script>
```
:::

## 时间维度说明

当启用 `showDimension` 后，选择不同维度会有以下效果：

| 维度 | 日期类型 | 格式 | 说明 |
|------|----------|------|------|
| `date` | date | yyyy-MM-dd | 日维度，选择日期范围 |
| `month` | month | yyyy-MM | 月维度，选择月份范围 |
| `year` | year | yyyy | 年维度，选择年份范围 |
| `daterange` | date | yyyy-MM-dd | 自定义区间，选择日期范围 |

## 日期类型格式

| 类型 | 显示格式 | 说明 |
|------|----------|------|
| `date` | yyyy-MM-dd | 日期 |
| `month` | yyyy-MM | 月份 |
| `year` | yyyy | 年份 |
| `quarter` | yyyy-Qq | 季度（如 2026-Q3） |
| `week` | yyyy-WW | 周 |
| `datetime` | yyyy-MM-dd HH:mm | 日期时间 |

## 注意事项

1. **范围模式**：默认开启范围选择（`rangeMode: true`），返回值为数组 `[start, end]`
2. **单选模式**：设置 `rangeMode: false` 后，返回值为单个日期字符串
3. **维度切换**：切换维度时会自动关闭下拉面板，避免页面布局跳动
4. **季度格式**：季度类型使用自定义格式 `yyyy-Qq`，如 `2026-Q3`
5. **值类型**：所有日期值均为字符串类型，便于后端交互