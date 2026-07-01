## XtScrollArrow 滚动箭头组件

滚动箭头组件用于在内容溢出时显示滚动箭头，支持水平和垂直方向的滚动。

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

## 事件说明
| 事件名称 | 说明 | 参数 |
|----------|------|------|
| `scroll` | 滚动时触发 | `scrollContainer` - 滚动容器元素 |

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
    <XtScrollArrow :width="300">
      <div style="display: flex; gap: 12px; padding: 8px;">
        <div v-for="item in items" :key="item.id" style="width: 80px; height: 60px; background: #f5f7fa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
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