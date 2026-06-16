## XtInput 输入框组件

输入框组件用于收集用户输入的信息。

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
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | String / Number | - | 输入值（支持 v-model） |
| `placeholder` | String | '请输入内容' | 占位提示文本 |
| `color` | String | - | 自定义聚焦颜色 |

## 示例

### 基础输入框
::: demo 基础输入框
```vue
<template>
  <XtInput v-model="username" placeholder="请输入用户名"></XtInput>
</template>

<script>
export default {
  data() {
    return {
      username: ''
    }
  }
}
</script>
```
:::

### 自定义占位符

::: demo 自定义占位符
```vue
<template>
  <XtInput v-model="email" placeholder="请输入您的邮箱地址"></XtInput>
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
    <XtInput v-model="phone" placeholder="手机"></XtInput>
    <XtInput v-model="address" placeholder="地址"></XtInput>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      phone: '',
      address: ''
    }
  }
}
</script>
```
:::

### 监听输入事件

::: demo 监听输入事件
```vue
<template>
  <div>
    <XtInput :value="inputValue" placeholder="实时监听输入" @input="handleInput"></XtInput>
    <p style="margin-top: 12px;">输入长度: {{ inputValue.length }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    handleInput(value) {
      this.inputValue = value
    }
  }
}
</script>
```
:::
