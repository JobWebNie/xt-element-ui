## XtTabs 标签页组件

标签页组件，用于切换不同内容区域。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtTabs v-model="activeName">
    <XtTabPane label="用户管理" name="first">用户管理内容</XtTabPane>
    <XtTabPane label="配置管理" name="second">配置管理内容</XtTabPane>
    <XtTabPane label="角色管理" name="third">角色管理内容</XtTabPane>
  </XtTabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `value` / `v-model` | String | - | - | 绑定值，选中标签的 name |
| `type` | String | `card` | `card`、`border-card` | 标签页类型 |
| `tabPosition` | String | `top` | `top`、`right`、`bottom`、`left` | 标签位置 |
| `closable` | Boolean | `false` | - | 是否可关闭 |
| `addable` | Boolean | `false` | - | 是否可新增 |
| `editable` | Boolean | `false` | - | 是否可编辑（新增+关闭） |

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `tab-click` | 点击标签时触发 | `tab` |
| `tab-remove` | 移除标签时触发 | `name` |
| `tab-add` | 添加标签时触发 | - |
| `edit` | 点击新增或删除按钮时触发 | `(targetName, action)` |

## XtTabPane 子组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | String | - | 标签页标题 |
| `name` | String / Number | - | 标签页名称，对应 value |
| `disabled` | Boolean | `false` | 是否禁用 |
| `closable` | Boolean | `true` | 是否可关闭 |

## 示例

### 不同类型

::: demo 不同类型
```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <XtTabs v-model="activeName">
      <XtTabPane label="卡片式" name="first">卡片式标签页</XtTabPane>
      <XtTabPane label="配置管理" name="second">配置管理内容</XtTabPane>
    </XtTabs>
    <XtTabs type="border-card" v-model="activeName">
      <XtTabPane label="边框卡片" name="first">边框卡片式标签页</XtTabPane>
      <XtTabPane label="配置管理" name="second">配置管理内容</XtTabPane>
    </XtTabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
```
:::

### 标签位置

::: demo 标签位置
```vue
<template>
  <XtTabs v-model="activeName" tab-position="left">
    <XtTabPane label="用户管理" name="first">用户管理内容</XtTabPane>
    <XtTabPane label="配置管理" name="second">配置管理内容</XtTabPane>
    <XtTabPane label="角色管理" name="third">角色管理内容</XtTabPane>
  </XtTabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
```
:::

### 可关闭

::: demo 可关闭
```vue
<template>
  <XtTabs v-model="activeName" closable @tab-remove="handleRemove">
    <XtTabPane label="用户管理" name="first">用户管理内容</XtTabPane>
    <XtTabPane label="配置管理" name="second">配置管理内容</XtTabPane>
    <XtTabPane label="角色管理" name="third">角色管理内容</XtTabPane>
  </XtTabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleRemove(name) {
      console.log('移除标签:', name)
    }
  }
}
</script>
```
:::

### 可编辑

::: demo 可编辑
```vue
<template>
  <XtTabs v-model="activeName" editable @edit="handleEdit">
    <XtTabPane label="用户管理" name="first">用户管理内容</XtTabPane>
    <XtTabPane label="配置管理" name="second">配置管理内容</XtTabPane>
  </XtTabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleEdit(targetName, action) {
      console.log('操作:', action, '目标:', targetName)
    }
  }
}
</script>
```
:::

### 禁用标签

::: demo 禁用标签
```vue
<template>
  <XtTabs v-model="activeName">
    <XtTabPane label="用户管理" name="first">用户管理内容</XtTabPane>
    <XtTabPane label="配置管理" name="second" disabled>配置管理内容</XtTabPane>
    <XtTabPane label="角色管理" name="third">角色管理内容</XtTabPane>
  </XtTabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
```
:::

## 注意事项

- 每个 `XtTabPane` 必须设置 `name` 属性
- `v-model` 绑定的值必须与某个 `XtTabPane` 的 `name` 匹配