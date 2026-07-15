下拉选择树组件，基于 ElementUI Tree 封装，支持单选、多选、懒加载等功能。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtSelectTree v-model="selectedValue" :data="treeData" />
</template>

<script>
export default {
  data() {
    return {
      selectedValue: '',
      treeData: [
        {
          label: '一级菜单',
          value: 1,
          children: [
            { label: '二级菜单1', value: 11 },
            { label: '二级菜单2', value: 12 }
          ]
        },
        { label: '二级菜单', value: 2 }
      ]
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` / `v-model` | String / Number / Array | - | 选中值，多选时为数组 |
| `data` | Array | `[]` | 树数据 |
| `props` | Object | `{ value: 'value', label: 'label', children: 'children' }` | 数据属性映射 |
| `multiple` | Boolean | `false` | 是否多选 |
| `filterable` | Boolean | `true` | 是否可搜索 |
| `clearable` | Boolean | `false` | 是否可清空 |
| `disabled` | Boolean | `false` | 是否禁用 |
| `checkStrictly` | Boolean | `false` | 是否严格父子节点选择 |
| `defaultExpandAll` | Boolean | `false` | 是否默认展开所有节点 |
| `lazy` | Boolean | `false` | 是否懒加载 |
| `load` | Function | - | 懒加载函数 |
| `placement` | String | `bottom-start` | 弹出位置 |
| `placeholder` | String | `请选择` | 占位提示 |

## 示例

### 多选模式

::: demo 多选模式
```vue
<template>
  <XtSelectTree v-model="selectedValues" :data="treeData" multiple />
</template>

<script>
export default {
  data() {
    return {
      selectedValues: [],
      treeData: [
        {
          label: '部门A',
          value: 1,
          children: [
            { label: '员工1', value: 11 },
            { label: '员工2', value: 12 }
          ]
        },
        { label: '部门B', value: 2 }
      ]
    }
  }
}
</script>
```
:::

### 可搜索

::: demo 可搜索
```vue
<template>
  <XtSelectTree v-model="selectedValue" :data="treeData" filterable />
</template>

<script>
export default {
  data() {
    return {
      selectedValue: '',
      treeData: [
        { label: '张三', value: 1 },
        { label: '李四', value: 2 },
        { label: '王五', value: 3 }
      ]
    }
  }
}
</script>
```
:::

### 可清空

::: demo 可清空
```vue
<template>
  <XtSelectTree v-model="selectedValue" :data="treeData" clearable />
</template>

<script>
export default {
  data() {
    return {
      selectedValue: '',
      treeData: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 }
      ]
    }
  }
}
</script>
```
:::

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `change` | 选中值改变时触发 | `value`, `node` |
| `clear` | 清空时触发 | - |