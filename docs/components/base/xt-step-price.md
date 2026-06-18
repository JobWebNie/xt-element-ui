## XtStepPrice 阶梯价格组件

用于配置「根据数量区间 → 单价」阶梯型价格配置。

- 最小数量从 `0` 开始，最后一档为 `[min, +∞)`
- 支持动态增减阶梯；删除后前后区间自动对接到一起保证连续性
- 提供 `XtStepPriceItem` 子组件，方便自定义场景下单独使用

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtStepPrice v-model="items" title="阶梯价格" />
  <XtText size="small" style="margin-top: 12px;">当前值：{{ JSON.stringify(items) }}</XtText>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { min: 0, max: 100, price: 10 },
        { min: 100, max: 500, price: 8 },
        { min: 500, max: null, price: 5 }
      ]
    }
  }
}
</script>
```
:::

## 自定义单位和小数位

::: demo 自定义单位和小数位
```vue
<template>
  <XtStepPrice
    v-model="items"
    title="批发阶梯价（美元，保留 4 位小数）"
    unit="美元"
    :precision="4"
  />
</template>

<script>
export default {
  data() {
    return {
      items: [
        { min: 0, max: 100, price: 1.25 },
        { min: 100, max: null, price: 0.85 }
      ]
    }
  }
}
</script>
```
:::

## 只读态

::: demo 只读态
```vue
<template>
  <XtStepPrice
    v-model="items"
    title="阶梯价格（只读）"
    disabled
  />
</template>

<script>
export default {
  data() {
    return {
      items: [
        { min: 0, max: 100, price: 10 },
        { min: 100, max: 500, price: 8 },
        { min: 500, max: null, price: 5 }
      ]
    }
  }
}
</script>
```
:::

## 自定义括号与字段名

::: demo 自定义括号与字段名
```vue
<template>
  <XtStepPrice
    v-model="items"
    title="自定义括号"
    left-bracket="("
    right-bracket="]"
  />
  <XtText size="small" style="margin-top: 12px;">输出：{{ JSON.stringify(items) }}</XtText>

  <XtStepPrice
    v-model="backendItems"
    title="适配后端字段结构"
    :field-keys="{ min: 'low', max: 'high', price: 'unitPrice' }"
    style="margin-top: 24px;"
  />
  <XtText size="small" style="margin-top: 12px;">后端字段：{{ JSON.stringify(backendItems) }}</XtText>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { min: 0, max: 100, price: 10 },
        { min: 100, max: null, price: 5 }
      ],
      backendItems: [
        { low: 0, high: 200, unitPrice: 15 },
        { low: 200, high: null, unitPrice: 8 }
      ]
    }
  }
}
</script>
```
:::

## 限制阶梯数量（limit）

::: demo 限制阶梯数量
```vue
<template>
  <XtStepPrice v-model="items" title="最多 3 档" :limit="3" />
  <XtText size="small" style="margin-top: 12px;">输出：{{ JSON.stringify(items) }}</XtText>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { min: 0, max: 100, price: 10 }
      ]
    }
  }
}
</script>
```
:::

## 使用 XtStepPriceItem 自定义布局

::: demo 使用 XtStepPriceItem 自定义布局
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtStepPriceItem
      v-for="(item, idx) in items"
      :key="idx"
      :value="item"
      :index="idx"
      :is-first="idx === 0"
      :is-last="idx === items.length - 1"
      :items-length="items.length"
      :min-locked="idx !== 0"
      @input="(val) => onInput(val, idx)"
      @delete="onDelete"
    />
    <el-button size="small" type="primary" plain icon="el-icon-plus" @click="onAdd">新增</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { min: 0, max: 100, price: 10 },
        { min: 100, max: null, price: 6 }
      ]
    }
  },
  methods: {
    onInput(val, idx) {
      this.$set(this.items, idx, val)
    },
    onAdd() {
      const last = this.items[this.items.length - 1]
      if (!last) {
        this.items.push({ min: 0, max: null, price: 0 })
        return
      }
      const cur = { min: last.min, max: last.min + 1, price: last.price }
      last.min = cur.max
      this.items.splice(this.items.length - 1, 0, cur)
    },
    onDelete(idx) {
      if (this.items.length <= 1) return
      this.items.splice(idx, 1)
    }
  }
}
</script>
```
:::

## 属性说明

### XtStepPrice

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `Array<{min, max, price}>` | `[{min:0, max:null, price:0}]` | 阶梯数组，`v-model` 绑定，支持 `.sync` 风格亦可 |
| `title` | String | `''` | 标题 |
| `unit` | String | `'元'` | 价格单位 |
| `precision` | Number | `2` | 价格小数位（失焦后自动格式化） |
| `left-bracket` | String | `'['` | 左括号显示字符，传空字符串则不显示 |
| `right-bracket` | String | `null` | 右括号显示字符；传 `null` 走内置规则（仅 1 条时为 `]`，多条为 `)`），传具体值则强制显示 |
| `field-keys` | `{min, max, price}` | `{min:'min', max:'max', price:'price'}` | 自定义字段名映射 |
| `limit` | Number | `0` | 阶梯数量上限；`<= 0` 表示不限制；达到上限时隐藏新增按钮并提示 |
| `disabled` | Boolean | `false` | 是否禁用/只读 |
| `tip` | String | 中文提示文案 | 底部提示文案 |
| `default-first` | Boolean | `true` | 传入空数组时是否自动生成首条 `[0, +∞)` |

### XtStepPriceItem

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `{min, max, price}` | `{min: 0, max: null, price: 0}` | 单条阶梯的值 |
| `index` | Number | `0` | 索引，用于事件回调 |
| `is-first` | Boolean | `false` | 是否首条（首条 `min` 固定为 `0` 且锁定不可改） |
| `is-last` | Boolean | `false` | 是否末条（末条 `max` 显示为 `+∞`） |
| `items-length` | Number | `1` | 当前阶梯总数，用于决定是否可删除及右括号默认策略 |
| `min-locked` | Boolean | `false` | 是否锁定 `min` 输入框 |
| `unit` | String | `'元'` | 价格单位 |
| `precision` | Number | `2` | 价格小数位 |
| `left-bracket` | String | `'['` | 左括号显示字符 |
| `right-bracket` | String | `null` | 右括号；为 `null` 走默认逻辑（仅 1 条→ `]`，多条→ `)`） |
| `field-keys` | `{min, max, price}` | `{min:'min', max:'max', price:'price'}` | 自定义字段名映射 |
| `removable` | Boolean | `true` | 是否可删除（`removable=true` 且 `items-length>1` 时才显示删除按钮） |
| `disabled` | Boolean | `false` | 是否禁用 |

## 事件

### XtStepPrice

| 事件 | 说明 | 参数 |
|------|------|------|
| `input` | 值变化（v-model 自动更新） | 最新的 items 数组 |
| `change` | 任何引起值变化的动作（新增/删除/修改） | 最新的 items 数组 |

### XtStepPriceItem

| 事件 | 说明 | 参数 |
|------|------|------|
| `input` | 该条值变化 | `{min, max, price}` |
| `change` | 该条值变化 | `{min, max, price}, index` |
| `min-change` | min 失焦修改 | `min, index` |
| `max-change` | max 失焦修改 | `max, index` |
| `delete` | 点击删除 | `index` |

## 插槽

### XtStepPrice

| 插槽 | 说明 |
|------|------|
| `header` | 头部右侧自定义内容 |
| `tip` | 底部提示自定义内容 |

## 注意事项

1. **首条 `min` 固定为 `0` 且锁定不可编辑，保证最小数量从 0 开始。
2. **末条 `max` 固定为 `+∞`，保证任何数量都能匹配到一个区间。
3. **连续性保证**：任意两条相邻阶梯，后一条的 `min` 始终等于前一条的 `max`；删除中间阶梯后，前后自动对接到一起。
4. 容器内的 `XtStepPriceItem` 的 `min` 输入框对非首条默认锁定，避免用户误操作破坏连续性；如需自由编辑，可单独使用 `XtStepPriceItem` 自行管理数据。
5. `price` 输入值小于 `0` 时自动修正为 `0`。
