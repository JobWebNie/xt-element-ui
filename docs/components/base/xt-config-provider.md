## XtConfigProvider 配置提供者

配置提供者组件用于全局配置主题和样式变量。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtConfigProvider :theme="theme" proxyElement="body">
    <div>
      <XtButton type="primary" @click="handleSwitchTheme">主题按钮</XtButton>
    </div>
  </XtConfigProvider>
</template>
<script>
  export default {
    data(){
      return {
        theme: 'white'
      }
    },
    methods: {
      handleSwitchTheme() {
        this.theme = this.theme == 'dark' ? 'white': 'dark'
      }
    }
  }
</script>
```
:::

## 属性说明
| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `primaryColor` | String | - | - | 自定义主题色 |
| `theme` | String | - | `dark`、`light` | 主题模式 |
| `size` | String | - | `small`、`medium`、`large` | 组件尺寸 |
| `injectBackground` | Boolean | - | - | 是否注入背景色到根元素 |
| `injectColor` | Boolean | - | - | 是否注入文字颜色到根元素 |
| `tag` | String | 'div' | - | 根元素标签 |
| `proxyElement` | HTMLElement / String | - | - | 代理元素 |
| `vars` | Object | - | - | 自定义 CSS 变量 |

## 示例

### 自定义主题色

::: demo 自定义主题色
```vue
<template>
  <XtConfigProvider :primaryColor="'#722ed1'">
    <div>
      <XtButton type="primary">紫色主题按钮</XtButton>
      <XtCard title="自定义主题卡片">
        <XtText type="primary">主题色文本</XtText>
      </XtCard>
    </div>
  </XtConfigProvider>
</template>
```
:::

### 亮色主题

::: demo 亮色主题
```vue
<template>
  <XtConfigProvider theme="light" injectBackground>
    <div style="min-height: 100px; padding: 16px;">
      <XtCard title="亮色模式卡片">
        <XtText type="primary">亮色主题内容</XtText>
      </XtCard>
      <XtButton type="primary">亮色主题按钮</XtButton>
    </div>
  </XtConfigProvider>
</template>
```
:::

### 自定义 CSS 变量

::: demo 自定义 CSS 变量
```vue
<template>
  <XtConfigProvider :vars="{
    '--xt-color-primary': '#52c41a',
    '--xt-color-success': '#13c2c2',
    '--xt-flex-box-gap': '20px'
  }">
    <XtFlexBox>
      <XtButton type="primary">绿色主题按钮</XtButton>
      <XtButton type="success">青色成功按钮</XtButton>
    </XtFlexBox>
  </XtConfigProvider>
</template>
```
:::

### 组合配置

::: demo 组合配置
```vue
<template>
  <XtConfigProvider 
    :primaryColor="'#1890ff'"
    size="medium"
  >
    <div style="padding: 16px;">
      <XtCard title="综合配置示例">
        <XtText type="primary">主题色: #1890ff</XtText>
        <XtText type="success">尺寸: medium</XtText>
      </XtCard>
      <XtFlexBox gap="16px" style="margin-top: 16px;">
        <XtButton type="primary">主要按钮</XtButton>
        <XtButton type="success">成功按钮</XtButton>
        <XtButton type="warning">警告按钮</XtButton>
      </XtFlexBox>
    </div>
  </XtConfigProvider>
</template>
```
:::

### 动态主题切换
::: demo 动态主题切换
```vue
<template>
  <XtConfigProvider 
    :primaryColor="primaryColor"
    :theme="currentTheme"
    injectBackground
  >
    <div style="min-height: 120px; padding: 16px;">
      <XtFlexBox content="space-between" style="margin-bottom: 16px;">
        <span>当前主题: {{ currentTheme }}</span>
        <XtFlexBox gap="8px">
          <XtButton 
            type="primary" 
            plain
            @click="switchTheme"
          >
            切换主题
          </XtButton>
          <XtButton 
            type="success" 
            plain
            @click="changeColor"
          >
            更换主题色
          </XtButton>
        </XtFlexBox>
      </XtFlexBox>
      <XtCard title="动态主题示例">
        <XtText type="primary">当前主题色: {{ primaryColor }}</XtText>
      </XtCard>
    </div>
  </XtConfigProvider>
</template>

<script>
export default {
  data() {
    return {
      primaryColor: '#1890ff',
      currentTheme: 'light',
      colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']
    }
  },
  methods: {
    switchTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    },
    changeColor() {
      const randomIndex = Math.floor(Math.random() * this.colors.length)
      this.primaryColor = this.colors[randomIndex]
    }
  }
}
</script>
```
:::

## 支持的 CSS 变量

| CSS 变量 | 说明 |
|----------|------|
| `--xt-color-primary` | 主色 |
| `--xt-color-success` | 成功色 |
| `--xt-color-warning` | 警告色 |
| `--xt-color-danger` | 危险色 |
| `--xt-color-info` | 信息色 |
| `--xt-text-color-primary` | 主要文字颜色 |
| `--xt-text-color-regular` | 常规文字颜色 |
| `--xt-text-color-secondary` | 次要文字颜色 |
| `--xt-bg-color` | 背景颜色 |
| `--xt-bg-color-page` | 页面背景颜色 |
| `--xt-border-color` | 边框颜色 |
| `--xt-flex-box-gap` | FlexBox 默认间距 |
