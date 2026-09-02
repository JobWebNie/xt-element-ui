# XtMobileDatePicker 移动端日期时间选择器

移动端日期时间选择面板，支持年月日时分滚轮选择。

组件本身为纯面板，不包含弹层遮罩。需配合 `XtMobileSheet` 使用底部弹出效果。

## 基础用法

::: demo 基础用法
```vue
<template>
  <div>
    <el-input :value="value" placeholder="请选择日期时间" readonly style="width: 240px" @click.native="show = true">
      <el-button slot="append" icon="el-icon-date" @click="show = true"></el-button>
    </el-input>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">当前值：{{ value }}</p>

    <xt-mobile-sheet :visible.sync="show">
      <xt-mobile-date-picker
        v-model="value"
        @confirm="show = false"
        @cancel="show = false"
      />
    </xt-mobile-sheet>
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

## 自定义日期范围

::: demo 自定义日期范围
```vue
<template>
  <div>
    <el-input :value="value" placeholder="请选择日期时间" readonly style="width: 240px" @click.native="show = true">
      <el-button slot="append" icon="el-icon-date" @click="show = true"></el-button>
    </el-input>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">日期范围：2020-01-01 ~ 2030-12-31</p>

    <xt-mobile-sheet :visible.sync="show">
      <xt-mobile-date-picker
        v-model="value"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="show = false"
        @cancel="show = false"
      />
    </xt-mobile-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: '2026-08-17 14:30',
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2030, 11, 31)
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

    <xt-mobile-sheet :visible.sync="show">
      <xt-mobile-date-picker
        v-model="value"
        :columns="['year', 'month', 'day']"
        @confirm="show = false"
        @cancel="show = false"
      />
    </xt-mobile-sheet>
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

    <xt-mobile-sheet :visible.sync="show">
      <xt-mobile-date-picker
        v-model="value"
        :columns="['hour', 'minute']"
        :minuteStep="minuteStep"
        @confirm="show = false"
        @cancel="show = false"
      />
    </xt-mobile-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: '14:30',
      minuteStep: 30
    }
  }
}
</script>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| v-model | 选中值，格式根据 columns 动态变化 | String / Date | — | — |
| columns | 显示哪些列 | Array | `year` / `month` / `day` / `hour` / `minute` | 全部显示 |
| min-date | 最小可选日期 | Date | — | 当前日期 - 10 年 |
| max-date | 最大可选日期 | Date | — | 当前日期 + 10 年 |
| min-hour | 最小小时（与 minDate 取交集） | Number | — | 0 |
| max-hour | 最大小时（与 maxDate 取交集） | Number | — | 23 |
| minute-step | 分钟间隔 | Number | — | 1 |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| input | 值变化，配合 `v-model` | String |
| change | 值变化 | 同 input |
| confirm | 点击确定按钮 | String（格式 `YYYY-MM-DD HH:mm`） |
| cancel | 点击取消按钮 | — |

## 特性

- **纯面板组件**：不含弹层遮罩，配合 `XtMobileSheet` 实现底部弹出
- **5 列滚轮**：年 / 月 / 日 / 时 / 分，每列独立触摸滚动
- **惯性滚动**：根据滑动速度计算惯性距离，松手后自然减速
- **吸附对齐**：松手后自动吸附到最近的项，缓动动画
- **橡皮筋效果**：边界外拖拽回弹
- **联动**：年 / 月变化后自动调整当月天数（闰年、大小月）
- **渐变遮罩**：顶部 / 底部渐变模拟 3D 滚轮视觉效果
- **安全区域**：适配 iPhone 底部安全区域 `env(safe-area-inset-bottom)`
