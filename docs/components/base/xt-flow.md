审批流程轨迹组件，用于展示纵向审批历史和当前状态，支持 Flowable 工作流原生数据对接。

## 基本用法

::: demo 基本用法 - 自定义数据格式
```vue
<template>
  <XtFlow :data="flowData" format="custom" />
</template>

<script>
export default {
  data() {
    return {
      flowData: [
        {
          id: '1',
          name: '提交申请',
          assignee: '张三',
          status: 'approved',
          createTime: '2024-01-01 10:00:00',
          endTime: '2024-01-01 10:05:00',
          comment: '',
          duration: '5分钟'
        },
        {
          id: '2',
          name: '直属领导审批',
          assignee: '李四',
          status: 'approved',
          createTime: '2024-01-01 10:30:00',
          endTime: '2024-01-01 10:45:00',
          comment: '同意',
          duration: '15分钟'
        },
        {
          id: '3',
          name: '部门经理审批',
          assignee: '王五',
          status: 'rejected',
          createTime: '2024-01-01 11:00:00',
          endTime: '2024-01-01 11:20:00',
          comment: '驳回：请补充材料后重新提交',
          duration: '20分钟'
        },
        {
          id: '4',
          name: '待处理',
          assignee: '--',
          status: 'pending',
          createTime: null,
          endTime: null,
          comment: '',
          duration: ''
        }
      ]
    }
  }
}
</script>
```
:::

## 示例

### Flowable 原生数据对接

直接传入 Flowable 返回的 `HistoricTaskInstance` 数据，组件自动解析状态。

::: demo Flowable 原生数据对接
```vue
<template>
  <XtFlow :data="flowableData" format="flowable" />
</template>

<script>
export default {
  data() {
    return {
      flowableData: [
        {
          id: '50001',
          name: '直属领导审批',
          assignee: '李四',
          startTime: '2024-01-01T10:30:00',
          endTime: '2024-01-01T10:45:00',
          deleteReason: null,
          durationInMillis: 900000
        },
        {
          id: '50002',
          name: '部门经理审批',
          assignee: '王五',
          startTime: '2024-01-01T11:00:00',
          endTime: '2024-01-01T11:20:00',
          deleteReason: 'rejected',
          durationInMillis: 1200000
        },
        {
          id: '50003',
          name: '总监审批',
          assignee: '赵六',
          startTime: '2024-01-01T14:00:00',
          endTime: null,
          deleteReason: null
        }
      ]
    }
  }
}
</script>
```
:::

### 自动折叠长审批链

当审批链超过指定数量时，自动折叠多余节点，点击可展开。

::: demo 自动折叠长审批链
```vue
<template>
  <XtFlow :data="longFlowData" :collapse-count="3" />
</template>

<script>
export default {
  data() {
    const data = []
    for (let i = 1; i <= 10; i++) {
      data.push({
        id: `flow-${i}`,
        name: `审批节点 ${i}`,
        assignee: `审批人 ${i}`,
        status: i === 10 ? 'pending' : 'approved',
        createTime: `2024-01-0${i} 10:00:00`,
        endTime: i === 10 ? null : `2024-01-0${i} 10:30:00`,
        comment: i === 5 ? '需要补充说明' : '',
        duration: i === 10 ? '' : '30分钟'
      })
    }
    return { longFlowData: data }
  }
}
</script>
```
:::

### 圆角风格

支持方形和圆形两套圆角规范。

::: demo 圆角风格
```vue
<template>
  <div style="display: flex; gap: 24px;">
    <XtFlow :data="flowData" rounded="square" />
    <XtFlow :data="flowData" rounded="round" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      flowData: [
        {
          id: '1',
          name: '提交申请',
          assignee: '张三',
          status: 'approved',
          createTime: '2024-01-01 10:00:00',
          comment: ''
        },
        {
          id: '2',
          name: '直属领导审批',
          assignee: '李四',
          status: 'pending',
          createTime: '2024-01-01 10:30:00',
          comment: ''
        }
      ]
    }
  }
}
</script>
```
:::

### 自定义操作按钮

通过插槽自定义节点操作按钮。

::: demo 自定义操作按钮
```vue
<template>
  <XtFlow :data="flowData">
    <template #node-action="{ node }">
      <el-button v-if="node.status === 'pending'" type="primary" size="mini">通过</el-button>
      <el-button v-if="node.status === 'pending'" type="danger" size="mini">驳回</el-button>
      <el-button v-if="node.status === 'approved'" type="text" size="mini">查看详情</el-button>
    </template>
  </XtFlow>
</template>

<script>
export default {
  data() {
    return {
      flowData: [
        {
          id: '1',
          name: '提交申请',
          assignee: '张三',
          status: 'approved',
          createTime: '2024-01-01 10:00:00'
        },
        {
          id: '2',
          name: '直属领导审批',
          assignee: '李四',
          status: 'pending',
          createTime: '2024-01-01 10:30:00'
        }
      ]
    }
  }
}
</script>
```
:::

### 自定义节点头像

通过插槽自定义节点图标或头像。

::: demo 自定义节点头像
```vue
<template>
  <XtFlow :data="flowData">
    <template #node-avatar="{ node }">
      <el-avatar v-if="node.assignee" :size="20" icon="el-icon-user"></el-avatar>
      <el-icon v-else :size="16">
        <el-icon-loading v-if="node.status === 'pending'" />
        <el-icon-check v-else-if="node.status === 'approved'" />
        <el-icon-close v-else-if="node.status === 'rejected'" />
        <el-icon-user v-else />
      </el-icon>
    </template>
  </XtFlow>
</template>

<script>
export default {
  data() {
    return {
      flowData: [
        {
          id: '1',
          name: '提交申请',
          assignee: '张三',
          status: 'approved',
          createTime: '2024-01-01 10:00:00'
        },
        {
          id: '2',
          name: '直属领导审批',
          assignee: '',
          status: 'pending',
          createTime: '2024-01-01 10:30:00'
        }
      ]
    }
  }
}
</script>
```
:::

### 自定义状态文本

通过 `statusMap` 属性自定义状态显示文本。

::: demo 自定义状态文本
```vue
<template>
  <XtFlow 
    :data="flowData" 
    :status-map="{
      approved: '✓ 审核通过',
      rejected: '✗ 审核驳回',
      pending: '⏳ 等待审核',
      transferred: '➡️ 已转办'
    }"
  />
</template>

<script>
export default {
  data() {
    return {
      flowData: [
        {
          id: '1',
          name: '提交申请',
          assignee: '张三',
          status: 'approved',
          createTime: '2024-01-01 10:00:00'
        },
        {
          id: '2',
          name: '直属领导审批',
          assignee: '李四',
          status: 'pending',
          createTime: '2024-01-01 10:30:00'
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
| `data` | Array | `[]` | - | 数据源，支持 Flowable 原始格式或自定义格式 |
| `format` | String | `flowable` | `flowable`、`custom` | 数据格式，`flowable` 自动解析状态，`custom` 直接使用 |
| `collapse` | Boolean | `true` | - | 是否自动折叠长审批链 |
| `collapseCount` | Number | `5` | - | 折叠前可见节点数 |
| `rounded` | String | `square` | `square`、`round` | 圆角风格，方形或圆形 |
| `timeFormat` | String | `YYYY-MM-DD HH:mm:ss` | - | 时间格式化字符串（仅 `format='flowable'` 时生效） |
| `statusMap` | Object | - | - | 自定义状态文本映射 |

## 状态值说明

| 状态值 | 默认文本 | 说明 |
|--------|----------|------|
| `approved` | 已通过 | 有结束时间且无驳回原因 |
| `rejected` | 已驳回 | `deleteReason` 包含 reject/驳回 |
| `pending` | 待审批 | 无结束时间或最后节点自动追加 |
| `transferred` | 已转办 | `deleteReason` 包含 transfer/转办 |
| `delegated` | 已委托 | `deleteReason` 包含 delegate/委托 |
| `recalled` | 已撤回 | `deleteReason` 包含 revoke/撤回/recall |
| `cancelled` | 已取消 | `deleteReason` 包含 cancel/取消 |
| `started` | 已发起 | 流程起始节点 |

## 插槽说明

| 插槽名 | 作用域 | 说明 |
|--------|--------|------|
| `node-avatar` | `{ node, index }` | 自定义节点图标/头像 |
| `node` | `{ node, index }` | 自定义节点标题 |
| `assignee` | `{ node, index }` | 自定义审批人显示 |
| `node-desc` | `{ node, index }` | 自定义描述/审批意见 |
| `node-action` | `{ node, index }` | 自定义节点操作按钮 |
| `expand-trigger` | - | 自定义展开触发器内容 |
| `collapse-trigger` | - | 自定义收起触发器内容 |

## Flowable 数据格式

组件支持直接对接 Flowable 工作流引擎返回的 `HistoricTaskInstance` 数据格式：

```javascript
{
  id: '50001',                      // 任务ID
  name: '部门经理审批',              // 任务名称
  taskName: '部门经理审批',          // 任务名称（兼容字段）
  activityName: '部门经理审批',      // 活动名称（兼容字段）
  assignee: '张三',                 // 审批人
  startTime: '2024-01-01T10:00:00', // 开始时间
  endTime: '2024-01-01T10:30:00',   // 结束时间（null 表示待办）
  deleteReason: null,               // 删除原因（rejected/delegate/transfer 等）
  durationInMillis: 1800000,        // 耗时（毫秒）
  type: 'userTask'                  // 节点类型（startEvent/userTask/endEvent）
}
```

## 自定义数据格式

使用 `format="custom"` 时，数据格式如下：

```javascript
{
  id: '1',                          // 节点ID
  name: '提交申请',                  // 节点名称
  assignee: '张三',                 // 审批人
  status: 'approved',               // 状态（必填）
  createTime: '2024-01-01 10:00:00', // 创建时间
  endTime: '2024-01-01 10:05:00',   // 结束时间
  comment: '',                      // 审批意见/驳回原因
  duration: '5分钟',                // 耗时
  description: ''                   // 描述信息
}
```

## 注意事项

- 组件自动推断状态：有 `endTime` 且无 `deleteReason` 为通过状态，`deleteReason` 包含 `reject` 为驳回状态
- 当 `format='flowable'` 且最后一个节点不是 `pending` 状态时，组件会自动追加一个待办节点
- 连接线样式根据前一个节点的状态决定，驳回状态自动显示红色虚线
- 待办节点的图标会有脉冲动画效果，提示用户当前待处理