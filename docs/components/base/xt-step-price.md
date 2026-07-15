用于配置阶梯式价格、数量区间等场景，支持区间自动校正、批量删除、自定义字段名等功能。

### 核心特性

- **区间自动校正**：保证区间连续且不重叠，自动处理左闭右闭逻辑
- **批量操作**：支持新增、删除档位，达到上限时自动禁用新增
- **自定义字段名**：允许传入自定义字段名映射（如 min/max/price 可改为 start/end/value）
- **单位与精度**：支持自定义货币单位和小数精度
- **括号逻辑**：自动处理括号显示（单条显示 `]`，多条显示 `)`）

### 安装与引入

#### 方式1：全量引入（推荐）

```vue
import Vue from 'vue'
import XtElementUI from 'xt-element-ui'

Vue.use(XtElementUI)
```

#### 方式2：单独引入（支持 Vue.use）

```vue
import Vue from 'vue'
import XtStepPrice from 'xt-element-ui/src/components/xt-step-price'

// 自动注册 XtStepPrice 和 XtStepPriceItem
Vue.use(XtStepPrice)
```

#### 方式3：手动注册组件

```vue
import Vue from 'vue'
import { XtStepPrice, XtStepPriceItem } from 'xt-element-ui/src/components/xt-step-price'

Vue.component(XtStepPrice.name, XtStepPrice)
Vue.component(XtStepPriceItem.name, XtStepPriceItem)
```

### 基本用法
::: demo
```vue
<template>
  <div style="width: 600px;">
    <XtStepPrice
      v-model="priceSteps"
      title="阶梯价格"
      unit="元"
      :precision="2"
      :limit="5"
      :step="10"
      tip="区间左闭右闭 [min, max]，最后一级为 [min, +∞)"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      priceSteps: [
        { min: 0, max: 100, price: 10 },
        { min: 100, max: 500, price: 9 },
        { min: 500, max: Infinity, price: 8 }
      ]
    }
  }
}
</script>
```
:::

### 自定义字段名

```vue
<template>
  <XtStepPrice
    v-model="customSteps"
    :field-keys="{ min: 'start', max: 'end', price: 'value' }"
    title="自定义字段名"
  />
</template>

<script>
export default {
  data() {
    return {
      customSteps: [
        { start: 0, end: 100, value: 10 },
        { start: 100, end: 500, value: 9 }
      ]
    }
  }
}
</script>
```

### 禁用状态

```vue
<XtStepPrice
  v-model="priceSteps"
  disabled
  title="禁用状态"
/>
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` / `v-model` | Array | `[]` | 阶梯数据数组，每个元素包含 `min`/`max`/`price` 字段 |
| `title` | String | `''` | 标题文本 |
| `unit` | String | `'元'` | 价格单位 |
| `precision` | Number | `2` | 价格小数精度 |
| `leftBracket` | String | `'['` | 左括号，传空字符串则不显示 |
| `rightBracket` | String | `null` | 右括号，默认自动逻辑（单条 `]`，多条 `)`）；传具体值强制使用 |
| `fieldKeys` | Object | `{ min: 'min', max: 'max', price: 'price' }` | 字段名映射，支持自定义字段名 |
| `limit` | Number | `0` | 阶梯数量上限，<=0 表示不限制 |
| `step` | Number | `10` | 阶梯增量，新增时自动填充下一级的 min 值 |
| `disabled` | Boolean | `false` | 是否禁用所有操作 |
| `allowNegative` | Boolean | `false` | 是否允许输入负数价格和下限 |
| `tip` | String | `'区间左闭右闭 [min, max]，最后一级为 [min, +∞)，保证连续且不重叠。'` | 底部提示文本 |
| `defaultFirst` | Boolean | `true` | 空数组时是否自动生成默认阶梯 |

### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `input` | 数据变化时触发 | 最新的阶梯数组 |
| `add` | 新增档位时触发 | 新增的档位数据 |
| `delete` | 删除档位时触发 | 删除的档位索引和数据 |
| `change` | 任一档位数据变化时触发 | 变化后的完整阶梯数组 |

### 插槽

| 插槽名 | 说明 |
|--------|------|
| `header` | 标题栏右侧自定义内容 |
| `tip` | 底部提示区域自定义内容 |

### XtStepPriceItem 子组件（单独使用）

```vue
<XtStepPriceItem
  v-model="item"
  :index="0"
  :is-first="true"
  :is-last="true"
  :items-length="1"
  :unit="'元'"
  :precision="2"
  @input="onItemInput"
  @delete="onDelete"
/>
```

### 注意事项

1. **区间逻辑**：采用左闭右闭 `[min, max]`，最后一级自动处理为 `[min, +∞)`
2. **空值处理**：当 `v-model` 为空数组时，会自动生成默认阶梯（可通过 `defaultFirst=false` 关闭）
3. **精度控制**：所有输入值会自动按 `precision` 四舍五入
4. **性能优化**：当阶梯数量较多时，建议设置 `limit` 限制最大数量
5. **字段名映射**：`fieldKeys` 必须与传入的 `value` 字段名完全匹配