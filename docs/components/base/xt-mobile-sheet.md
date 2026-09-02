# XtMobileSheet 移动端弹出面板

移动端底部弹出面板容器，提供遮罩层 + 滑入动画 + 底部定位。

作为通用弹层壳，配合 `XtMobilePicker`、`XtMobileDatePicker` 等面板组件使用。

## 基础用法

::: demo 基础用法
```vue
<template>
  <div>
    <el-button type="primary" @click="show = true">弹出面板</el-button>

    <xt-mobile-sheet :visible.sync="show">
      <div style="padding: 20px; text-align: center;">
        <p>这是一个自定义面板内容</p>
        <el-button @click="show = false">关闭</el-button>
      </div>
    </xt-mobile-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  }
}
</script>
```
:::

## 配合 XtMobilePicker 使用

::: demo 配合选择器面板
```vue
<template>
  <div>
    <el-button @click="show = true">选择城市</el-button>
    <p style="margin-top: 12px; color: #999; font-size: 13px;">当前值：{{ value }}</p>

    <xt-mobile-sheet :visible.sync="show">
      <xt-mobile-picker
        v-model="value"
        title="请选择城市"
        :options="options"
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
      value: '',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' }
      ]
    }
  }
}
</script>
```
:::

## 无遮罩模式

::: demo 无遮罩模式
```vue
<template>
  <div>
    <el-button @click="show = true">弹出面板（无遮罩）</el-button>

    <xt-mobile-sheet :visible.sync="show" :modal="false">
      <div style="padding: 20px; text-align: center;">
        <p>无遮罩层模式</p>
        <el-button @click="show = false">关闭</el-button>
      </div>
    </xt-mobile-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  }
}
</script>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| visible / v-model:visible | 是否显示面板，配合 `.sync` 使用 | Boolean | — | false |
| modal | 是否显示遮罩层 | Boolean | — | true |
| close-on-click-modal | 点击遮罩层是否关闭 | Boolean | — | true |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| close | 关闭面板时触发（遮罩点击或外部控制） | — |
| update:visible | 显隐变化，配合 `.sync` | Boolean |

## 特性

- **底部弹出**：固定定位 + 滑入动画，cubic-bezier 缓动
- **遮罩层**：半透明黑色遮罩，可关闭
- **滚动锁定**：遮罩层阻止 touchmove 穿透
- **安全区域**：适配 iPhone 底部安全区域 `env(safe-area-inset-bottom)`
- **默认插槽**：接受任意面板内容
