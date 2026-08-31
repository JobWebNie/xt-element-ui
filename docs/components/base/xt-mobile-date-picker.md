# XtMobileDatePicker 移动端日期时间选择器

底部弹出的移动端日期时间选择器，类似滴滴/Vant 风格，支持年月日时分滚轮选择。

## 基础用法

::: demo 基础用法
```vue
<template>
  <div>
    <el-input :value="value" placeholder="请选择日期时间" readonly style="width: 240px" @click.native="show = true">
      <el-button slot="append" icon="el-icon-date" @click="show = true"></el-button>
    </el-input>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">当前值：{{ value }}</p>

    <xt-mobile-date-picker
      :visible.sync="show"
      v-model="value"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: '2026-08-17 14:30'
    }
  },
  methods: {
    onConfirm(val) {
      this.$message.success('确认选择：' + val)
    },
    onCancel() {
      console.log('取消选择')
    }
  }
}
</script>
```
:::

## 自定义年份范围

::: demo 自定义年份范围
```vue
<template>
  <div>
    <el-input :value="value" placeholder="请选择日期时间" readonly style="width: 240px" @click.native="show = true">
      <el-button slot="append" icon="el-icon-date" @click="show = true"></el-button>
    </el-input>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">年份范围：2020-2030</p>

    <xt-mobile-date-picker
      :visible.sync="show"
      v-model="value"
      :min-year="2020"
      :max-year="2030"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: '2026-08-17 14:30'
    }
  }
}
</script>
```
:::

## 自定义显示列

通过 `columns` 配置显示哪些滚轮列，未配置的列不显示。

::: demo 仅显示年月日
```vue
<template>
  <div>
    <el-input :value="value" placeholder="请选择日期" readonly style="width: 240px" @click.native="show = true">
      <el-button slot="append" icon="el-icon-date" @click="show = true"></el-button>
    </el-input>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">仅年月日：{{ value }}</p>

    <xt-mobile-date-picker
      :visible.sync="show"
      v-model="value"
      :columns="['year', 'month', 'day', 'hour']"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: '2026-08-17'
    }
  }
}
</script>
```
:::

::: demo 仅时分
```vue
<template>
  <div>
    <el-input :value="value" placeholder="请选择时间" readonly style="width: 240px" @click.native="show = true">
      <el-button slot="append" icon="el-icon-time" @click="show = true"></el-button>
    </el-input>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">仅时分：{{ value }}</p>

    <xt-mobile-date-picker
      :visible.sync="show"
      v-model="value"
      :columns="['hour', 'minute']"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: '14:30'
    }
  }
}
</script>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| visible / v-model:visible | 是否显示选择器，配合 `.sync` 使用 | Boolean | — | false |
| v-model | 选中值，格式根据 columns 动态变化 | String / Date | — | — |
| columns | 显示哪些列 | Array | `year` / `month` / `day` / `hour` / `minute` | 全部显示 |
| min-year | 最小年份 | Number | — | 当前年份 - 10 |
| max-year | 最大年份 | Number | — | 当前年份 + 10 |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 弹窗显隐变化，配合 `.sync` | Boolean |
| input | 值变化，配合 `v-model` | String |
| confirm | 点击确定按钮 | String（格式 `YYYY-MM-DD HH:mm`） |
| cancel | 点击取消按钮或遮罩层 | — |

## 特性

- **底部弹出**：固定定位 + 遮罩层，从底部滑入动画
- **5 列滚轮**：年 / 月 / 日 / 时 / 分，每列独立触摸滚动
- **惯性滚动**：根据滑动速度计算惯性距离，松手后自然减速
- **吸附对齐**：松手后自动吸附到最近的项，缓动动画
- **橡皮筋效果**：边界外拖拽回弹
- **联动**：年 / 月变化后自动调整当月天数（闰年、大小月）
- **渐变遮罩**：顶部 / 底部渐变模拟 3D 滚轮视觉效果
- **安全区域**：适配 iPhone 底部安全区域 `env(safe-area-inset-bottom)`
