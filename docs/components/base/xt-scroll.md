原生实现的虚拟滚动容器组件，支持横向和纵向虚拟滚动，适用于大数据量列表的高性能渲染。不依赖 `el-scrollbar`，采用原生 CSS 滚动容器，更轻量灵活。

### 基本用法

::: demo 基本用法
```vue
<template>
  <XtScroll :style="{ height: '400px' }" :v-scroll="true" :data="items" :item-size="50" key-field="id">
    <template #item="{ item, index }">
      <div style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>{{ index + 1 }}.</strong> {{ item.label }}
      </div>
    </template>
  </XtScroll>
</template>

<script>
export default {
  data() {
    return {
      items: Array.from({ length: 10000 }, (_, i) => ({ id: i, label: `数据项 ${i + 1}` }))
    }
  }
}
</script>
```
:::

### 纵向虚拟滚动

::: demo 设置 `scroll-direction="vertical"`（默认值）启用纵向虚拟滚动。
```vue
<template>
  <XtScroll
    :style="{ height: '300px' }"
    :v-scroll="true"
    :data="verticalData"
    :item-size="40"
    key-field="id"
    scroll-direction="vertical"
  >
    <template #item="{ item }">
      <div style="padding: 0 12px; line-height: 40px; height: 40px; border-bottom: 1px solid #ebeef5;">
        {{ item.name }} - {{ item.email }}
      </div>
    </template>
  </XtScroll>
</template>
<script>
export default {
  data() {
    return {
      verticalData: Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        name: `用户 ${i + 1}`,
        email: `user${i + 1}@example.com`
      }))
    }
  }
}
</script>
```
:::

### 横向虚拟滚动

::: demo 设置 `scroll-direction="horizontal"` 启用横向虚拟滚动，适用于超宽表格、时间轴等场景。
```vue
<template>
  <XtScroll
    :style="{ width: '600px', height: '80px' }"
    :v-scroll="true"
    :data="horizontalData"
    :item-size="120"
    scroll-direction="horizontal"
  >
    <template #item="{ item, index }">
      <div style="width: 120px; height: 80px; display: inline-flex; align-items: center; justify-content: center; background: #f0f2f5; margin-right: 4px; border-radius: 4px;">
        <span>{{ item }}</span>
      </div>
    </template>
  </XtScroll>
</template>
<script>
export default {
  data() {
    return {
      horizontalData: Array.from({ length: 1000 }, (_, i) => `标签 ${i + 1}`)
    }
  }
}
</script>
```
:::

### 非虚拟滚动模式

::: demo `vScroll` 为 false 时，使用默认插槽正常渲染，原生滚动条提供流畅的滚动体验。
```vue
<template>
  <XtScroll :style="{ height: '200px' }">
    <div v-for="i in 20" :key="i" style="padding: 8px; border-bottom: 1px solid #eee;">
      内容行 {{ i }} - 原生滚动条
    </div>
  </XtScroll>
</template>
```
:::

### 配合 XtList 使用

::: demo XtList 内置了 XtScroll，开启 `virtual-scroll` 即可启用虚拟滚动。
```vue
<template>
  <XtList
    :data="listData"
    :columns="2"
    :virtual-scroll="true"
    :item-height="160"
    :height="400"
    title="订单列表（虚拟滚动）"
  />
</template>
<script>
export default {
  data() {
    return {
      listData: Array.from({ length: 5000 }, (_, i) => ({
        title: `订单 #${i + 1}`,
        subtitle: `2024-${String(Math.ceil((i + 1) / 30)).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        content: `金额: ¥${(Math.random() * 1000).toFixed(2)}`,
        footer: i % 3 === 0 ? '已完成' : i % 3 === 1 ? '待发货' : '已取消'
      }))
    }
  }
}
</script>
```
:::

### 配合 XtScrollArrow 使用

::: demo XtScrollArrow 内置了 XtScroll，开启虚拟滚动后支持海量数据带箭头导航。
```vue
<template>
  <XtScrollArrow
    direction="horizontal"
    :v-scroll="true"
    :v-scroll-data="arrowData"
    :item-size="120"
  >
    <template #vitem="{ item }">
      <div style="width: 100px; height: 40px; display: flex; align-items: center; justify-content: center; background: #ecf5ff; border-radius: 4px; margin: 0 4px;">
        {{ item.label }}
      </div>
    </template>
  </XtScrollArrow>
</template>
<script>
export default {
  data() {
    return {
      arrowData: Array.from({ length: 200 }, (_, i) => ({ id: i, label: `标签 ${i + 1}` }))
    }
  }
}
</script>
```
:::

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| v-scroll | 是否启用虚拟滚动 | boolean | false |
| data | 虚拟滚动数据源 | array | [] |
| item-size | 每个 item 的固定尺寸（px），纵向为高度，横向为宽度 | number | 50 |
| key-field | item 的唯一键字段名 | string | 'id' |
| buffer-size | 预渲染缓冲区大小（item 数量） | number | 5 |
| scroll-direction | 虚拟滚动方向 | 'vertical' \| 'horizontal' | 'vertical' |
| item-class-name | item 的自定义 CSS 类名 | string | '' |
| height | 容器高度 | number \| string | '' |
| max-height | 容器最大高度 | number \| string | '' |
| width | 容器宽度 | number \| string | '' |
| max-width | 容器最大宽度 | number \| string | '' |
| loading | 加载状态 | boolean | false |
| empty-text | 空数据提示文字 | string | '暂无数据' |
| load-more | 是否启用加载更多 | boolean | false |
| load-more-text | 加载更多按钮文字 | string | '加载更多' |
| load-more-loading | 加载更多按钮加载状态 | boolean | false |

### Slots

| 名称 | 说明 | 作用域 |
|------|------|--------|
| default | 非虚拟滚动模式下的默认内容 | — |
| item | 虚拟滚动模式下每个 item 的渲染内容 | `{ item, index }` |
| empty | 空数据时的自定义内容 | — |
| loading | 加载中的自定义内容 | — |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| scroll | 滚动事件 | `{ scrollTop, scrollLeft }` |
| load-more | 触发加载更多 | — |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| scrollTo(pos) | 滚动到指定位置 | `pos: number` |
| scrollToItem(index) | 滚动到指定索引的 item | `index: number` |
| scrollToStart() | 滚动到顶部/左侧 | — |
| scrollToEnd() | 滚动到底部/右侧 | — |
| getScrollPos() | 获取当前滚动位置 | — |
| getScrollContainer() | 获取原生滚动容器 DOM 元素 | — |

### XtScrollArrow 新增属性

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| v-scroll | 是否启用虚拟滚动 | boolean | false |
| v-scroll-data | 虚拟滚动数据源 | array | [] |
| item-size | 每个 item 的固定尺寸（px） | number | 50 |
| key-field | item 的唯一键字段名 | string | 'id' |
| buffer-size | 预渲染缓冲区大小 | number | 5 |
| v-scroll-loading | 虚拟滚动加载状态 | boolean | false |
| load-more | 是否启用加载更多 | boolean | false |
| load-more-text | 加载更多按钮文字 | string | '加载更多' |
| load-more-loading | 加载更多按钮加载状态 | boolean | false |

### XtScrollArrow 新增 Slot

| 名称 | 说明 | 作用域 |
|------|------|--------|
| vitem | 虚拟滚动模式下每个 item 的渲染内容 | `{ item, index }` |