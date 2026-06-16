## ExTable - 扩展表格组件

基于 ElementUI Table 二次封装的增强表格组件，支持虚拟滚动、多级表头、行合并、小计/总计等高级功能。

## 基本用法

::: demo 基本用法
```vue
<template>
  <ExTable 
    :height="300"
    title="用户列表"
    :tableData="tableData" 
    :columns="columns"
    :pagination="pagination"
    :total="total"
  >
    <template #toolbar>
      <el-button size="small" @click="handleRefresh">刷新</el-button>
      <el-button size="small" type="primary" @click="handleExport">导出</el-button>
    </template>
  </ExTable>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '张三', age: 25, score: 65 },
        { name: '李四', age: 30, score: 78 },
        { name: '王五', age: 28, score: 89 },
        { name: '赵六', age: 22, score: 95 },
        { name: '钱七', age: 26, score: 72 }
      ],
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'score', label: '分数' }
      ],
      pagination: {
        pageNum: 1,
        pageSize: 2
      },
      total: 5
    }
  },
  methods: {
    handleRefresh() {
      console.log('刷新数据')
    },
    handleExport() {
      // 自定义导出逻辑
      console.log('导出数据:', this.tableData)
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tableData` | Array | [] | 表格数据 |
| `columns` | Array | [] | 列配置（支持 children 多级表头） |
| `groupColumns` | Array | [] | 分组列配置，按配置的层级相同且父级相同的数据合并单元格 |
| `title` | String | '' | 表格标题 |
| `height` | Number/String | null | 表格高度 |
| `virtualScroll` | Boolean | false | 是否启用虚拟滚动 |
| `rowInitHeight` | Number | 48 | 预估行高（单位：px） |
| `bufferSize` | Number | 5 | 缓冲区行数（前后各n行） |
| `pagination` | Object | null | 分页配置，包含 `pageNum`（当前页）、`pageSize`（每页条数） |
| `total` | Number | 0 | 总条数 |
| `showIndex` | Boolean | false | 是否显示序号列 |
| `selection` | Boolean | false | 是否显示选择列 |
| `selectionFixed` | String/Boolean | false | 选择列固定位置（'left'/'right'/false） |
| `indexFixed` | String/Boolean | false | 序号列固定位置（'left'/'right'/false） |
| `loading` | Boolean | false | 加载状态 |
| `emptyText` | String | '暂无数据' | 空数据文案 |
| `subtotalConfig` | Object | { enabled: false } | 小计配置，详见下文 |
| `totalConfig` | Object | { enabled: false } | 总计配置，详见下文 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `page-change` | pageNum | 页码改变 |
| `size-change` | pageSize | 每页条数改变 |
| `selection-change` | rows | 选择项改变 |
| `sort-change` | { prop, order } | 排序改变 |

## 方法说明

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `getSelection()` | - | 获取选中行 |
| `clearSelection()` | - | 清除选中状态 |
| `toggleRowSelection(row, selected)` | row: Object, selected: Boolean | 切换行选中状态 |
| `toggleRowsSelection(rows, selected)` | rows: Array/Object, selected: Boolean | 批量切换选中状态 |
| `doLayout()` | - | 重新布局 |

## 多级表头

支持通过 `children` 嵌套实现多级表头：

::: demo 多级表头
```vue
<template>
  <ExTable 
    :height="300"
    :tableData="tableData" 
    :columns="columns"
  ></ExTable>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { prop: 'name', label: '姓名' },
        { 
          label: '成绩', 
          children: [
            { prop: 'math', label: '数学' },
            { prop: 'english', label: '英语' },
            { prop: 'chinese', label: '语文' }
          ]
        },
        { prop: 'total', label: '总分' }
      ],
      tableData: [
        { name: '张三', math: 90, english: 85, chinese: 92, total: 267 },
        { name: '李四', math: 88, english: 90, chinese: 85, total: 263 },
        { name: '王五', math: 95, english: 88, chinese: 90, total: 273 }
      ]
    }
  }
}
</script>
```
:::

## 行合并（分组列）

通过 `groupColumns` 配置按指定列分组合并单元格：

::: demo 行合并
```vue
<template>
  <ExTable 
    :height="300"
    :tableData="tableData" 
    :columns="columns"
    :groupColumns="['department', 'team']"
  ></ExTable>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { prop: 'department', label: '部门' },
        { prop: 'team', label: '团队' },
        { prop: 'name', label: '姓名' },
        { prop: 'position', label: '职位' }
      ],
      tableData: [
        { department: '研发部', team: '前端组', name: '张三', position: '前端工程师' },
        { department: '研发部', team: '前端组', name: '李四', position: '前端工程师' },
        { department: '研发部', team: '后端组', name: '王五', position: '后端工程师' },
        { department: '产品部', team: '产品组', name: '赵六', position: '产品经理' },
        { department: '产品部', team: '设计组', name: '钱七', position: 'UI设计师' }
      ]
    }
  }
}
</script>
```
:::

## 小计与总计

通过 `subtotalConfig` 和 `totalConfig` 配置小计和总计行：

::: demo 小计与总计
```vue
<template>
  <ExTable 
    :height="300"
    :tableData="tableData" 
    :columns="columns"
    :subtotalConfig="subtotalConfig"
    :totalConfig="totalConfig"
  ></ExTable>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { prop: 'region', label: '区域' },
        { prop: 'product', label: '产品' },
        { prop: 'quantity', label: '数量' },
        { prop: 'amount', label: '金额' }
      ],
      tableData: [
        { region: '华东区', product: 'A产品', quantity: 10, amount: 1000 },
        { region: '华东区', product: 'B产品', quantity: 20, amount: 2000 },
        { region: '华南区', product: 'A产品', quantity: 15, amount: 1500 },
        { region: '华南区', product: 'B产品', quantity: 25, amount: 2500 },
        { region: '华北区', product: 'A产品', quantity: 12, amount: 1200 },
        { region: '华北区', product: 'B产品', quantity: 18, amount: 1800 }
      ],
      subtotalConfig: {
        enabled: true,
        groupBy: ['region'],
        labelText: '小计',
        columns: {
          quantity: 'sum',
          amount: 'sum'
        }
      },
      totalConfig: {
        enabled: true,
        labelText: '总计',
        columns: {
          quantity: 'sum',
          amount: 'sum'
        }
      }
    }
  }
}
</script>
```
:::

### 小计/总计配置说明

**subtotalConfig 配置项：**
| 字段 | 类型 | 说明 |
|------|------|------|
| `enabled` | Boolean | 是否启用小计 |
| `groupBy` | Array | 分组字段数组 |
| `labelText` | String | 小计行标签文字，默认 `${分组值} 小计` |
| `columns` | Object | 各列的聚合配置 |

**totalConfig 配置项：**
| 字段 | 类型 | 说明 |
|------|------|------|
| `enabled` | Boolean | 是否启用总计 |
| `labelText` | String | 总计行标签文字，默认 `总计` |
| `columns` | Object | 各列的聚合配置 |

**columns 聚合配置方式：**
- 字符串简写：`'sum'`、`'avg'`、`'count'`、`'min'`、`'max'`
- 对象配置：`{ prop: 'field', type: 'sum' }`
- 自定义函数：`(rows) => customCalc(rows)`

## 虚拟滚动

::: demo 虚拟滚动
```vue
<template>
  <ExTable
    :height="300"
    :virtual-scroll="true"
    :row-init-height="48"
    :buffer-size="5"
    :tableData="largeData"
    :columns="columns"
  ></ExTable>
</template>

<script>


export default {
  data() {
    return {
      columns: [
        { prop: 'id', label: 'ID', width: "200", fixed: 'left' },
        { prop: 'name', label: '姓名', width: "200", fixed: 'left' },
        { prop: 'department', label: '部门', minWidth: "300" },
        { prop: 'position', label: '职位', width: "200" },
        { prop: 'salary', label: '薪资', minWidth: "200" },
        { prop: 'status', label: '状态', width: "200", fixed: 'right' }
      ],
      largeData: this.createVirtualScrollData(10000)
    }
  }
}
</script>
```
:::

### 虚拟滚动演示数据

提供 `createVirtualScrollData` 工具函数，快速生成大量测试数据：

```javascript
import { createVirtualScrollData, virtualScrollColumns } from 'xt-element-ui'

// 生成 10000 条演示数据
const tableData = createVirtualScrollData(10000)

// 或使用预设列配置
const columns = virtualScrollColumns
```

## 自定义插槽

### 工具栏插槽

::: demo 工具栏插槽
```vue
<template>
  <ExTable 
    title="用户管理"
    :tableData="tableData" 
    :columns="columns"
  >
    <template #toolbar>
      <el-button size="small" type="primary">新增</el-button>
      <el-button size="small">导入</el-button>
      <el-button size="small" type="danger">批量删除</el-button>
    </template>
  </ExTable>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'email', label: '邮箱' }
      ],
      tableData: [
        { name: '张三', age: 25, email: 'zhangsan@example.com' },
        { name: '李四', age: 30, email: 'lisi@example.com' }
      ]
    }
  }
}
</script>
```
:::

### 自定义列插槽

::: demo 自定义列插槽
```vue
<template>
  <ExTable 
    :height="300"
    :tableData="tableData" 
    :columns="columns"
  >
    <template #action="{ row }">
      <el-button size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
    </template>
  </ExTable>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { slot: 'action', label: '操作', width: '150' }
      ],
      tableData: [
        { name: '张三', age: 25 },
        { name: '李四', age: 30 },
        { name: '王五', age: 28 }
      ]
    }
  },
  methods: {
    handleEdit(row) {
      console.log('编辑:', row)
    },
    handleDelete(row) {
      console.log('删除:', row)
    }
  }
}
</script>
```
:::

## 选择功能

::: demo 选择功能
```vue
<template>
  <div>
    <el-button size="small" @click="handleGetSelection">获取选中</el-button>
    <el-button size="small" @click="handleClearSelection">清除选中</el-button>
    <ExTable 
      :height="300"
      :tableData="tableData" 
      :columns="columns"
      :selection="true"
      :selectionFixed="'left'"
      @selection-change="handleSelectionChange"
    ></ExTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'department', label: '部门' }
      ],
      tableData: [
        { name: '张三', age: 25, department: '研发部' },
        { name: '李四', age: 30, department: '产品部' },
        { name: '王五', age: 28, department: '运营部' }
      ]
    }
  },
  methods: {
    handleSelectionChange(rows) {
      console.log('选中:', rows)
    },
    handleGetSelection() {
      console.log('获取选中:', this.$refs.table.getSelection())
    },
    handleClearSelection() {
      this.$refs.table.clearSelection()
    }
  }
}
</script>
```
:::

## 自定义 formatter 渲染

通过 `formatter` 属性可以实现自定义单元格渲染，支持返回字符串、数字或 VNode：

::: demo 自定义 formatter 渲染
```vue
<template>
  <ExTable 
    :height="300"
    :tableData="tableData" 
    :columns="columns"
  ></ExTable>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { prop: 'name', label: '姓名' },
        { 
          prop: 'status', 
          label: '状态',
          formatter: (h, { row }) => {
            const map = {
              active: { text: '在职', color: '#67c23a' },
              leave: { text: '休假', color: '#e6a23c' },
              quit: { text: '离职', color: '#f56c6c' }
            }
            const info = map[row.status] || { text: row.status, color: '#909399' }
            return h('span', {
              style: { color: info.color, fontWeight: '500' }
            }, info.text)
          }
        },
        { 
          prop: 'score', 
          label: '分数',
          formatter: (h, { row }) => {
            if (row.score >= 90) return h('el-tag', { props: { type: 'success', size: 'mini' }}, '优秀')
            if (row.score >= 60) return h('el-tag', { props: { type: 'warning', size: 'mini' }}, '合格')
            return h('el-tag', { props: { type: 'danger', size: 'mini' }}, '不及格')
          }
        }
      ],
      tableData: [
        { name: '张三', status: 'active', score: 92 },
        { name: '李四', status: 'leave', score: 75 },
        { name: '王五', status: 'active', score: 88 },
        { name: '赵六', status: 'quit', score: 55 }
      ]
    }
  }
}
</script>
```
:::

## 虚拟滚动（大数据场景）

当数据量超过 **1000 条** 时，建议开启虚拟滚动以提升性能。虚拟滚动只会渲染可视区域内的行，大大减少 DOM 节点数量。

::: demo 虚拟滚动
```vue
<template>
  <ExTable
    :height="400"
    :virtual-scroll="true"
    :row-init-height="48"
    :buffer-size="5"
    :tableData="largeData"
    :columns="columns"
  ></ExTable>
</template>

<script>
export default {
  data() {
    const depts = ['研发部', '产品部', '运营部', '财务部', '市场部']
    const positions = ['工程师', '产品经理', '运营专员', '财务主管', '市场经理']
    return {
      columns: [
        { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
        { prop: 'name', label: '姓名', width: 120, fixed: 'left' },
        { prop: 'department', label: '部门', width: 150 },
        { prop: 'position', label: '职位', width: 150 },
        { prop: 'email', label: '邮箱', width: 200 },
        { prop: 'phone', label: '电话', width: 130 },
        { prop: 'salary', label: '薪资', width: 120 },
        { prop: 'status', label: '状态', width: 100, fixed: 'right' }
      ],
      largeData: Array.from({ length: 5000 }, (_, i) => ({
        id: i + 1,
        name: `用户${i + 1}`,
        department: depts[i % depts.length],
        position: positions[i % positions.length],
        email: `user${i + 1}@example.com`,
        phone: `13800138${String(i).padStart(4, '0')}`,
        salary: 5000 + Math.floor(Math.random() * 10000),
        status: ['在职', '休假', '离职'][i % 3]
      }))
    }
  }
}
</script>
```
:::

## 列配置详解

| 属性 | 类型 | 说明 |
|------|------|------|
| `prop` | String | 数据字段名 |
| `label` | String | 表头文字 |
| `width` | Number/String | 列宽（数字单位为 px） |
| `minWidth` | Number/String | 最小列宽 |
| `fixed` | String/Boolean | 固定列位置，可选 `'left'` / `'right'` / `true` |
| `align` | String | 对齐方式，可选 `'left'` / `'center'` / `'right'` |
| `children` | Array | 多级表头子列配置（嵌套使用） |
| `formatter` | Function | 自定义渲染函数，签名：`(h, { row, index, column }) => VNode \| String` |
| `slot` | String | 自定义插槽名，配合组件的具名插槽使用 |

## 虚拟滚动注意事项

- 必须设置表格高度（`height` 属性），否则虚拟滚动无法计算可视区域
- `rowInitHeight` 建议与实际行高一致，否则会出现滚动偏移
- 虚拟滚动模式下**不支持**行合并（`groupColumns`）和小计/总计功能
- 数据量大于 5000 条时建议配合后端分页使用

## 常见问题

**Q: 表格渲染空白？**
- A: 检查是否设置了 `height` 属性，特别是开启虚拟滚动时必须设置高度。

**Q: 分页切换时数据不更新？**
- A: 确保 `tableData` 是响应式数据，更新时使用赋值方式（`this.tableData = newData`）。

**Q: 选择功能返回的数据包含小计/总计行？**
- A: `getSelection()` 方法和 `selection-change` 事件已自动过滤掉 `_rowType` 标记的小计/总计行，无需额外处理。