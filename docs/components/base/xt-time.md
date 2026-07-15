集三种模式于一身的时间组件：当前时间实时显示、目标时间倒计时、日期文本格式化展示。

## 基本用法

### 三种显示模式

::: demo 三种显示模式
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>当前时间：<XtTime type="now" /></div>
    <div>距 2026-12-31：<XtTime type="countdown" target-time="2026-12-31 23:59:59" /></div>
    <div>创建时间：<XtTime type="text" :value="1704067200000" /></div>
  </div>
</template>
```
:::

## 属性说明

### 通用属性

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `type` | String | `now` | `now`、`countdown`、`text` | 显示模式 |
| `format` | String | `YYYY-MM-DD HH:mm:ss` | - | `now` / `text` 模式下的日期格式 |
| `size` | String | base | `extra-large`、`large`、`medium`、`base`、`small`、`extra-small` | 字体大小 |
| `type-color` | String | - | `primary`、`success`、`warning`、`danger` | 颜色语义 |
| `bold` | Boolean | false | - | 是否加粗 |
| `prefix` | String | - | - | 前缀文本 |
| `suffix` | String | - | - | 后缀文本 |
| `empty-text` | String | `-` | - | 空值/无效值时展示的占位文本 |
| `hide-empty` | Boolean | false | - | 值为空时是否不渲染内容 |
| `interval` | Number | `1000` | `>= 100` | 刷新间隔（毫秒），仅 `now` / `countdown` 生效 |

### text 模式专属属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | String / Number / Date | - | 待格式化的日期值，支持时间戳（10 位秒或 13 位毫秒）、Date 对象、`2024-01-01 12:00:00` 等字符串 |

### countdown 模式专属属性

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `target-time` | String / Number / Date | - | - | 目标时间，取值同 `value` |
| `countdown-format` | String | `DHMS` | `DHMS`、`HMS`、`MS`、`SEC` | 倒计时显示格式 |
| `finished-text` | String | `已结束` | - | 倒计时结束后显示的文本 |

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `finish` | 倒计时结束触发（仅 `countdown` 模式） | - |
| `click` | 点击组件触发 | `(event: MouseEvent)` |

## 插槽

| 插槽 | 说明 |
|------|------|
| `prefix` | 前缀插槽，优先级高于 `prefix` 属性 |
| `suffix` | 后缀插槽，优先级高于 `suffix` 属性 |
| `finished` | 倒计时结束态自定义内容（仅 `countdown` 模式） |
| `default` | 自定义整体内容，覆盖默认渲染 |

## 示例

### 当前时间（now 模式）

::: demo 当前时间
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtTime type="now" />
    <XtTime type="now" format="YYYY年MM月DD日 HH时mm分ss秒" type-color="primary" bold />
    <XtTime type="now" format="HH:mm:ss" size="extra-large" type-color="danger" />
  </div>
</template>
```
:::

### 日期文本（text 模式）

`value` 支持时间戳、字符串、Date 对象，自动识别并格式化：

::: demo 日期文本
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtTime type="text" value="2024-01-01 12:00:00" />
    <XtTime type="text" :value="1704067200" format="YYYY-MM-DD" />
    <XtTime type="text" :value="new Date('2024-06-15')" format="YYYY/MM/DD" />
    <XtTime type="text" value="无效值" />
    <XtTime type="text" value="2024-01-01" prefix="创建于 " type-color="success" />
  </div>
</template>
```
:::

### 倒计时（countdown 模式）

::: demo 倒计时
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtTime type="countdown" target-time="2026-12-31 23:59:59" />
    <XtTime type="countdown" target-time="2026-12-31 23:59:59" countdown-format="HMS" type-color="primary" />
    <XtTime type="countdown" target-time="2026-12-31 23:59:59" countdown-format="MS" />
    <XtTime type="countdown" target-time="2026-12-31 23:59:59" countdown-format="SEC" suffix="后结束" />
    <XtTime
      type="countdown"
      :target-time="Date.now() + 5000"
      @finish="onFinish"
    />
  </div>
</template>

<script>
export default {
  methods: {
    onFinish() {
      this.$message && this.$message('倒计时结束！')
    }
  }
}
</script>
```
:::

### 自定义结束态（finished 插槽）

::: demo 自定义结束态
```vue
<template>
  <XtTime type="countdown" :target-time="Date.now() + 3000">
    <template #finished>
      <span style="color: #67c23a;">🎉 活动已开始，欢迎参加</span>
    </template>
  </XtTime>
</template>
```
:::

### 前缀 / 后缀

::: demo 前缀后缀
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtTime type="now" prefix="当前时间：" />
    <XtTime type="countdown" target-time="2026-12-31 23:59:59" suffix=" 后截止" type-color="warning" />
    <XtTime type="text" value="2024-01-01 08:00:00" prefix="入职日期：" suffix="（周一）" />
  </div>
</template>
```
:::

## 注意事项

- `value` / `target-time` 对**纯数字时间戳**自动识别：10 位数字视作秒级时间戳，13 位数字视作毫秒级时间戳。
- `countdown` 模式下组件销毁、切出 `keep-alive` 缓存时会自动清理定时器，避免内存泄漏。
- `type` 从 `now`/`countdown` 切换为 `text`（或反向），组件会自动重置定时器。
- 如需不同的时区展示，可在父组件中将 `value` 先转换为本地时区 Date 对象再传入。
