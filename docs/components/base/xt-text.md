文本组件用于展示不同样式的文本内容。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtText type="primary">主要文本</XtText>
  <div style="width: 80px;"><XtText ellipsis>溢出隐藏文本溢出隐藏文本</XtText></div>
</template>
```
:::

## 属性说明
| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `type` | String | - | `primary`、`success`、`warning`、`danger` | 文本颜色类型 |
| `size` | String | base | `extra-large`、`large`、`medium`、`base`、`small`、`extra-small` | 字体大小 |
| `bold` | Boolean | false | - | 是否加粗 |
| `letterSpacing` | String / Number | - | - | 字间距 |
| `money` | Boolean | false | - | 是否启用金额格式化 |
| `value` | Number / String | - | - | 金额数值 |
| `currency` | String | CNY | `CNY`、`USD`、`EUR`、`JPY`、`GBP`、`AUD`、`CAD` | 货币类型 |
| `decimals` | Number | 2 | 0-10 | 小数位数 |
| `locale` | String | zh-CN | - | 语言环境 |
| `showSign` | Boolean | false | - | 是否显示正负号 |
| `prefix` | String | - | - | 自定义前缀 |
| `suffix` | String | - | - | 自定义后缀 |

## 示例

### 不同类型的文本
::: demo 不同类型的文本
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtText type="primary">主要文本</XtText>
    <XtText type="success">成功文本</XtText>
    <XtText type="warning">警告文本</XtText>
    <XtText type="danger">危险文本</XtText>
  </div>
</template>
```
:::

### 不同字体大小
::: demo 不同字体大小
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtText size="extra-large">特大号文本</XtText>
    <XtText size="large">大号文本</XtText>
    <XtText size="medium">中号文本</XtText>
    <XtText size="small">基准文本</XtText>
    <XtText size="mini">小号文本</XtText>
    <XtText size="extra-small">特小号文本</XtText>
  </div>
</template>
```
:::

### 加粗文本

::: demo 加粗文本
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtText bold>普通加粗文本</XtText>
    <XtText type="primary" bold>主要加粗文本</XtText>
  </div>
</template>
```
:::

### 字间距
::: demo 字间距
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtText>正常字间距</XtText>
    <XtText :letterSpacing="4">宽字距文本</XtText>
    <XtText letterSpacing="8px">更宽字距文本</XtText>
  </div>
</template>
```
:::

### 组合使用

::: demo 组合使用
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <XtText type="success" bold>成功加粗文本</XtText>
    <XtText type="danger" :letterSpacing="2">危险宽字距文本</XtText>
    <XtText type="warning" bold :letterSpacing="3">警告加粗宽字距</XtText>
  </div>
</template>
```
:::

### 段落文本

::: demo 段落文本
```vue
<template>
  <p>
    这是一段普通文本，其中包含
    <XtText type="primary">高亮的主要文本</XtText>
    和
    <XtText type="danger">危险提示文本</XtText>。
  </p>
</template>
```
:::

### 数据展示

::: demo 数据展示
```vue
<template>
  <div style="display: flex; align-items: baseline; gap: 8px;">
    <XtText type="primary" bold style="font-size: 24px;">¥1,234.56</XtText>
    <XtText type="warning" :letterSpacing="1">本月已节省¥520</XtText>
  </div>
</template>
```
:::

### 金额格式化
::: demo 金额格式化
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <span style="color: #909399; margin-right: 16px;">人民币：</span>
      <XtText money :value="123456.78" type="primary" bold></XtText>
    </div>
    <div>
      <span style="color: #909399; margin-right: 16px;">美元：</span>
      <XtText money :value="123456.78" currency="USD"></XtText>
    </div>
    <div>
      <span style="color: #909399; margin-right: 16px;">欧元：</span>
      <XtText money :value="123456.78" currency="EUR" locale="de-DE"></XtText>
    </div>
    <div>
      <span style="color: #909399; margin-right: 16px;">日元：</span>
      <XtText money :value="123456" currency="JPY" :decimals="0"></XtText>
    </div>
  </div>
</template>
```
:::

### 金额显示正负号
::: demo 金额显示正负号
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div>
      <span style="color: #909399; margin-right: 16px;">收入：</span>
      <XtText money :value="5000" showSign type="success"></XtText>
    </div>
    <div>
      <span style="color: #909399; margin-right: 16px;">支出：</span>
      <XtText money :value="-2300" showSign type="danger"></XtText>
    </div>
  </div>
</template>
```
:::

### 自定义前缀后缀

::: demo 自定义前缀后缀
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div>
      <XtText money :value="1000" prefix="合计：" suffix=" 元整" type="primary"></XtText>
    </div>
    <div>
      <XtText money :value="98.5" prefix="折扣价：" type="warning"></XtText>
    </div>
  </div>
</template>
```
:::

### 金额样式组合

::: demo 金额样式组合
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div style="font-size: 28px;">
      <XtText money :value="1234567.89" type="primary" bold></XtText>
    </div>
    <div>
      <span style="color: #909399;">今日收益：</span>
      <XtText money :value="1258.67" showSign type="success"></XtText>
    </div>
    <div>
      <span style="color: #909399;">累计支出：</span>
      <XtText money :value="-8920.30" showSign type="danger"></XtText>
    </div>
  </div>
</template>
```
:::
