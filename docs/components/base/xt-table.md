## XtTable 扩展表格组件

基于 ElementUI Table 封装的扩展表格组件，支持虚拟滚动、小计/总计、合并单元格等高级功能。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtTable
    :table-data="tableData"
    :columns="columns"
    title="用户列表"
  />
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '张三', age: 25, city: '北京' },
        { name: '李四', age: 30, city: '上海' },
        { name: '王五', age: 28, city: '广州' }
      ],
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'city', label: '城市' }
      ]
    }
  }
}
</script>
```
:::

## 属性说明

### 基础属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tableData` | Array | `[]` | 表格数据 |
| `columns` | Array | `[]` | 列配置 |
| `title` | String | `''` | 表格标题 |
| `height` | Number / String | - | 表格高度 |
| `maxHeight` | Number / String | - | 最大高度 |
| `showIndex` | Boolean | `false` | 是否显示序号列 |
| `selection` | Boolean | `false` | 是否显示选择列 |
| `selectionFixed` | Boolean / String | `false` | 选择列是否固定 |
| `indexFixed` | Boolean / String | `false` | 序号列是否固定 |
| `loading` | Boolean | `false` | 是否加载中 |
| `emptyText` | String | `暂无数据` | 空数据提示 |

### 虚拟滚动

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `virtualScroll` | Boolean | `false` | 是否启用虚拟滚动 |
| `rowInitHeight` | Number | `48` | 行初始高度 |
| `bufferSize` | Number | `5` | 缓冲区行数 |

### 小计/总计

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `groupColumns` | Array | `[]` | 合并单元格的列字段 |
| `subtotalConfig` | Object | `{ enabled: false }` | 小计配置 |
| `totalConfig` | Object | `{ enabled: false }` | 总计配置 |

### 分页

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pagination` | Object | `null` | 分页配置 |
| `total` | Number | `0` | 数据总数 |

### 排序

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sortGroup` | Boolean | `false` | 是否启用分组内排序 |
| `defaultSort` | Object | `null` | 默认排序配置 `{ prop, order }` |

## 列配置说明

```javascript
{
  prop: 'name',           // 字段名
  label: '姓名',          // 列标题
  width: 100,            // 宽度
  fixed: true,           // 是否固定
  align: 'center',       // 对齐方式
  sortable: true,        // 是否可排序
  render: (h, { row, index, column }) => {}, // 自定义渲染函数 返回 VNode
  formatter: (row, index, column) => {}, // 返回字符串
  slot: 'custom-slot',    // 自定义插槽名
  children: []           // 多级表头
}
```

## 示例

### 虚拟滚动

::: demo 虚拟滚动
```vue
<template>
  <XtTable
    :table-data="largeData"
    :columns="columns"
    :height="400"
    virtual-scroll
    title="大数据量表格"
  />
</template>

<script>
export default {
  data() {
    return {
      largeData: Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        name: `用户${i + 1}`,
        age: Math.floor(Math.random() * 50) + 20,
        city: ['北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 4)]
      })),
      columns: [
        { prop: 'id', label: 'ID', width: 80 },
        { prop: 'name', label: '姓名', width: 120 },
        { prop: 'age', label: '年龄', width: 80 },
        { prop: 'city', label: '城市', width: 100 }
      ]
    }
  }
}
</script>
```
:::

### 合并单元格

::: demo 合并单元格
```vue
<template>
  <XtTable
    :table-data="tableData"
    :columns="columns"
    :group-columns="['city']"
    title="按城市分组"
  />
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { city: '北京', name: '张三', age: 25 },
        { city: '北京', name: '李四', age: 30 },
        { city: '上海', name: '王五', age: 28 },
        { city: '上海', name: '赵六', age: 32 }
      ],
      columns: [
        { prop: 'city', label: '城市' },
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' }
      ]
    }
  }
}
</script>
```
:::

### 小计和总计

::: demo 小计和总计
```vue
<template>
  <XtTable
    :table-data="tableData"
    :columns="columns"
    :group-columns="['category']"
    :subtotal-config="subtotalConfig"
    :total-config="totalConfig"
    title="销售统计"
  />
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { category: '电子产品', name: '手机', price: 5999, count: 10 },
        { category: '电子产品', name: '电脑', price: 8999, count: 5 },
        { category: '日用品', name: '牙刷', price: 20, count: 100 },
        { category: '日用品', name: '毛巾', price: 30, count: 50 }
      ],
      columns: [
        { prop: 'category', label: '分类' },
        { prop: 'name', label: '名称' },
        { prop: 'price', label: '单价' },
        { prop: 'count', label: '数量' }
      ],
      subtotalConfig: {
        enabled: true,
        groupBy: ['category'],
        labelText: '小计',
        columns: {
          price: 'sum',
          count: 'sum'
        }
      },
      totalConfig: {
        enabled: true,
        labelText: '总计',
        columns: {
          price: 'sum',
          count: 'sum'
        }
      }
    }
  }
}
</script>
```
:::

### 排序

列配置中设置 `sortable: true` 即可启用排序。支持普通排序和分组内排序。

::: demo 普通排序
```vue
<template>
  <XtTable
    :table-data="tableData"
    :columns="columns"
    title="支持排序的表格"
  />
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '张三', age: 25, score: 88 },
        { name: '李四', age: 30, score: 95 },
        { name: '王五', age: 28, score: 76 },
        { name: '赵六', age: 22, score: 82 }
      ],
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄', sortable: true },
        { prop: 'score', label: '分数', sortable: true }
      ]
    }
  }
}
</script>
```
:::

::: demo 分组内排序
```vue
<template>
  <XtTable
    :table-data="tableData"
    :columns="columns"
    :group-columns="['city']"
    :sort-group="true"
    title="分组后组内排序"
  />
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { city: '北京', name: '张三', age: 25 },
        { city: '北京', name: '李四', age: 30 },
        { city: '北京', name: '王五', age: 28 },
        { city: '上海', name: '赵六', age: 22 },
        { city: '上海', name: '孙七', age: 35 },
        { city: '广州', name: '周八', age: 27 }
      ],
      columns: [
        { prop: 'city', label: '城市' },
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄', sortable: true }
      ]
    }
  }
}
</script>
```
:::

::: demo 默认排序和自定义排序
```vue
<template>
  <XtTable
    :table-data="tableData"
    :columns="columns"
    :default-sort="{ prop: 'score', order: 'descending' }"
    title="默认按分数降序排列"
  />
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '张三', score: 88, level: 'B' },
        { name: '李四', score: 95, level: 'A' },
        { name: '王五', score: 76, level: 'C' },
        { name: '赵六', score: 82, level: 'B' }
      ],
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'score', label: '分数', sortable: true },
        {
          prop: 'level',
          label: '等级',
          sortable: true,
          sortMethod: (a, b) => {
            const order = { 'A': 3, 'B': 2, 'C': 1 }
            return (order[a.level] || 0) - (order[b.level] || 0)
          }
        }
      ]
    }
  }
}
</script>
```
:::

### 分页

::: demo 分页
```vue
<template>
  <XtTable
    :table-data="tableData"
    :columns="columns"
    :pagination="pagination"
    :total="100"
    title="带分页表格"
    @size-change="handleSizeChange"
    @page-change="handlePageChange"
  />
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '张三', age: 25, city: '北京' },
        { name: '李四', age: 30, city: '上海' }
      ],
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'city', label: '城市' }
      ],
      pagination: {
        pageNum: 1,
        pageSize: 20,
        pageSizes: [10, 20, 50, 100]
      }
    }
  },
  methods: {
    handleSizeChange(size) {
      this.pagination.pageSize = size
    },
    handlePageChange(page) {
      this.pagination.pageNum = page
    }
  }
}
</script>
```
:::

### 自定义渲染

::: demo 自定义渲染
```vue
<template>
  <XtTable :table-data="tableData" :columns="columns">
    <template #action="{ row }">
      <XtButton size="small" @click="edit(row)">编辑</XtButton>
      <XtButton size="small" type="danger" @click="del(row)">删除</XtButton>
    </template>
  </XtTable>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { id: 1, name: '张三', status: 1 },
        { id: 2, name: '李四', status: 0 }
      ],
      columns: [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: '姓名' },
        { 
          prop: 'status', 
          label: '状态',
          formatter: (row) => row.status === 1 ? '正常' : '禁用'
        },
        { label: '操作', slot: 'action' }
      ]
    }
  },
  methods: {
    edit(row) {
      console.log('编辑', row)
    },
    del(row) {
      console.log('删除', row)
    }
  }
}
</script>
```
:::

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `selection-change` | 选择项变化 | `selectedRows` |
| `sort-change` | 排序变化 | `sortInfo` |
| `size-change` | 每页条数变化 | `size` |
| `page-change` | 当前页变化 | `page` |

## 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `getSelection` | 获取选中行 | - |
| `clearSelection` | 清除选中 | - |
| `toggleRowSelection` | 切换行选中状态 | `row`, `selected` |
| `toggleRowsSelection` | 批量切换行选中状态 | `rows`, `selected` |
| `doLayout` | 重新计算布局 | - |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `toolbar` | 工具栏区域（标题右侧） |
| `{slotName}` | 自定义列插槽（通过 column.slot 配置） |