树形穿梭框组件，基于 el-tree-transfer 理念优化改进，支持树形结构数据的穿梭，提供多种穿梭模式满足不同业务场景。

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
| `data` | Array | `[]` | - | 树形数据源，支持嵌套 `children` 结构或扁平 `id/pid` 结构 |
| `leftTitle` | String | `待选择` | - | 左侧面板标题 |
| `rightTitle` | String | `已选择` | - | 右侧面板标题 |
| `treeProps` | Object | `{ label: 'label', children: 'children', value: 'id' }` | - | 树节点属性映射配置 |
| `pidKey` | String | `pid` | - | 扁平数据的父级字段名（扁平数据格式下使用） |
| `rootPidValue` | String/Number/Array | `0` | - | 扁平数据的根节点 pid 值 |
| `defaultExpandAll` | Boolean | `true` | - | 是否默认展开所有节点 |
| `filterable` | Boolean | `false` | - | 是否支持搜索过滤 |
| `showCheckbox` | Boolean | `true` | - | 是否显示复选框 |
| `cascade` | Boolean | `true` | - | 是否级联选择 |
| `transferMode` | String | `single` | `single`, `multiple`, `parent-child` | 穿梭模式 |
| `buttonSize` | String | `small` | - | 按钮尺寸 |
| `copyMode` | Boolean | `false` | - | 复制模式：穿梭到右侧时左侧保留原数据 |
| `stickyMode` | Boolean | `false` | - | 粘性模式：级联勾选 + 半选父节点复制 + 全选移动 |
| `moveToEnabled` | Boolean | `false` | - | 启用"移动到指定位置"功能（需配合 `:show-checkbox="false"`） |
| `height` | String/Number | `''` | - | 组件固定高度，支持数字（px）或字符串 |
| `draggable` | Boolean | `false` | - | 是否启用右侧面板拖拽排序 |
| `highlightCurrent` | Boolean | `true` | - | 是否高亮当前选中节点（无复选框模式下生效） |

## 穿梭模式说明

| 模式 | 说明 |
|------|------|
| `single` | 穿梭仅当前节点，不包含子节点 |
| `multiple` | 同 `single`，穿梭仅当前节点（多选能力由复选框提供） |
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

### 复制模式

开启 `copyMode` 后，穿梭到右侧时左侧保留原数据，仅从右侧移除时才删除。

::: demo 复制模式
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :copy-mode="true"
    right-title="已复制"
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
          label: '公共权限',
          children: [
            { id: '1-1', label: '查看' },
            { id: '1-2', label: '编辑' }
          ]
        },
        {
          id: '2',
          label: '管理权限',
          children: [
            { id: '2-1', label: '删除' },
            { id: '2-2', label: '导出' }
          ]
        }
      ]
    }
  },
  methods: {
    handleChange({ value }) {
      console.log('已复制:', value)
    }
  }
}
</script>
```
:::

### 粘性模式

开启 `stickyMode` 后，勾选子级时父级自动选中或半选。穿梭时：
- 父级全选 → 父节点及所有子节点全部移动
- 父级半选 → 父节点复制（两侧同时显示，带复制图标），勾选的子节点移动

::: demo 粘性模式
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :sticky-mode="true"
    right-title="已分配"
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
            { id: '1-1', label: '员工张三' },
            { id: '1-2', label: '员工李四' },
            { id: '1-3', label: '员工王五' }
          ]
        },
        {
          id: '2',
          label: '部门B',
          children: [
            { id: '2-1', label: '员工赵六' },
            { id: '2-2', label: '员工钱七' }
          ]
        }
      ]
    }
  },
  methods: {
    handleChange({ value }) {
      console.log('已分配:', value)
    }
  }
}
</script>
```
:::

### 单节点模式 + 移动到指定位置

`transfer-mode="single"` 配合 `:show-checkbox="false"` 和 `move-to-enabled`，支持选中左侧节点后，指定其在右侧的位置（置顶/置底/之前/之后）。

::: demo 移动到指定位置
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :show-checkbox="false"
    :move-to-enabled="true"
    right-title="排序列表"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: [],
      treeData: [
        { id: '1', label: '第一步' },
        { id: '2', label: '第二步' },
        { id: '3', label: '第三步' },
        { id: '4', label: '第四步' },
        { id: '5', label: '第五步' }
      ]
    }
  }
}
</script>
```
:::

### 拖拽排序

启用 `:draggable="true"` 后，右侧面板的节点支持拖拽排序，可调整已选节点的顺序。

::: demo 拖拽排序
```vue
<template>
  <XtTransferTree 
    :data="treeData" 
    v-model="selectedIds" 
    :height="400"
    :draggable="true"
    right-title="可拖拽排序"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: ['1-1', '1-2'],
      treeData: [
        {
          id: '1',
          label: '功能模块',
          children: [
            { id: '1-1', label: '用户管理' },
            { id: '1-2', label: '角色管理' },
            { id: '1-3', label: '权限管理' },
            { id: '1-4', label: '日志管理' }
          ]
        },
        {
          id: '2',
          label: '系统设置',
          children: [
            { id: '2-1', label: '参数配置' },
            { id: '2-2', label: '字典管理' }
          ]
        }
      ]
    }
  }
}
</script>
```
:::

### 扁平数据格式

除支持嵌套 `children` 结构外，组件还支持扁平 `id/pid` 格式数据，组件会自动构建树形结构。

::: demo 扁平数据格式
```vue
<template>
  <XtTransferTree 
    :data="flatData" 
    v-model="selectedIds" 
    :height="400"
    :filterable="true"
    pid-key="parentId"
    :root-pid-value="[0, null]"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedIds: [],
      flatData: [
        { id: '1', parentId: 0, label: '总公司' },
        { id: '2', parentId: 1, label: '技术部' },
        { id: '3', parentId: 1, label: '市场部' },
        { id: '4', parentId: 2, label: '前端组' },
        { id: '5', parentId: 2, label: '后端组' },
        { id: '6', parentId: 3, label: '品牌组' },
        { id: '7', parentId: null, label: '外部合作' }
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

### 嵌套格式（推荐）

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

### 扁平格式

```javascript
[
  { id: '1', pid: 0, label: '根节点' },
  { id: '2', pid: '1', label: '子节点' },
  { id: '3', pid: null, label: '独立节点' }
]
```

| 字段 | 说明 |
|------|------|
| `id` | 节点唯一标识，对应 `treeProps.value` |
| `pid` | 父节点 ID，对应 `pidKey` |
| `label` | 节点显示名称，对应 `treeProps.label` |