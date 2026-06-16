## ExSelectTree 树形下拉选择

将 ElementUI 的 `el-tree` 与 `el-select` 结合，支持单选/多选、搜索过滤、树形层级展开等功能。

## 基础用法

最基础的单选用法：

::: demo 树形选择基础示例
```vue
<template>
  <ex-select-tree
    v-model="value"
    :data="treeData"
    placeholder="请选择部门"
  />
</template>

<script>
export default {
  data() {
    return {
      value: '',
      treeData: [
        {
          value: 1, label: '研发部',
          children: [
            { value: 11, label: '前端组' },
            { value: 12, label: '后端组' }
          ]
        },
        { value: 2, label: '市场部' },
        { value: 3, label: '运营部' }
      ]
    }
  }
}
</script>
```
:::

## 多选模式

设置 `multiple` 属性开启多选，选中项以英文逗号分隔显示：

::: demo 树形选择多选示例
```vue
<template>
  <ex-select-tree
    v-model="value"
    :data="treeData"
    multiple
    placeholder="请选择部门"
  />
</template>

<script>
export default {
  data() {
    return {
      value: [],
      treeData: [
        { value: 1, label: '研发部', children: [
          { value: 11, label: '前端组' },
          { value: 12, label: '后端组' }
        ]},
        { value: 2, label: '市场部' },
        { value: 3, label: '运营部' }
      ]
    }
  }
}
</script>
```
:::

## 自定义节点字段

通过 `props` 属性可自定义节点字段映射：

::: demo 树形选择自定义字段
```vue
<template>
  <ex-select-tree
    v-model="value"
    :data="treeData"
    :props="{ value: 'id', label: 'name', children: 'sub' }"
    placeholder="请选择"
  />
</template>

<script>
export default {
  data() {
    return {
      value: '',
      treeData: [
        { id: 1, name: '选项一', sub: [
          { id: 11, name: '子选项一' },
          { id: 12, name: '子选项二' }
        ]},
        { id: 2, name: '选项二' }
      ]
    }
  }
}
</script>
```
:::

## 仅叶子节点可选

设置 `checkLeafOnly` 使多选模式下仅叶子节点会被纳入结果：

::: demo 仅叶子可选
```vue
<template>
  <ex-select-tree
    v-model="value"
    :data="treeData"
    multiple
    check-leaf-only
    placeholder="请选择"
  />
</template>

<script>
export default {
  data() {
    return {
      value: [],
      treeData: [
        { value: 1, label: '总部', children: [
          { value: 11, label: '上海' },
          { value: 12, label: '北京' }
        ]},
        { value: 2, label: '分部', children: [
          { value: 21, label: '广州' }
        ]}
      ]
    }
  }
}
</script>
```
:::

## 可清空与禁用

支持 `clearable` 与 `disabled` 属性：

::: demo 可清空与禁用示例
```vue
<template>
  <div>
    <ex-select-tree v-model="v1" :data="data" clearable placeholder="可清空" />
    <ex-select-tree v-model="v2" :data="data" disabled placeholder="已禁用" style="margin-left: 20px" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      v1: '',
      v2: '',
      data: [
        { value: 1, label: '选项一' },
        { value: 2, label: '选项二' }
      ]
    }
  }
}
</script>
```
:::

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| data | 树形数据 | array | — | [] |
| props | 节点字段配置 | object | — | {value:'value', label:'label', children:'children', disabled:'disabled', isLeaf:'isLeaf'} |
| multiple | 是否多选 | boolean | — | false |
| clearable | 是否可清空 | boolean | — | false |
| disabled | 是否禁用 | boolean | — | false |
| filterable | 是否可搜索过滤 | boolean | — | true |
| check-strictly | 是否父子节点不联动 | boolean | — | false |
| check-leaf-only | 多选时是否仅返回叶子节点 | boolean | — | false |
| include-half-checked | 多选时是否包含半选节点 | boolean | — | false |
| default-expand-all | 是否默认展开所有节点 | boolean | — | false |
| lazy | 是否懒加载子节点 | boolean | — | false |
| load | 懒加载加载函数 | function | — | — |
| placeholder | 占位符 | string | — | 请选择 |
| size | 输入框尺寸 | string | medium/small/mini | — |
| placement | 弹出位置 | string | top/top-start/top-end/bottom/bottom-start/bottom-end | bottom-start |
| popover-width | 弹出层宽度（px） | number | — | — |
| node-key | 节点唯一标识 | string | — | value |
| highlight-current | 是否高亮当前选中节点 | boolean | — | true |
| indent | 相邻级节点间的水平缩进（px） | number | — | — |
| accordion | 是否每次只打开一个同级树节点 | boolean | — | false |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 值改变时触发 | (value, node) |
| clear | 清空时触发 | — |
| focus | 获得焦点 | — |
| blur | 失去焦点 | — |
