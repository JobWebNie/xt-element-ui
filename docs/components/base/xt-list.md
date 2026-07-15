基于 ElementUI Card 封装的列表渲染组件，一个卡片代表一条数据，支持分组、虚拟滚动、搜索筛选、排序等功能。

### 基本用法

::: demo 基本用法
```vue
<template>
  <XtList
    :data="listData"
    title="订单列表"
  />
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, title: '订单 #001', subtitle: '2024-01-15', content: '金额: ¥299.00', footer: '已完成' },
        { id: 2, title: '订单 #002', subtitle: '2024-01-16', content: '金额: ¥599.00', footer: '待发货' },
        { id: 3, title: '订单 #003', subtitle: '2024-01-17', content: '金额: ¥199.00', footer: '已完成' }
      ]
    }
  }
}
</script>
```
:::

### 分组展示

::: demo 分组展示
```vue
<template>
  <XtList
    :data="listData"
    group-by="status"
    title="订单列表（按状态分组）"
  />
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, title: '订单 #001', status: '已完成', content: '金额: ¥299.00' },
        { id: 2, title: '订单 #002', status: '待发货', content: '金额: ¥599.00' },
        { id: 3, title: '订单 #003', status: '已完成', content: '金额: ¥199.00' },
        { id: 4, title: '订单 #004', status: '待发货', content: '金额: ¥899.00' },
        { id: 5, title: '订单 #005', status: '已取消', content: '金额: ¥129.00' }
      ]
    }
  }
}
</script>
```
:::

### 手风琴模式

::: demo 手风琴模式
```vue
<template>
  <XtList
    :data="listData"
    group-by="status"
    :accordion="true"
    title="手风琴模式（同时只展开一个分组）"
  />
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, title: '订单 #001', status: '已完成', content: '金额: ¥299.00' },
        { id: 2, title: '订单 #002', status: '待发货', content: '金额: ¥599.00' },
        { id: 3, title: '订单 #003', status: '已完成', content: '金额: ¥199.00' },
        { id: 4, title: '订单 #004', status: '待发货', content: '金额: ¥899.00' }
      ]
    }
  }
}
</script>
```
:::

### 自定义卡片配置

通过 `cardConfig` 配置字段映射，自动渲染卡片内容。

::: demo 自定义卡片配置
```vue
<template>
  <XtList
    :data="listData"
    :card-config="cardConfig"
    title="商品列表"
  />
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, name: 'iPhone 15', price: 5999, desc: '全新 A17 Pro 芯片', tag: '热卖', tagType: 'danger' },
        { id: 2, name: 'MacBook Pro', price: 12999, desc: 'M3 Pro 芯片', tag: '新品', tagType: 'success' },
        { id: 3, name: 'AirPods Pro', price: 1899, desc: '主动降噪', tag: '推荐', tagType: '' }
      ],
      cardConfig: {
        title: 'name',
        subtitle: 'price',
        content: 'desc',
        tag: 'tag',
        tagType: 'tagType',
        footer: 'price'
      }
    }
  }
}
</script>
```
:::

### 自定义渲染（插槽）

::: demo 自定义渲染
```vue
<template>
  <XtList :data="listData" title="自定义卡片内容">
    <template #default="{ item, index }">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 48px; height: 48px; background: #409eff; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; flex-shrink: 0;">
          {{ index + 1 }}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 600; font-size: 15px; color: #303133; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ item.name }}</div>
          <div style="font-size: 13px; color: #909399; margin-top: 4px;">{{ item.desc }}</div>
        </div>
        <XtButton size="small" type="primary" plain>查看</XtButton>
      </div>
    </template>
  </XtList>
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, name: 'iPhone 15', desc: '全新 A17 Pro 芯片' },
        { id: 2, name: 'MacBook Pro', desc: 'M3 Pro 芯片' },
        { id: 3, name: 'AirPods Pro', desc: '主动降噪' }
      ]
    }
  }
}
</script>
```
:::

### 虚拟滚动

大数据量场景下启用虚拟滚动，仅渲染可见区域的卡片。

::: demo 虚拟滚动
```vue
<template>
  <XtList
    :data="largeData"
    :height="500"
    :item-height="140"
    :virtual-scroll="true"
    title="虚拟滚动（10000条数据）"
  />
</template>

<script>
export default {
  data() {
    const items = []
    for (let i = 0; i < 10000; i++) {
      items.push({
        id: i + 1,
        title: `数据项 #${i + 1}`,
        subtitle: `分类 ${Math.floor(Math.random() * 10) + 1}`,
        content: `这是第 ${i + 1} 条数据的描述内容`
      })
    }
    return {
      largeData: items
    }
  }
}
</script>
```
:::

### 搜索筛选

::: demo 搜索筛选
```vue
<template>
  <XtList
    :data="listData"
    :filterable="true"
    filter-placeholder="搜索订单..."
    title="订单列表"
  />
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, title: '手机订单', content: '¥2999.00' },
        { id: 2, title: '电脑订单', content: '¥8999.00' },
        { id: 3, title: '耳机订单', content: '¥599.00' },
        { id: 4, title: '平板订单', content: '¥3499.00' },
        { id: 5, title: '键盘订单', content: '¥299.00' }
      ]
    }
  }
}
</script>
```
:::

### 排序

::: demo 排序
```vue
<template>
  <XtList
    :data="listData"
    :sortable="true"
    sort-by="price"
    title="商品列表（按价格排序）"
  />
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, title: '商品A', price: 299 },
        { id: 2, title: '商品B', price: 599 },
        { id: 3, title: '商品C', price: 199 },
        { id: 4, title: '商品D', price: 899 },
        { id: 5, title: '商品E', price: 399 }
      ]
    }
  }
}
</script>
```
:::

### 多列布局

::: demo 多列布局
```vue
<template>
  <XtList
    :data="listData"
    :columns="2"
    title="双列商品列表"
  />
</template>

<script>
export default {
  data() {
    return {
      listData: [
        { id: 1, title: '商品 1', content: '¥99.00' },
        { id: 2, title: '商品 2', content: '¥199.00' },
        { id: 3, title: '商品 3', content: '¥299.00' },
        { id: 4, title: '商品 4', content: '¥399.00' }
      ]
    }
  }
}
</script>
```
:::

### 加载更多

::: demo 加载更多
```vue
<template>
  <XtList
    :data="listData"
    :load-more="true"
    :has-more="hasMore"
    load-more-text="点击加载更多"
    title="商品列表"
    @load-more="handleLoadMore"
  />
</template>

<script>
export default {
  data() {
    return {
      listData: [],
      hasMore: true,
      page: 1
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const newItems = Array.from({ length: 10 }, (_, i) => ({
        id: (this.page - 1) * 10 + i + 1,
        title: `商品 #${(this.page - 1) * 10 + i + 1}`,
        content: `¥${Math.floor(Math.random() * 1000) + 100}.00`
      }))
      this.listData = [...this.listData, ...newItems]
      this.page++
      this.hasMore = this.page <= 3
    },
    handleLoadMore() {
      setTimeout(() => {
        this.loadData()
      }, 500)
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
| `data` | Array | `[]` | 列表数据 |
| `title` | String | `''` | 列表标题 |
| `columns` | Number | `1` | 列数（1/2/3） |
| `shadow` | String | `'hover'` | 卡片阴影（'always' / 'hover' / 'never'） |
| `cardBodyStyle` | Object | `{}` | 卡片 body 样式 |
| `loading` | Boolean | `false` | 是否加载中 |
| `emptyText` | String | `'暂无数据'` | 空数据提示 |

### 分组配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `groupBy` | String | `''` | 分组字段名 |
| `groupLabel` | String / Function | `''` | 分组标题（空字符串显示分组值，字符串为字段名，函数返回自定义内容） |
| `expandAll` | Boolean | `true` | 是否默认展开所有分组 |
| `accordion` | Boolean | `false` | 手风琴模式（同时只展开一个分组） |

### 卡片配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cardConfig` | Object | `{ title: 'title', ... }` | 卡片字段映射配置 |

cardConfig 子属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | String / Function | 卡片标题字段 |
| `subtitle` | String / Function | 卡片副标题字段 |
| `content` | String / Function | 卡片内容字段 |
| `image` | String / Function | 卡片图片字段 |
| `tag` | String / Function | 卡片标签字段 |
| `tagType` | String / Function | 标签类型 |
| `footer` | String / Function | 卡片底部字段 |

### 虚拟滚动

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `virtualScroll` | Boolean | `false` | 是否启用虚拟滚动 |
| `height` | Number / String | - | 容器高度 |
| `maxHeight` | Number / String | - | 容器最大高度 |
| `itemHeight` | Number | `160` | 每行卡片预估高度 |
| `bufferSize` | Number | `3` | 缓冲区行数 |

### 搜索筛选

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `filterable` | Boolean | `false` | 是否启用搜索 |
| `filterPlaceholder` | String | `'请输入搜索内容'` | 搜索框占位文本 |
| `filterMethod` | Function | - | 自定义筛选方法 `(item, searchText) => boolean` |

### 排序

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sortable` | Boolean | `false` | 是否启用排序 |
| `sortBy` | String | `''` | 排序字段 |
| `sortOrder` | String | `''` | 默认排序方向（'ascending' / 'descending'） |
| `sortMethod` | Function | - | 自定义排序方法 `(a, b) => number` |

### 加载更多

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadMore` | Boolean | `false` | 是否启用加载更多 |
| `hasMore` | Boolean | `false` | 是否有更多数据 |
| `loadMoreText` | String | `'加载更多'` | 加载更多按钮文本 |
| `loadMoreLoading` | Boolean | `false` | 加载更多按钮加载状态 |

### 分页

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `pagination` | Object | `null` | 分页配置 `{ pageNum, pageSize, pageSizes }` |
| `total` | Number | `0` | 数据总数 |

## 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `click-item` | 点击卡片 | `{ item, groupKey }` |
| `group-toggle` | 分组展开/折叠 | `{ key, expanded }` |
| `search` | 搜索输入变化 | `searchText` |
| `sort-change` | 排序变化 | `{ prop, order }` |
| `load-more` | 点击加载更多 | - |
| `size-change` | 每页条数变化 | `size` |
| `page-change` | 当前页变化 | `page` |

## 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `scrollToTop()` | 滚动到顶部 | - |
| `expandGroup(key)` | 展开指定分组 | `key` |
| `collapseGroup(key)` | 折叠指定分组 | `key` |
| `collapseAll()` | 折叠所有分组 | - |
| `expandAllGroups()` | 展开所有分组 | - |

## 插槽

| 插槽名 | 作用域 | 说明 |
|--------|--------|------|
| `default` | `{ item, index, group }` | 自定义卡片内容 |
| `group-title` | `{ group, items, expanded }` | 自定义分组标题 |
| `card-footer` | `{ item, index }` | 自定义卡片底部 |
| `toolbar` | - | 工具栏区域（搜索和排序按钮右侧） |
| `empty` | - | 自定义空状态 |
| `loading` | - | 自定义加载状态 |