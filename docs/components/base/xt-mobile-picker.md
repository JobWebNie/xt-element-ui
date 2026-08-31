# XtMobilePicker 移动端选项选择器

底部弹出的移动端选项选择器，支持单选滚轮（替代 select / radio-group）和多选列表（替代 checkbox-group）。

## 单选模式 - 替代 select / radio-group

::: demo 基础单选用法
```vue
<template>
  <div>
    <el-input :value="displayText" placeholder="请选择" readonly style="width: 240px" @click.native="show = true">
      <el-button slot="append" icon="el-icon-arrow-down" @click="show = true"></el-button>
    </el-input>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">当前值：{{ value }}</p>

    <xt-mobile-picker
      :visible.sync="show"
      v-model="value"
      title="请选择城市"
      :options="options"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: 'shenzhen',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '成都', value: 'chengdu' },
        { label: '武汉', value: 'wuhan' }
      ]
    }
  },
  computed: {
    displayText() {
      const item = this.options.find(o => o.value === this.value)
      return item ? item.label : ''
    }
  },
  methods: {
    onConfirm(val) {
      this.$message.success('已选择：' + val)
    }
  }
}
</script>
```
:::

## 多选模式 - 替代 checkbox-group

::: demo 多选用法
```vue
<template>
  <div>
    <el-button type="primary" @click="show = true">选择标签</el-button>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">已选：{{ value.length }} 项 - {{ value.join(', ') }}</p>

    <xt-mobile-picker
      :visible.sync="show"
      v-model="value"
      title="请选择标签（多选）"
      mode="multiple"
      :options="options"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: ['js', 'css'],
      options: [
        { label: 'JavaScript', value: 'js' },
        { label: 'TypeScript', value: 'ts' },
        { label: 'CSS', value: 'css' },
        { label: 'HTML', value: 'html' },
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Angular', value: 'angular' },
        { label: 'Node.js', value: 'node' }
      ]
    }
  },
  methods: {
    onConfirm(val) {
      this.$message.success('已选择：' + val.join(', '))
    }
  }
}
</script>
```
:::

## 禁用选项

::: demo 部分选项禁用
```vue
<template>
  <div>
    <el-button @click="show = true">选择渠道</el-button>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">当前值：{{ value }}</p>

    <xt-mobile-picker
      :visible.sync="show"
      v-model="value"
      title="请选择渠道"
      :options="options"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: 'wechat',
      options: [
        { label: '微信', value: 'wechat' },
        { label: '支付宝', value: 'alipay' },
        { label: '银行卡（维护中）', value: 'bank', disabled: true },
        { label: '余额', value: 'balance' }
      ]
    }
  }
}
</script>
```
:::

## 自定义字段名

::: demo 自定义 fieldKeys
```vue
<template>
  <div>
    <el-button @click="show = true">选择部门</el-button>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">当前值：{{ value }}</p>

    <xt-mobile-picker
      :visible.sync="show"
      v-model="value"
      title="请选择部门"
      :options="options"
      :field-keys="fieldKeys"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      value: 2,
      options: [
        { name: '技术部', id: 1 },
        { name: '产品部', id: 2 },
        { name: '运营部', id: 3 },
        { name: '市场部', id: 4 }
      ],
      fieldKeys: { label: 'name', value: 'id', disabled: 'disabled' }
    }
  }
}
</script>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| visible / 弹窗显/隐 | 是否显示选择器，配合 `.sync` 使用 | Boolean | — | false |
| v-model | 选中值，单选为基本类型，多选为数组 | String / Number / Array | — | — |
| mode | 选择模式 | String | `single` / `multiple` | single |
| options | 选项数组 | Array | — | [] |
| title | 顶部标题 | String | — | 请选择 |
| confirm-text | 确认按钮文字 | String | — | 确定 |
| cancel-text | 取消按钮文字 | String | — | 取消 |
| field-keys | 自定义选项字段名 | Object | — | `{ label: 'label', value: 'value', disabled: 'disabled' }` |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 弹窗显隐变化，配合 `.sync` | Boolean |
| input | 值变化，配合 `v-model` | 单选为 String/Number，多选为 Array |
| change | 值变化 | 同 input |
| confirm | 点击确定按钮 | 同 input |
| cancel | 点击取消按钮或遮罩层 | — |

## 选项数据结构

```js
// 默认字段名
{
  label: '显示文字',   // fieldKeys.label
  value: '选项值',     // fieldKeys.value
  disabled: false       // fieldKeys.disabled，是否禁用
}
```

## 特性

- **单选滚轮**：触摸滑动 + 惯性滚动 + 吸附对齐，体验与原生 Picker 一致
- **多选列表**：带勾选标记的列表，支持多选切换
- **禁用选项**：支持单选和多选模式下禁用特定选项
- **自定义字段**：通过 `fieldKeys` 灵活映射数据字段
- **安全区域**：适配 iPhone 底部安全区域
