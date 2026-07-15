树形穿梭框组件，支持树形结构数据的穿梭，提供多种穿梭模式满足不同业务场景。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :height="400"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: [],
      treeData: [
        {
          id: '1',
          label: '一级菜单',
          children: [
            {
              id: '1-1',
              label: '二级菜单1'
            },
            {
              id: '1-2',
              label: '二级菜单2'
            }
          ]
        },
        {
          id: '2',
          label: '一级菜单2',
          children: [
            {
              id: '2-1',
              label: '二级菜单3'
            }
          ]
        }
      ]
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `value` / `v-model` | Array | `[]` | - | 已选择的节点 ID 数组 |
| `data` | Array | `[]` | - | 树形数据源 |
| `leftTitle` | String | `待选择` | - | 左侧面板标题 |
| `rightTitle` | String | `已选择` | - | 右侧面板标题 |
| `treeProps` | Object | `{ label, children, value }` | - | 树节点属性配置 |
| `defaultExpandAll` | Boolean | `true` | - | 是否默认展开所有节点 |
| `filterable` | Boolean | `false` | - | 是否支持搜索过滤 |
| `showCheckbox` | Boolean | `true` | - | 是否显示复选框 |
| `cascade` | Boolean | `true` | - | 是否级联选择 |
| `transferMode` | String | `single` | `single`, `multiple`, `parent-child` | 穿梭模式 |
| `buttonSize` | String | `small` | - | 按钮尺寸 |

## 穿梭模式说明

| 模式 | 说明 |
|------|------|
| `single` | 单选模式，点击节点或勾选后只穿梭当前节点 |
| `multiple` | 多选模式，勾选多个节点后一次性穿梭 |
| `parent-child` | 父子模式，穿梭父节点时自动包含所有子节点 |

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `change` | 数据变化时触发 | `{ value, addedKeys, removedKeys }` |

## 示例

### 父子级联穿梭

::: demo 父子级联穿梭
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :height="400"
    transfer-mode="parent-child"
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: [],
      treeData: [
        {
          id: '1',
          label: '部门A',
          children: [
            { id: '1-1', label: '员工1' },
            { id: '1-2', label: '员工2' }
          ]
        },
        {
          id: '2',
          label: '部门B',
          children: [
            { id: '2-1', label: '员工3' }
          ]
        }
      ]
    }
  },
  methods: {
    handleChange({ value, addedKeys, removedKeys }) {
      console.log('已选择:', value)
      console.log('新增:', addedKeys)
      console.log('移除:', removedKeys)
    }
  }
}
</script>
```
:::

### 支持搜索过滤

::: demo 支持搜索过滤
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :height="400"
    :filterable="true"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: [],
      treeData: [
        {
          id: '1',
          label: '水果',
          children: [
            { id: '1-1', label: '苹果' },
            { id: '1-2', label: '香蕉' },
            { id: '1-3', label: '橙子' }
          ]
        },
        {
          id: '2',
          label: '蔬菜',
          children: [
            { id: '2-1', label: '西红柿' },
            { id: '2-2', label: '黄瓜' }
          ]
        }
      ]
    }
  }
}
</script>
```
:::

### 不级联选择

::: demo 不级联选择
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :height="400"
    :cascade="false"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: [],
      treeData: [
        {
          id: '1',
          label: '分类1',
          children: [
            { id: '1-1', label: '项目1' },
            { id: '1-2', label: '项目2' }
          ]
        }
      ]
    }
  }
}
</script>
```
:::

### 点击穿梭（无复选框）

::: demo 点击穿梭
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :height="400"
    :show-checkbox="false"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: [],
      treeData: [
        {
          id: '1',
          label: '选项1'
        },
        {
          id: '2',
          label: '选项2'
        }
      ]
    }
  }
}
</script>
```
:::

## 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `clearSelection` | 清空选择 | - |

## 数据格式

```javascript
[
  {
    id: 'node-id',
    label: '节点名称',
    children: [
      {
        id: 'child-id',
        label: '子节点名称'
      }
    ]
  }
]
```