滚动箭头组件用于在内容溢出时显示滚动箭头，支持水平和垂直方向的滚动。基于 `XtScroll` 封装，支持虚拟滚动模式处理海量数据。

## 基本用法

::: demo 水平滚动
```vue
<template>
  <XtScrollArrow :width="300">
    <div style="display: flex; gap: 16px; padding: 8px;">
      <div v-for="i in 10" :key="i" style="width: 80px; height: 60px; background: #f5f7fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        项目 {{ i }}
      </div>
    </div>
  </XtScrollArrow>
</template>
```
:::

## 属性说明
| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `direction` | String | horizontal | `horizontal`、`vertical` | 滚动方向 |
| `scrollStep` | Number | 100 | - | 每次滚动的步长（像素） |
| `autoHide` | Boolean | true | - | 是否自动隐藏箭头（滚动到边界时隐藏） |
| `height` | String / Number | - | - | 容器高度 |
| `width` | String / Number | - | - | 容器宽度 |
| `v-scroll` | Boolean | false | - | 是否启用虚拟滚动 |
| `v-scroll-data` | Array | [] | - | 虚拟滚动数据源 |
| `item-size` | Number | 50 | - | 每个 item 的固定尺寸（px） |
| `key-field` | String | 'id' | - | item 的唯一键字段名 |
| `buffer-size` | Number | 5 | - | 预渲染缓冲区大小 |
| `v-scroll-loading` | Boolean | false | - | 虚拟滚动加载状态 |
| `load-more` | Boolean | false | - | 是否启用加载更多 |
| `load-more-text` | String | '加载更多' | - | 加载更多按钮文字 |
| `load-more-loading` | Boolean | false | - | 加载更多按钮加载状态 |

## 插槽说明
| 插槽名 | 作用域 | 说明 |
|--------|--------|------|
| `default` | — | 非虚拟滚动模式下的默认内容 |
| `vitem` | `{ item, index }` | 虚拟滚动模式下每个 item 的渲染内容 |

## 事件说明
| 事件名称 | 说明 | 参数 |
|----------|------|------|
| `scroll` | 滚动时触发 | `scrollContainer` - 滚动容器元素 |
| `load-more` | 触发加载更多 | — |

## 示例

### 垂直滚动

::: demo 垂直滚动
```vue
<template>
  <XtScrollArrow direction="vertical" :height="200" :width="200">
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 8px;">
      <div v-for="i in 10" :key="i" style="height: 60px; background: #f5f7fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        项目 {{ i }}
      </div>
    </div>
  </XtScrollArrow>
</template>
```
:::

### 自定义滚动步长

::: demo 自定义滚动步长
```vue
<template>
  <XtScrollArrow :width="300" :scrollStep="50">
    <div style="display: flex; gap: 16px; padding: 8px;">
      <div v-for="i in 10" :key="i" style="width: 80px; height: 60px; background: #f5f7fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        项目 {{ i }}
      </div>
    </div>
  </XtScrollArrow>
</template>
```
:::

### 始终显示箭头

::: demo 始终显示箭头
```vue
<template>
  <XtScrollArrow :width="300" :autoHide="false">
    <div style="display: flex; gap: 16px; padding: 8px;">
      <div v-for="i in 10" :key="i" style="width: 80px; height: 60px; background: #f5f7fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        项目 {{ i }}
      </div>
    </div>
  </XtScrollArrow>
</template>
```
:::

### 结合其他组件使用

::: demo 结合按钮组使用
```vue
<template>
  <XtScrollArrow :width="400">
    <div style="display: flex; gap: 8px; padding: 8px;">
      <el-button v-for="i in 8" :key="i" type="primary" plain>按钮 {{ i }}</el-button>
    </div>
  </XtScrollArrow>
</template>
```
:::

### 动态内容

::: demo 动态内容
```vue
<template>
  <div>
    <el-button @click="addItem" style="margin-bottom: 12px;">添加项目</el-button>
    <XtScrollArrow ref="arrow" :width="300" :appendMode="true">
      <div style="display: flex; gap: 12px; padding: 8px;">
        <div v-for="item in items" :key="item.id" style="width: 80px; height: 60px; background: #f5f7fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          {{ item.name }}
        </div>
      </div>
    </XtScrollArrow>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: '项目 1' },
        { id: 2, name: '项目 2' },
        { id: 3, name: '项目 3' },
        { id: 4, name: '项目 4' },
        { id: 5, name: '项目 5' }
      ],
      count: 5
    }
  },
  methods: {
    addItem() {
      this.count++
      this.items.push({ id: this.count, name: `项目 ${this.count}` })
      // this.$nextTick(() => {
      //   this.$refs.arrow.scrollToEnd()
      // })
    }
  }
}
</script>
```
:::

### 响应式宽度

::: demo 响应式宽度
```vue
<template>
  <XtScrollArrow width="100%">
    <div style="display: flex; gap: 16px; padding: 8px;">
      <div v-for="i in 10" :key="i" style="width: 100px; height: 60px; background: #f5f7fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        项目 {{ i }}
      </div>
    </div>
  </XtScrollArrow>
</template>
```
:::

### 虚拟滚动（水平）

::: demo 虚拟滚动（水平）—— 渲染 5000 条数据
```vue
<template>
  <XtScrollArrow
    direction="horizontal"
    :v-scroll="true"
    :v-scroll-data="tagData"
    :item-size="120"
  >
    <template #vitem="{ item }">
      <div style="width: 100px; height: 40px; display: flex; align-items: center; justify-content: center; background: #ecf5ff; border-radius: 4px; margin: 0 4px; color: #409eff; font-size: 13px;">
        {{ item.label }}
      </div>
    </template>
  </XtScrollArrow>
</template>
<script>
export default {
  data() {
    return {
      tagData: Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        label: `标签 ${i + 1}`
      }))
    }
  }
}
</script>
```
:::

### 虚拟滚动（垂直）

::: demo 虚拟滚动（垂直）—— 渲染 5000 条数据
```vue
<template>
  <XtScrollArrow
    direction="vertical"
    :height="200"
    :v-scroll="true"
    :v-scroll-data="listData"
    :item-size="48"
  >
    <template #vitem="{ item, index }">
      <div style="height: 48px; display: flex; align-items: center; padding: 0 12px; border-bottom: 1px solid #ebeef5; gap: 8px;">
        <span style="color: #909399; font-size: 12px;">{{ index + 1 }}</span>
        <span>{{ item.name }}</span>
        <span style="color: #909399; font-size: 12px; margin-left: auto;">{{ item.desc }}</span>
      </div>
    </template>
  </XtScrollArrow>
</template>
<script>
export default {
  data() {
    return {
      listData: Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        name: `用户 ${i + 1}`,
        desc: `部门 ${(i % 10) + 1}`
      }))
    }
  }
}
</script>
```
:::