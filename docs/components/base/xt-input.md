## XtInput 输入框组件

输入框组件用于收集用户输入的信息，支持多种输入场景和格式校验。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtInput v-model="inputValue" placeholder="请输入内容"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `value` | String / Number | - | - | 输入值（支持 v-model） |
| `placeholder` | String | '请输入内容' | - | 占位提示文本 |
| `type` | String | 'text' | 见下表 | 输入类型 |
| `size` | String | - | 'small'、'medium'、'large' | 输入框尺寸 |
| `disabled` | Boolean | false | - | 是否禁用 |
| `readonly` | Boolean | false | - | 是否只读 |
| `color` | String | - | - | 自定义聚焦颜色 |
| `precision` | Number | 2 | 0-10 | 小数位数（数字类型） |
| `min` | Number | undefined | - | 最小值（数字类型） |
| `max` | Number | undefined | - | 最大值（数字类型） |
| `allowNegative` | Boolean | false | - | 是否允许负数（数字类型） |
| `thousandSeparator` | Boolean | false | - | 是否显示千分位分隔符 |
| `maxlength` | Number | undefined | - | 最大输入长度 |
| `showWordLimit` | Boolean | false | - | 是否显示字数统计 |
| `prefixIcon` | String | - | - | 前缀图标 |
| `suffixIcon` | String | - | - | 后缀图标 |
| `trim` | Boolean | false | - | 是否自动去除首尾空格 |

## 支持的输入类型

| 类型 | 说明 | 特性 |
|------|------|------|
| `text` | 普通文本 | 默认类型，支持所有字符 |
| `number` | 数字输入 | 支持整数和小数，可配置精度 |
| `integer` | 整数输入 | 仅允许整数，自动过滤小数 |
| `decimal` | 小数输入 | 支持小数，精度可配置 |
| `money` | 金额输入 | 支持小数，默认2位精度，适合金额场景 |
| `phone` | 手机号输入 | 自动过滤非数字，校验手机号格式 |
| `email` | 邮箱输入 | 实时校验邮箱格式，错误时标红 |
| `idcard` | 身份证输入 | 自动过滤非法字符，校验身份证格式 |
| `password` | 密码输入 | 密码隐藏显示 |
| `textarea` | 多行文本 | 多行输入框 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `input` | `value` | 输入值变化时触发 |
| `change` | `value` | 输入框失去焦点且值变化时触发 |
| `focus` | `event` | 输入框获得焦点时触发 |
| `blur` | `value, event` | 输入框失去焦点时触发 |
| `clear` | - | 点击清除按钮时触发 |

## 示例

### 整数输入

::: demo 整数输入
```vue
<template>
  <XtInput v-model="count" type="integer" placeholder="请输入整数"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      count: ''
    }
  }
}
</script>
```
:::

### 小数输入（自定义精度）

::: demo 小数输入
```vue
<template>
  <XtInput v-model="price" type="decimal" :precision="4" placeholder="最多4位小数"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      price: ''
    }
  }
}
</script>
```
:::

### 金额输入（带千分位）

::: demo 金额输入
```vue
<template>
  <XtInput v-model="amount" type="money" thousandSeparator placeholder="请输入金额"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      amount: ''
    }
  }
}
</script>
```
:::

### 数字输入（带范围限制）

::: demo 数字输入范围限制
```vue
<template>
  <XtInput v-model="score" type="number" :min="0" :max="100" placeholder="0-100"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      score: ''
    }
  }
}
</script>
```
:::

### 手机号输入

::: demo 手机号输入
```vue
<template>
  <XtInput v-model="phone" type="phone" placeholder="请输入手机号"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      phone: ''
    }
  }
}
</script>
```
:::

### 邮箱输入（格式校验）

::: demo 邮箱输入
```vue
<template>
  <XtInput v-model="email" type="email" placeholder="请输入邮箱"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  }
}
</script>
```
:::

### 身份证输入

::: demo 身份证输入
```vue
<template>
  <XtInput v-model="idcard" type="idcard" placeholder="请输入身份证号"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      idcard: ''
    }
  }
}
</script>
```
:::

### 密码输入

::: demo 密码输入
```vue
<template>
  <XtInput v-model="password" type="password" placeholder="请输入密码"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      password: ''
    }
  }
}
</script>
```
:::

### 多行文本

::: demo 多行文本
```vue
<template>
  <XtInput v-model="content" type="textarea" :maxlength="200" showWordLimit placeholder="请输入内容"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      content: ''
    }
  }
}
</script>
```
:::

### 自定义聚焦颜色

::: demo 自定义聚焦颜色
```vue
<template>
  <div style="display: flex; gap: 16px;">
    <XtInput v-model="input1" placeholder="默认颜色"></XtInput>
    <XtInput v-model="input2" placeholder="绿色主题" color="#52c41a"></XtInput>
    <XtInput v-model="input3" placeholder="橙色主题" color="#faad14"></XtInput>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input1: '',
      input2: '',
      input3: ''
    }
  }
}
</script>
```
:::

### 输入框组

::: demo 输入框组
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <XtInput v-model="name" placeholder="姓名"></XtInput>
    <XtInput v-model="phone" type="phone" placeholder="手机"></XtInput>
    <XtInput v-model="email" type="email" placeholder="邮箱"></XtInput>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      phone: '',
      email: ''
    }
  }
}
</script>
```
:::

## 注意事项

1. **数字类型输入**：`type="number"`、`type="integer"`、`type="decimal"`、`type="money"` 返回的是 Number 类型，空值时返回 undefined
2. **小数精度**：`precision` 属性控制小数位数，blur 时自动四舍五入
3. **千分位显示**：`thousandSeparator` 仅影响显示，实际绑定的值不包含千分位分隔符
4. **负数控制**：`allowNegative` 默认 false，数字类型输入不允许负数
5. **范围限制**：`min` 和 `max` 在输入时自动限制，超出范围自动修正